from pydantic import BaseModel, field_validator
from typing import List
from datetime import datetime


class WeatherDataRequest(BaseModel):
    email:str
    city_id:str
    temperature: float
    humidity: float
    timestamp: datetime
    @field_validator('timestamp', mode='before')
    def validate_timestamp(cls, value):
        try:

            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        except ValueError:
            raise ValueError("Invalid timestamp format")

class WeatherData(BaseModel):
    temperature: float
    humidity: float
    timestamp: datetime

class CityRequest(BaseModel):
    email: str
    city_id: str
    name: str
    weather_data: List[WeatherData]
    @field_validator('weather_data', mode='before')
    def validate_weather_data(cls, value):
        return value

class User(BaseModel):
    email: str
    hashed_password: str
    cities: List['City'] = []


class City(BaseModel):
    city_id: str
    name: str
    weather_data: List[WeatherData] = []


class RegisterRequest(BaseModel):
    email: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str


class RemoveCityRequest(BaseModel):
    email: str
    city_id: str