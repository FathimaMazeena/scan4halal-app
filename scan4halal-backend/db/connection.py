# import os
# from pymongo import MongoClient
# from dotenv import load_dotenv

# load_dotenv()

# client = MongoClient(os.getenv("MONGO_URI"))
# db = client[os.getenv("MONGO_DB")]

# collection = db[os.getenv("MONGO_COLLECTION")]
# users_collection = db[os.getenv("USERS_COLLECTION")]
# scan_collection = db[os.getenv("SCAN_COLLECTION")]

from pymongo import MongoClient
import os
from dotenv import load_dotenv

load_dotenv()  # <-- load env variables first

client = MongoClient(os.getenv("MONGO_URI"))
db = client[os.getenv("MONGO_DB")]

# Collections
users_collection = db[os.getenv("USERS_COLLECTION")]
collection = db[os.getenv("MONGO_COLLECTION")]
scan_collection = db[os.getenv("SCAN_COLLECTION")]
