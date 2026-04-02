from fastapi import FastAPI

app = FastAPI(title="AI Sandbox", version="0.1.0")


@app.get("/")
def root():
    return {"message": "AI Sandbox is running"}
