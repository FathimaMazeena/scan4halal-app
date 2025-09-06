# import json
# from pymongo import MongoClient
# import os
# from dotenv import load_dotenv


# load_dotenv()
# client = MongoClient(os.getenv("MONGO_URI"))
# db = client[os.getenv("MONGO_DB")]
# collection = db[os.getenv("MONGO_COLLECTION")]
# users_collection = db[os.getenv("MONGO_COLLECTION_USERS")]

# # Load your JSON file

# with open("embedded_dataset3.json", "r", encoding="utf-8") as file:
#     data = json.load(file)    

# # Insert all at once
# if isinstance(data, list):
#     collection.insert_many(data)
# else:
#     collection.insert_one(data)

# print("Data inserted successfully!")


# import json
# from db.connection import collection  # <-- use the reusable connection

# # Load your JSON file
# with open("embedded_dataset3.json", "r", encoding="utf-8") as file:
#     data = json.load(file)

# # Insert all at once
# if isinstance(data, list):
#     collection.insert_many(data)
# else:
#     collection.insert_one(data)

# print("Data inserted successfully!")

import json
# from db.connection import collection 
from db import collection # import connection only

def seed_data():
    with open("embedded_dataset3.json", "r", encoding="utf-8") as file:
        data = json.load(file)

    if isinstance(data, list):
        collection.insert_many(data)
    else:
        collection.insert_one(data)

    print("Data inserted successfully!")

if __name__ == "__main__":
    seed_data()

