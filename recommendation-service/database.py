import mysql.connector
from mysql.connector import Error
from models import ProductModel
from typing import List, Optional
import logging
from contextlib import contextmanager
import os
from dataclasses import dataclass

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

@dataclass
class DatabaseConfig:
    """Database configuration class"""
    host: str = os.getenv('DB_HOST', 'localhost')
    port: int = int(os.getenv('DB_PORT', '3306'))
    database: str = os.getenv('DB_NAME', 'e-shop-product-db')
    user: str = os.getenv('DB_USER', 'root')
    password: str = os.getenv('DB_PASSWORD', '')
    charset: str = 'utf8mb4'
    autocommit: bool = True
    pool_name: str = 'product_pool'
    pool_size: int = 10
    pool_reset_session: bool = True

class DatabaseConnection:
    """Database connection manager with connection pooling"""
    
    def __init__(self, config: DatabaseConfig = None):
        self.config = config or DatabaseConfig()
        self.connection_pool = None
        self._initialize_pool()
    
    def _initialize_pool(self):
        """Initialize the connection pool"""
        try:
            self.connection_pool = mysql.connector.pooling.MySQLConnectionPool(
                pool_name=self.config.pool_name,
                pool_size=self.config.pool_size,
                pool_reset_session=self.config.pool_reset_session,
                host=self.config.host,
                port=self.config.port,
                database=self.config.database,
                user=self.config.user,
                password=self.config.password,
                charset=self.config.charset,
                autocommit=self.config.autocommit
            )
            logger.info(f"Database connection pool initialized successfully")
            
        except Error as e:
            logger.error(f"Error creating connection pool: {e}")
            raise
    
    @contextmanager
    def get_connection(self):
        """Get a connection from the pool"""
        connection = None
        try:
            connection = self.connection_pool.get_connection()
            yield connection
        except Error as e:
            logger.error(f"Database connection error: {e}")
            raise
        finally:
            if connection and connection.is_connected():
                connection.close()

# Global database connection instance
db_connection = DatabaseConnection()

def create_products_table():
    """Create the products table if it doesn't exist"""
    create_table_query = """
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        category VARCHAR(100) NOT NULL,
        tags TEXT,
        price DECIMAL(10, 2) DEFAULT NULL,
        rating DECIMAL(2, 1) DEFAULT NULL,
        availability BOOLEAN DEFAULT TRUE,
        description TEXT,
        image_url VARCHAR(500),
        stock_quantity INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_category (category),
        INDEX idx_availability (availability),
        FULLTEXT idx_search (name, tags, description)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    """
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(create_table_query)
            logger.info("Products table created/verified successfully")
            
    except Error as e:
        logger.error(f"Error creating products table: {e}")
        raise

def insert_sample_data():
    """Insert sample data into the products table"""
    sample_products = [
        (1, "Wireless Headphones", "Electronics", "audio bluetooth headphones wireless music", 99.99, 4.5, True, "High-quality wireless headphones with noise cancellation", "https://example.com/headphones.jpg", 50),
        (2, "Smartphone", "Electronics", "mobile phone android communication device", 699.99, 4.3, True, "Latest Android smartphone with advanced camera", "https://example.com/smartphone.jpg", 30),
        (3, "Laptop", "Electronics", "computer laptop windows work productivity", 999.99, 4.4, True, "Powerful laptop for work and gaming", "https://example.com/laptop.jpg", 20),
        (4, "Running Shoes", "Sports", "shoes running sports fitness athletic", 129.99, 4.6, True, "Comfortable running shoes for all terrains", "https://example.com/shoes.jpg", 100),
        (5, "T-Shirt Cotton", "Clothing", "shirt cotton casual comfort wear", 24.99, 4.2, True, "100% cotton comfortable t-shirt", "https://example.com/tshirt.jpg", 200),
        (6, "Bluetooth Speaker", "Electronics", "audio bluetooth speaker portable music", 79.99, 4.4, True, "Portable Bluetooth speaker with excellent sound", "https://example.com/speaker.jpg", 75),
        (7, "Gaming Mouse", "Electronics", "mouse gaming computer peripheral", 59.99, 4.7, True, "High-precision gaming mouse", "https://example.com/mouse.jpg", 40),
        (8, "Yoga Mat", "Sports", "yoga mat fitness exercise sports", 39.99, 4.5, True, "Non-slip yoga mat for all exercises", "https://example.com/yogamat.jpg", 60),
        (9, "Jeans", "Clothing", "jeans denim casual pants clothing", 79.99, 4.3, True, "Classic denim jeans", "https://example.com/jeans.jpg", 80),
        (10, "Tablet", "Electronics", "tablet mobile device android entertainment", 299.99, 4.1, True, "10-inch tablet for entertainment and work", "https://example.com/tablet.jpg", 25),
        (11, "Tennis Racket", "Sports", "tennis racket sports equipment game", 149.99, 4.6, True, "Professional tennis racket", "https://example.com/racket.jpg", 15),
        (12, "Hoodie", "Clothing", "hoodie sweatshirt casual warm clothing", 49.99, 4.4, True, "Comfortable hoodie for casual wear", "https://example.com/hoodie.jpg", 90),
        (13, "Smartwatch", "Electronics", "smartwatch fitness tracker wearable health", 249.99, 4.5, True, "Advanced smartwatch with health tracking", "https://example.com/smartwatch.jpg", 35),
        (14, "Basketball", "Sports", "basketball sports ball game equipment", 29.99, 4.3, True, "Official size basketball", "https://example.com/basketball.jpg", 45),
        (15, "Dress Shirt", "Clothing", "shirt formal business professional clothing", 59.99, 4.2, True, "Professional dress shirt", "https://example.com/dress_shirt.jpg", 70)
    ]
    
    insert_query = """
    INSERT INTO products (id, name, category, tags, price, rating, availability, description, image_url, stock_quantity) 
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
    ON DUPLICATE KEY UPDATE
    name = VALUES(name),
    category = VALUES(category),
    tags = VALUES(tags),
    price = VALUES(price),
    rating = VALUES(rating),
    availability = VALUES(availability),
    description = VALUES(description),
    image_url = VALUES(image_url),
    stock_quantity = VALUES(stock_quantity)
    """
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor()
            cursor.executemany(insert_query, sample_products)
            conn.commit()
            logger.info(f"Inserted {cursor.rowcount} sample products")
            
    except Error as e:
        logger.error(f"Error inserting sample data: {e}")
        raise

def get_product_by_id(product_id: int) -> Optional[ProductModel]:
    """Get a product by its ID"""
    query = "SELECT id, name, category, tags, price, rating, availability FROM products WHERE id = %s"
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (product_id,))
            result = cursor.fetchone()
            
            if result:
                return ProductModel(**result)
            return None
            
    except Error as e:
        logger.error(f"Error fetching product {product_id}: {e}")
        return None

def get_all_products(limit: int = None, offset: int = 0) -> List[ProductModel]:
    """Get all products from the database"""
    query = "SELECT id, name, category, tags, price, rating, availability FROM products WHERE availability = TRUE"
    
    if limit:
        query += f" LIMIT {limit} OFFSET {offset}"
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query)
            results = cursor.fetchall()
            
            return [ProductModel(**row) for row in results]
            
    except Error as e:
        logger.error(f"Error fetching all products: {e}")
        return []

def get_products_by_category(category: str, limit: int = None) -> List[ProductModel]:
    """Get all products in a specific category"""
    query = """
    SELECT id, name, category, tags, price, rating, availability 
    FROM products 
    WHERE category = %s AND availability = TRUE
    """
    
    if limit:
        query += f" LIMIT {limit}"
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (category,))
            results = cursor.fetchall()
            
            return [ProductModel(**row) for row in results]
            
    except Error as e:
        logger.error(f"Error fetching products by category {category}: {e}")
        return []

def search_products(query: str, limit: int = 20) -> List[ProductModel]:
    """Search products by name, tags, or description using full-text search"""
    search_query = """
    SELECT id, name, category, tags, price, rating, availability,
           MATCH(name, tags, description) AGAINST(%s IN NATURAL LANGUAGE MODE) AS relevance
    FROM products 
    WHERE availability = TRUE 
    AND (MATCH(name, tags, description) AGAINST(%s IN NATURAL LANGUAGE MODE)
         OR name LIKE %s 
         OR tags LIKE %s 
         OR category LIKE %s)
    ORDER BY relevance DESC, rating DESC
    LIMIT %s
    """
    
    search_term = f"%{query}%"
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(search_query, (query, query, search_term, search_term, search_term, limit))
            results = cursor.fetchall()
            
            return [ProductModel(**{k: v for k, v in row.items() if k != 'relevance'}) for row in results]
            
    except Error as e:
        logger.error(f"Error searching products: {e}")
        return []

def get_products_by_price_range(min_price: float, max_price: float, limit: int = 20) -> List[ProductModel]:
    """Get products within a price range"""
    query = """
    SELECT id, name, category, tags, price, rating, availability 
    FROM products 
    WHERE price BETWEEN %s AND %s AND availability = TRUE
    ORDER BY price ASC
    LIMIT %s
    """
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (min_price, max_price, limit))
            results = cursor.fetchall()
            
            return [ProductModel(**row) for row in results]
            
    except Error as e:
        logger.error(f"Error fetching products by price range: {e}")
        return []

def get_top_rated_products(limit: int = 10) -> List[ProductModel]:
    """Get top-rated products"""
    query = """
    SELECT id, name, category, tags, price, rating, availability 
    FROM products 
    WHERE availability = TRUE AND rating IS NOT NULL
    ORDER BY rating DESC, name ASC
    LIMIT %s
    """
    
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            cursor.execute(query, (limit,))
            results = cursor.fetchall()
            
            return [ProductModel(**row) for row in results]
            
    except Error as e:
        logger.error(f"Error fetching top-rated products: {e}")
        return []

def get_database_stats() -> dict:
    """Get database statistics"""
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor(dictionary=True)
            
            # Get total products
            cursor.execute("SELECT COUNT(*) as total FROM products")
            total = cursor.fetchone()['total']
            
            # Get available products
            cursor.execute("SELECT COUNT(*) as available FROM products WHERE availability = TRUE")
            available = cursor.fetchone()['available']
            
            # Get products by category
            cursor.execute("""
                SELECT category, COUNT(*) as count 
                FROM products 
                WHERE availability = TRUE 
                GROUP BY category
            """)
            categories = {row['category']: row['count'] for row in cursor.fetchall()}
            
            # Get price statistics
            cursor.execute("""
                SELECT 
                    MIN(price) as min_price,
                    MAX(price) as max_price,
                    AVG(price) as avg_price,
                    AVG(rating) as avg_rating
                FROM products 
                WHERE availability = TRUE AND price IS NOT NULL
            """)
            price_stats = cursor.fetchone()
            
            return {
                "total_products": total,
                "available_products": available,
                "categories": categories,
                "price_stats": {
                    "min_price": float(price_stats['min_price']) if price_stats['min_price'] else 0,
                    "max_price": float(price_stats['max_price']) if price_stats['max_price'] else 0,
                    "avg_price": round(float(price_stats['avg_price']), 2) if price_stats['avg_price'] else 0,
                    "avg_rating": round(float(price_stats['avg_rating']), 2) if price_stats['avg_rating'] else 0
                }
            }
            
    except Error as e:
        logger.error(f"Error getting database stats: {e}")
        return {"error": str(e)}

def test_database_connection() -> bool:
    """Test the database connection"""
    try:
        with db_connection.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT 1")
            cursor.fetchone()
            logger.info("Database connection test successful")
            return True
            
    except Error as e:
        logger.error(f"Database connection test failed: {e}")
        return False

def initialize_database():
    """Initialize the database with tables and sample data"""
    try:
        logger.info("Initializing database...")
        
        # Test connection
        if not test_database_connection():
            raise Exception("Database connection failed")
        
        # Create tables
        create_products_table()
        
        # Insert sample data
        insert_sample_data()
        
        logger.info("Database initialization completed successfully")
        
    except Exception as e:
        logger.error(f"Database initialization failed: {e}")
        raise

# Initialize database on module import
if __name__ == "__main__":
    initialize_database()
else:
    # Verify connection on import
    try:
        test_database_connection()
    except Exception as e:
        logger.warning(f"Database connection verification failed on import: {e}")