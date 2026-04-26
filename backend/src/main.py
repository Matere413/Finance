from fastapi import FastAPI

from src.features.auth.router import router as auth_router
from src.features.categories.router import router as categories_router
from src.features.transactions.router import router as transactions_router
from src.features.dashboard.router import router as dashboard_router
from src.features.groups.router import router as groups_router

app = FastAPI(title="Finance App", version="0.1.0")

app.include_router(auth_router)
app.include_router(categories_router, prefix="/categories")
app.include_router(transactions_router, prefix="/transactions")
app.include_router(dashboard_router, prefix="/dashboard")
app.include_router(groups_router, prefix="/groups")


@app.get("/health")
def health():
    return {"status": "ok"}
