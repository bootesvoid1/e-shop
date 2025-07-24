from pydantic import BaseModel, Field, validator
from typing import List, Optional, Literal
from enum import Enum
from datetime import datetime
from decimal import Decimal

class CategoryEnum(str, Enum):
    ELECTRONICS = "Electronics"
    SPORTS = "Sports"
    CLOTHING = "Clothing"

class ProductModel(BaseModel):
    id: int = Field(..., gt=0, description="Unique product identifier")
    name: str = Field(..., min_length=1, max_length=200, description="Product name")
    category: str = Field(..., description="Product category")  # Changed from CategoryEnum to str for DB flexibility
    tags: str = Field(..., min_length=1, description="Space-separated tags for the product")
    price: Optional[float] = Field(None, ge=0, description="Product price")
    rating: Optional[float] = Field(None, ge=0, le=5, description="Product rating (0-5)")
    availability: bool = Field(True, description="Whether the product is available")
    description: Optional[str] = Field(None, description="Product description")
    image_url: Optional[str] = Field(None, description="Product image URL")
    stock_quantity: Optional[int] = Field(None, ge=0, description="Stock quantity")
    
    class Config:
        # Allow population by field name or alias
        allow_population_by_field_name = True
        # Handle Decimal types from MySQL
        json_encoders = {
            Decimal: float,
            datetime: lambda v: v.isoformat()
        }
        schema_extra = {
            "example": {
                "id": 1,
                "name": "Wireless Headphones",
                "category": "Electronics",
                "tags": "audio bluetooth headphones wireless",
                "price": 99.99,
                "rating": 4.5,
                "availability": True,
                "description": "High-quality wireless headphones",
                "image_url": "https://example.com/headphones.jpg",
                "stock_quantity": 50
            }
        }

class RecommendationRequest(BaseModel):
    product_id: int = Field(..., gt=0, description="ID of the product to get recommendations for")
    top_n: int = Field(3, ge=1, le=20, description="Number of recommendations to return")
    recommendation_type: Literal["content", "category", "hybrid", "price_based", "top_rated"] = Field(
        "content", 
        description="Type of recommendation algorithm"
    )
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price filter")
    min_rating: Optional[float] = Field(None, ge=0, le=5, description="Minimum rating filter")
    
    class Config:
        schema_extra = {
            "example": {
                "product_id": 1,
                "top_n": 3,
                "recommendation_type": "content",
                "max_price": 100.0,
                "min_rating": 4.0
            }
        }

class RecommendationResponse(BaseModel):
    recommendations: List[ProductModel] = Field(..., description="List of recommended products")
    request_info: Optional[dict] = Field(None, description="Information about the request")
    total_found: int = Field(0, description="Total number of recommendations found")
    
    class Config:
        schema_extra = {
            "example": {
                "recommendations": [
                    {
                        "id": 2,
                        "name": "Smartphone",
                        "category": "Electronics",
                        "tags": "mobile phone android",
                        "price": 599.99,
                        "rating": 4.2,
                        "availability": True
                    }
                ],
                "request_info": {
                    "original_product_id": 1,
                    "recommendation_type": "content",
                    "filters_applied": ["max_price", "min_rating"]
                },
                "total_found": 1
            }
        }

class SearchRequest(BaseModel):
    query: str = Field(..., min_length=1, description="Search query")
    limit: int = Field(20, ge=1, le=100, description="Maximum number of results")
    category: Optional[str] = Field(None, description="Filter by category")
    min_price: Optional[float] = Field(None, ge=0, description="Minimum price filter")
    max_price: Optional[float] = Field(None, ge=0, description="Maximum price filter")
    min_rating: Optional[float] = Field(None, ge=0, le=5, description="Minimum rating filter")

class SearchResponse(BaseModel):
    products: List[ProductModel] = Field(..., description="Search results")
    query: str = Field(..., description="Original search query")
    total_found: int = Field(0, description="Total number of products found")
    filters_applied: List[str] = Field(default_factory=list, description="List of applied filters")

class HealthResponse(BaseModel):
    status: str
    server: str
    model_info: dict
    database_connected: bool
    timestamp: Optional[str] = None

class StatsResponse(BaseModel):
    database_stats: dict
    model_info: dict
    timestamp: Optional[str] = None

class ExplanationRequest(BaseModel):
    product_id: int = Field(..., gt=0)
    recommended_product_id: int = Field(..., gt=0)

class ExplanationResponse(BaseModel):
    explanation: str
    original_product: Optional[ProductModel] = None
    recommended_product: Optional[ProductModel] = None
    similarity_score: Optional[float] = None

class ErrorResponse(BaseModel):
    error: str
    error_code: Optional[str] = None
    timestamp: Optional[str] = None
    details: Optional[dict] = None

class PriceRangeRequest(BaseModel):
    min_price: float = Field(..., ge=0)
    max_price: float = Field(..., ge=0)
    limit: int = Field(20, ge=1, le=100)
    
    @validator('max_price')
    def validate_price_range(cls, v, values):
        if 'min_price' in values and v < values['min_price']:
            raise ValueError('max_price must be greater than or equal to min_price')
        return v

# Enhanced Action request for TCP server
class ActionRequest(BaseModel):
    action: Literal[
        "health", "stats", "hybrid_recommend", "category_recommend", 
        "explain", "refresh", "search", "price_range", "top_rated", "init_db"
    ]
    product_id: Optional[int] = None
    recommended_product_id: Optional[int] = None
    top_n: Optional[int] = 3
    query: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    min_rating: Optional[float] = None
    category: Optional[str] = None
    limit: Optional[int] = 20

    @validator('product_id')
    def validate_product_id(cls, v, values):
        action = values.get('action')
        if action in ['hybrid_recommend', 'category_recommend', 'explain'] and v is None:
            raise ValueError(f'product_id is required for action: {action}')
        return v

    @validator('recommended_product_id')
    def validate_recommended_product_id(cls, v, values):
        action = values.get('action')
        if action == 'explain' and v is None:
            raise ValueError('recommended_product_id is required for explain action')
        return v

    @validator('query')
    def validate_query(cls, v, values):
        action = values.get('action')
        if action == 'search' and not v:
            raise ValueError('query is required for search action')
        return v

class DatabaseInitRequest(BaseModel):
    force_recreate: bool = Field(False, description="Force recreate tables")
    insert_sample_data: bool = Field(True, description="Insert sample data")

class DatabaseInitResponse(BaseModel):
    success: bool
    message: str
    tables_created: List[str] = Field(default_factory=list)
    sample_data_inserted: bool = False
    total_products: int = 0