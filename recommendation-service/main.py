# main.py
from fastapi import FastAPI, HTTPException
from recommender import ContentRecommender
from models import RecommendationRequest, RecommendationResponse
import uvicorn

app = FastAPI(title="Recommendation Microservice")
recommender = ContentRecommender()

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/recommend", response_model=RecommendationResponse)
def recommend(request: RecommendationRequest):
    try:
        results = recommender.recommend(request.product_id)
        return {"recommendations": results}
    except Exception as e:
        # Provide more specific error handling based on your recommender logic
        raise HTTPException(status_code=500, detail=f"Recommendation failed: {str(e)}")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8001)
