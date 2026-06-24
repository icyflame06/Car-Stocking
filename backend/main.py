import uvicorn
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware #prohibits unauthorized access
from pydantic import BaseModel
from typing import List
import car_model_db
from car_database import session, engine
from car_model_pyd import Car
from sqlalchemy.orm import Session

app = FastAPI()
origins = [
    "http://localhost:5173"
] #to give the server address of the front end  

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, #the origin that we created above
    allow_credentials=True,
    allow_methods=["*"],# to block any method or header just put it in brackets
    allow_headers=["*"],
)# to block any other unauthorized access to the backend server

car_model_db.base.metadata.create_all(bind=engine)


def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()




@app.get("/cars")
def get_cars(db: Session = Depends(get_db)):
    cars = db.query(car_model_db.Car).all()
    return cars

@app.post("/cars", response_model=Car)
def add_car(add_car: Car, db: Session = Depends(get_db)):
    db.add(car_model_db.Car(**add_car.model_dump()))
    db.commit()
    return (add_car)