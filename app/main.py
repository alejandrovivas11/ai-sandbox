from fastapi import FastAPI

app = FastAPI(title="Patient Portal API", version="0.1.0")


@app.get("/")
def root():
    return {"message": "AI Sandbox is running"}


@app.get("/health")
def health():
    return {"status": "ok"}
