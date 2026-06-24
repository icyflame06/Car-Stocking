from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

db_url = "postgresql://postgres:system@localhost:5432/Database_For_Cars"
engine = create_engine(db_url, echo=True)
session = sessionmaker(autoflush=False, autocommit=False, bind=engine)