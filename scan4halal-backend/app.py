from flask import Flask, request, jsonify
from flask_cors import CORS
import pytesseract
from PIL import Image
from sentence_transformers import SentenceTransformer
import re
import numpy as np
from pymongo import MongoClient
from routes.rag_routes import rag_bp
from routes.ingredient_browsing_routes import ingredient_bp
from routes.scan_routes import scans_bp
from routes.ocr_routes import ocr_bp
# from db.connection import collection
# from db.connection import users_collection, collection, scan_collection
from db import collection, users_collection, scan_collection

from routes.auth_routes import auth_bp
from flask_jwt_extended import JWTManager
import os
from dotenv import load_dotenv

load_dotenv()



app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-insecure-change-me")
jwt = JWTManager(app)

# model = SentenceTransformer('all-MiniLM-L6-v2')
model = SentenceTransformer("model/ingredient_embedding_model")
# model = SentenceTransformer("")

@app.route("/")
def home():
    return "Scan4Halal Backend Running"


# Load DB connection
# client = MongoClient("mongodb+srv://fathimamazeenamycloudcubicle:QYVlulxdKT8Gh06E@scan4halalcluster0.45pcbto.mongodb.net/?retryWrites=true&w=majority&appName=Scan4HalalCluster0")

# db = client["scan4halal_db"]
# collection = db["ingredients"]


app.register_blueprint(rag_bp, url_prefix="/rag")
app.register_blueprint(ingredient_bp, url_prefix="/browse")
app.register_blueprint(ocr_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(scans_bp)



if __name__ == "__main__":
    app.run(debug=True)
