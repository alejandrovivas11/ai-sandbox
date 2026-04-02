from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.database import Base, engine


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(title="Patient Portal API", version="0.1.0", lifespan=lifespan)


@app.get("/")
def root():
    return {"message": "Patient Portal API is running"}
