from fastapi import FastAPI

from app.database import Base, engine

Base.metadata.create_all(bind=engine)

app = FastAPI(title="Patient Portal API", version="0.1.0")


@app.get("/")
def root():
    return {"message": "Patient Portal API is running"}
