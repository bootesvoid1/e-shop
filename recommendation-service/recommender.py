from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
from database import (
    get_all_products, get_product_by_id, get_products_by_category,
    search_products, get_products_by_price_range, get_top_rated_products
)
from models import ProductModel
from typing import List, Optional, Dict, Tuple
import logging
from datetime import datetime, timedelta
import threading
import time

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MySQLContentRecommender:
    def __init__(self, auto_refresh: bool = True, refresh_interval: int = 3600):
        """
        Initialize the recommender with MySQL database support

        Args:
            auto_refresh: Whether to automatically refresh the model
            refresh_interval: Refresh interval in seconds (default: 1 hour)
        """
        self.products = []
        self.tfidf_matrix = None
        self.cosine_sim = None
        self.tfidf_vectorizer = None
        self.product_index_map = {}  # Map product_id to index
        self.last_refresh = None
        self.auto_refresh = auto_refresh
        self.refresh_interval = refresh_interval
        self._lock = threading.Lock()

        # Initial model build
        self._build_model()

        # Start auto-refresh thread if enabled
        if self.auto_refresh:
            self._start_auto_refresh()

    def _start_auto_refresh(self):
        """Start the auto-refresh thread"""
        def refresh_worker():
            while self.auto_refresh:
                time.sleep(self.refresh_interval)
                try:
                    self.refresh_model()
                except Exception as e:
                    logger.error(f"Auto-refresh failed: {e}")

        refresh_thread = threading.Thread(target=refresh_worker, daemon=True)
        refresh_thread.start()
        logger.info(f"Auto-refresh enabled (interval: {self.refresh_interval}s)")

    def _build_model(self):
        """Build the TF-IDF model and cosine similarity matrix from database"""
        try:
            with self._lock:
                # Fetch products from database
                self.products = get_all_products()

                if not self.products:
                    logger.warning("No products found in database")
                    return

                # Build product index mapping
                self.product_index_map = {product.id: idx for idx, product in enumerate(self.products)}

                # Initialize TF-IDF vectorizer
                self.tfidf_vectorizer = TfidfVectorizer(
                    stop_words='english',
                    max_features=2000,
                    ngram_range=(1, 2),  # Include bigrams
                    lowercase=True,
                    min_df=1,  # Minimum document frequency
                    max_df=0.9  # Maximum document frequency
                )

                # Create feature text combining name, category, and tags with weights
                metadata = []
                for product in self.products:
                    # Weight different fields differently
                    feature_text = (
                        f"{product.name} {product.name} "  # Name is most important (2x)
                        f"{product.category} "
                        f"{product.tags or ''}"
                    )

                    # Add description if available
                    if hasattr(product, 'description') and product.description:
                        feature_text += f" {product.description}"

                    metadata.append(feature_text.strip())

                # Build TF-IDF matrix
                self.tfidf_matrix = self.tfidf_vectorizer.fit_transform(metadata)

                # Compute cosine similarity matrix
                self.cosine_sim = cosine_similarity(self.tfidf_matrix, self.tfidf_matrix)

                self.last_refresh = datetime.now()

                logger.info(f"Model built successfully with {len(self.products)} products")
                logger.info(f"TF-IDF matrix shape: {self.tfidf_matrix.shape}")

        except Exception as e:
            logger.error(f"Error building model: {e}")
            raise

    def recommend(self, product_id: int, top_n: int = 3,
                 max_price: Optional[float] = None,
                 min_rating: Optional[float] = None) -> List[ProductModel]:
        """Get content-based recommendations for a product with optional filters

        Args:
            product_id: ID of the product to recommend similar items for
            top_n: Number of recommendations to return
            max_price: Optional maximum price filter
            min_rating: Optional minimum rating filter

        Returns:
            List of recommended ProductModel objects
        """
        try:
            with self._lock:
                # Validate input
                if not isinstance(product_id, int) or product_id <= 0:
                    logger.warning(f"Invalid product_id: {product_id}")
                    return []

                # Find the product index
                if product_id not in self.product_index_map:
                    logger.warning(f"Product with ID {product_id} not found in current model")
                    return []

                product_idx = self.product_index_map[product_id]

                # Get similarity scores
                sim_scores = list(enumerate(self.cosine_sim[product_idx]))

                # Sort by similarity (descending) and exclude the product itself
                sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
                sim_scores = [score for score in sim_scores if score[0] != product_idx]

                # Apply filters and get recommendations
                recommendations = []
                for idx, similarity in sim_scores:
                    if len(recommendations) >= top_n:
                        break

                    product = self.products[idx]

                    # Apply price filter
                    if max_price is not None and product.price is not None and product.price > max_price:
                        continue

                    # Apply rating filter
                    if min_rating is not None and product.rating is not None and product.rating < min_rating:
                        continue

                    # Optionally include similarity score as metadata (e.g., for debugging)
                    # product.similarity_score = float(similarity)  # if you want to attach score

                    recommendations.append(product)

                logger.info(f"Generated {len(recommendations)} recommendations for product ID {product_id}")
                return recommendations

        except Exception as e:
            logger.error(f"Error generating recommendations for product {product_id}: {e}")
            return []

    def refresh_model(self):
        """Manually trigger a model refresh from the database"""
        logger.info("Refreshing recommendation model...")
        try:
            old_count = len(self.products) if self.products else 0
            self._build_model()
            new_count = len(self.products) if self.products else 0
            logger.info(f"Model refreshed. Product count changed: {old_count} → {new_count}")
        except Exception as e:
            logger.error(f"Failed to refresh model: {e}")
            raise

    def get_recommendations_by_category(self, category: str, top_n: int = 5,
                                       max_price: Optional[float] = None) -> List[ProductModel]:
        """Get popular or diverse recommendations within a specific category"""
        try:
            with self._lock:
                category_products = [p for p in self.products if p.category == category]

                if not category_products:
                    logger.warning(f"No products found in category: {category}")
                    return []

                # Sort by rating or popularity (you can customize this logic)
                sorted_products = sorted(
                    category_products,
                    key=lambda x: (x.rating or 0, x.popularity or 0),
                    reverse=True
                )

                filtered = []
                for p in sorted_products:
                    if max_price is not None and p.price and p.price > max_price:
                        continue
                    filtered.append(p)
                    if len(filtered) >= top_n:
                        break

                return filtered
        except Exception as e:
            logger.error(f"Error getting category recommendations for {category}: {e}")
            return []

    def search_similar_products(self, query: str, top_n: int = 5) -> List[Tuple[ProductModel, float]]:
        """Search for products similar to a text query"""
        try:
            with self._lock:
                if not query.strip():
                    return []

                # Transform query using the same vectorizer
                query_vec = self.tfidf_vectorizer.transform([query])
                sim_scores = cosine_similarity(query_vec, self.tfidf_matrix).flatten()
                sim_scores = list(enumerate(sim_scores))
                sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

                results = []
                for idx, score in sim_scores[:top_n]:
                    if score > 0:  # Only return meaningful matches
                        results.append((self.products[idx], float(score)))

                logger.info(f"Found {len(results)} products similar to query '{query}'")
                return results

        except Exception as e:
            logger.error(f"Error searching similar products for query '{query}': {e}")
            return []

    def shutdown(self):
        """Safely shut down auto-refresh background thread"""
        self.auto_refresh = False
        logger.info("Recommender system shutdown requested.")