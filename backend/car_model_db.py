from sqlalchemy import Column, Integer, String, Float
from sqlalchemy.ext.declarative import declarative_base

base = declarative_base()

class Car(base):

    __tablename__ = "car"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)