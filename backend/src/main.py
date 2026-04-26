from fastapi import FastAPI

from src.features.auth.router import router as auth_router

app = FastAPI(title="Finance App", version="0.1.0")

app.include_router(auth_router)


@app.get("/health")
def health():
    return {"status": "ok"}
