from fastapi import FastAPI
from contextlib import asynccontextmanager

from .database import engine, Base, SessionLocal
from .models import User, CreditRequest
from .auth import get_password_hash
from .routers import users, credit


@asynccontextmanager
async def lifespan(app: FastAPI):
    Base.metadata.create_all(bind=engine)
    
    db = SessionLocal()
    try:
        if not db.query(User).first():
            users_data = [
                User(
                    email="admin@example.com",
                    hashed_password=get_password_hash("admin123"),
                    full_name="Admin User",
                    role="admin",
                    credit_limit=50000.0
                ),
                User(
                    email="user1@example.com",
                    hashed_password=get_password_hash("user123"),
                    full_name="Regular User",
                    role="user",
                    credit_limit=5000.0
                ),
                User(
                    email="attacker@example.com",
                    hashed_password=get_password_hash("attacker123"),
                    full_name="Attacker User",
                    role="user",
                    credit_limit=2000.0
                ),
            ]
            for user in users_data:
                db.add(user)
            db.commit()
    finally:
        db.close()
    
    yield


app = FastAPI(
    title="Banking Credit Limit API",
    description="API for managing customer credit limits",
    version="1.0.0",
    lifespan=lifespan
)

app.include_router(users.router)
app.include_router(credit.router)


@app.get("/")
def root():
    return {"message": "Banking Credit Limit API", "version": "1.0.0"}


@app.get("/health")
def health():
    return {"status": "healthy"}
