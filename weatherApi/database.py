from pymongo import MongoClient

client = MongoClient("mongodb://localhost:27017/")
db = client["weather_app"]
users_collection = db["users"]
cities_collection = db["cities"]
