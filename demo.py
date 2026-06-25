from fastapi import FastAPI, Depends
from models import Product
from database import session, engine
import database_models
from sqlalchemy.orm import Session
app = FastAPI()

database_models.base.metadata.create_all(bind=engine)

@app.get("/")
def greet():
    return "Greetingsssss"

products = [
    Product(id=1, name="Phone", description="Budget Phone", price=99, quantity=100),
    Product(id=2, name="Laptop", description="Budget Laptop", price=999, quantity=100),
    Product(id=3, name="Cricke Bat", description="English Willow bat", price=100, quantity=100)
]

def get_db():
    db = session()
    try:
        yield db
    finally:
        db.close()

#getting data in the database (postgresql)
def init_db():
    db = session()

    count = db.query(database_models.Product).count # to count the rows in the sql table so that the it doesn't give an error

    if count == 0:
        for product in products:
            db.add(database_models.Product(**product.model_dump())) #using the database_models.py file

        db.commit()
        count = 1


init_db()


#to get details of all the products
@app.get("/products")
def get_all_products(db: Session = Depends(get_db)): #using dependencies

    db_products = db.query(database_models.Product).all() #to get all the details from the database
       
    return db_products

#to get details by ID
@app.get("/product/{uid}")
def get_product_by_ID(uid: int, db: Session = Depends(get_db)):
    db_product = db.query(database_models.Product).filter(database_models.Product.id == uid).first()  
    if db_product:
        return db_product
    return "No such product found"

#to add a product 
@app.post("/product")
def add_product(add_product: Product, db: Session = Depends(get_db)):
    db.add(database_models.Product(**add_product.model_dump())) #** is used to unpack the pydentic model
    db.commit()
    return(add_product)

#to update a product
@app.put("/product")
def update_product(pid: int, update_product: Product, db: Session = Depends(get_db)):
    
    db_product = db.query(database_models.Product).filter(database_models.Product.id == pid).first()

    if db_product:
       db_product.name = update_product.name
       db_product.description = update_product.description
       db_product.price = update_product.price
       db_product.quantity = update_product.quantity
       db.commit()
       return "Product updated successfully"
        
    return "No such ID found"


#to delete a product
@app.delete("/product")
def delete_product(pid: int, db: Session = Depends(get_db)):
    
    db_product = db.query(database_models.Product).filter(database_models.Product.id == pid).first()

    if db_product:
        db.delete(db_product)
        db.commit()
        return "Product deleted"
    return "No such product"