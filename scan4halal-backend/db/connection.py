import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]

collection = db[os.getenv("MONGO_COLLECTION")]
users_collection = db[os.getenv("MONGO_COLLECTION_USERS")]
