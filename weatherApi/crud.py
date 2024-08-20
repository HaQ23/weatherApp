from models import User, City, WeatherDataRequest, WeatherData
from database import users_collection
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def create_user(email: str, password: str):
    hashed_password = pwd_context.hash(password)
    user = User(email=email, hashed_password=hashed_password)
    users_collection.insert_one(user.dict())

def get_user(email: str) -> User:
    user_data = users_collection.find_one({"email": email})
    if user_data:
       
        return User(**user_data)
    return None

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def add_city(email: str, city: City):
    user = get_user(email)
    if user is None:
        raise ValueError("User not found")
    if len(user.cities) >= 10:
        return "User cannot have more than 10 cities"
    existing_city = next((c for c in user.cities if c.city_id == city.city_id), None)
    if existing_city:
        return "City already exists."
    user.cities.append(city)
    users_collection.update_one({"email": email}, {"$set": {"cities": [c.dict() for c in user.cities]}})
    return city.dict()

def add_weather_data_to_city(email: str, city_id: str, weather_data: WeatherDataRequest):
    user = get_user(email)
    if user is None:
        raise ValueError("User not found")

    city = next((c for c in user.cities if c.city_id == city_id), None)
    if city is None:
        raise ValueError("City not found")

    city.weather_data.append(WeatherData(**weather_data.dict()))
    users_collection.update_one({"email": email}, {"$set": {"cities": [c.dict() for c in user.cities]}})

def remove_city(email: str, city_id: str):
    user = get_user(email)
    if user is None:
        raise ValueError("User not found")


    city_to_remove = next((c for c in user.cities if c.city_id == city_id), None)
    if city_to_remove is None:
        raise ValueError("City not found")


    user.cities = [c for c in user.cities if c.city_id != city_id]

    users_collection.update_one({"email": email}, {"$set": {"cities": [c.dict() for c in user.cities]}})
    return "City removed successfully."
