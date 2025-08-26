import json
from pymongo import MongoClient

# Connect to MongoDB
# client = MongoClient("mongodb+srv://fathimamazeenamycloudcubicle:pPBXM39KX0bikbuX@scan4halalcluster0.45pcbto.mongodb.net/?retryWrites=true&w=majority&appName=Scan4HalalCluster0")
client = MongoClient("mongodb+srv://fathimamazeenamycloudcubicle:QYVlulxdKT8Gh06E@scan4halalcluster0.45pcbto.mongodb.net/?retryWrites=true&w=majority&appName=Scan4HalalCluster0")

db = client["scan4halal_db"]
collection = db["ingredients"]


# Load your JSON file

with open("embedded_dataset2.json", "r", encoding="utf-8") as file:
    data = json.load(file)    

# Insert all at once
if isinstance(data, list):
    collection.insert_many(data)
else:
    collection.insert_one(data)

print("Data inserted successfully!")
