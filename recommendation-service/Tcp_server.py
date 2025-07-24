import socket
import json
from models import RecommendationRequest, RecommendationResponse
from recommender import ContentRecommender

HOST = '0.0.0.0'
PORT = 9000
recommender = ContentRecommender()

def start_tcp_server():
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        s.bind((HOST, PORT))
        s.listen()
        print(f"TCP server listening on port {PORT}...")
        while True:
            conn, addr = s.accept()
            print(f"Connection from {addr}")
            with conn:
                data = conn.recv(1024)
                if not data:
                    continue
                try:
                    req = RecommendationRequest(**json.loads(data.decode()))
                    results = recommender.recommend(req.product_id)
                    response = RecommendationResponse(recommendations=results).dict()
                    conn.sendall(json.dumps(response).encode())
                except Exception as e:
                    print("Error:", e)
                    conn.sendall(b'{"error": "Invalid request"}')