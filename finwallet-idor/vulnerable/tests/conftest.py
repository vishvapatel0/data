import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.main import app
from app.database import Base, get_db
from app.models import User, Wallet, Transaction, UserRole
from app.auth import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    yield db
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    return TestClient(app)


@pytest.fixture(scope="function")
def seeded_db(db):
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

    return db


@pytest.fixture
def user1_token(client, seeded_db):
    response = client.post(
        "/auth/login",
        json={"email": "user1@example.com", "password": "user123"},
    )
    return response.json()["access_token"]


@pytest.fixture
def attacker_token(client, seeded_db):
    response = client.post(
        "/auth/login",
        json={"email": "attacker@example.com", "password": "attacker123"},
    )
    return response.json()["access_token"]


@pytest.fixture
def admin_token(client, seeded_db):
    response = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "admin123"},
    )
    return response.json()["access_token"]
