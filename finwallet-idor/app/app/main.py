from fastapi import FastAPI
from .database import engine, Base, SessionLocal
from .models import User, Wallet, Transaction, UserRole
from .routers import users, wallets
from .auth import get_password_hash

app = FastAPI(
    title="FinWallet API",
    description="Digital Wallet Management API",
    version="1.0.0",
)

app.include_router(users.router)
app.include_router(wallets.router)


@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    seed_database()


def seed_database():
    db = SessionLocal()
    try:
        if db.query(User).first() is None:
            users_data = [
                {
                    "email": "admin@example.com",
                    "password": "admin123",
                    "full_name": "Admin User",
                    "role": UserRole.admin,
                    "wallet_balance": 10000.0,
                },
                {
                    "email": "user1@example.com",
                    "password": "user123",
                    "full_name": "Regular User",
                    "role": UserRole.user,
                    "wallet_balance": 500.0,
                },
                {
                    "email": "attacker@example.com",
                    "password": "attacker123",
                    "full_name": "Test Account",
                    "role": UserRole.user,
                    "wallet_balance": 50.0,
                },
            ]

            for user_data in users_data:
                user = User(
                    email=user_data["email"],
                    hashed_password=get_password_hash(user_data["password"]),
                    full_name=user_data["full_name"],
                    role=user_data["role"],
                )
                db.add(user)
                db.commit()
                db.refresh(user)

                wallet = Wallet(
                    name=f"{user_data['full_name']}'s Wallet",
                    balance=user_data["wallet_balance"],
                    owner_id=user.id,
                )
                db.add(wallet)
                db.commit()
                db.refresh(wallet)

                transaction = Transaction(
                    wallet_id=wallet.id,
                    amount=user_data["wallet_balance"],
                    transaction_type="credit",
                    description="Initial deposit",
                )
                db.add(transaction)
                db.commit()

    finally:
        db.close()


@app.get("/")
def root():
    return {"message": "Welcome to FinWallet API", "docs": "/docs"}


@app.get("/health")
def health_check():
    return {"status": "healthy"}
