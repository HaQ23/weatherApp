from fastapi import APIRouter, HTTPException, Body
from models import RegisterRequest, LoginRequest, CityRequest, WeatherDataRequest, City, WeatherData, RemoveCityRequest
from crud import create_user, get_user, verify_password, add_city, add_weather_data_to_city, remove_city

router = APIRouter()

@router.post("/register/")
async def register(request: RegisterRequest):
    if get_user(request.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    create_user(request.email, request.password)
    return {"message": "User registered successfully"}

@router.post("/login/")
async def login(request: LoginRequest):
    user = get_user(request.email)
    if not user or not verify_password(request.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful"}

@router.post("/add_city/")
async def add_city_endpoint(city: CityRequest = Body(...)):
    email = city.email
    try:
        message = add_city(email, City(
            city_id=city.city_id,
            name=city.name,
            weather_data=[WeatherData(**data.dict()) for data in city.weather_data]
        ))
        return message
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/city/weather/")
async def add_weather_data_endpoint(request: WeatherDataRequest = Body(...)):
    try:
        add_weather_data_to_city(request.email, request.city_id, request)
        return {"message": "Weather data added successfully"}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/cities/{email}/")
async def get_cities(email: str):
    user = get_user(email)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return {"cities": [city.dict() for city in user.cities]}

@router.delete("/remove_city/")
async def remove_city_endpoint(request: RemoveCityRequest = Body(...)):
    try:
        message = remove_city(request.email, request.city_id)
        return {"message": message}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))