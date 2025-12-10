import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

from app.database import Base, get_db
from app.main import app
from app.models import User
from app.auth import get_password_hash

SQLALCHEMY_DATABASE_URL = "sqlite://"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def override_get_db():
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db


@pytest.fixture(scope="function")
def db():
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    
    users = [
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
    for user in users:
        db.add(user)
    db.commit()
    
    yield db
    
    db.close()
    Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db):
    return TestClient(app)


@pytest.fixture
def admin_token(client):
    response = client.post(
        "/auth/login",
        json={"email": "admin@example.com", "password": "admin123"}
    )
    return response.json()["access_token"]


@pytest.fixture
def user_token(client):
    response = client.post(
        "/auth/login",
        json={"email": "user1@example.com", "password": "user123"}
    )
    return response.json()["access_token"]


@pytest.fixture
def attacker_token(client):
    response = client.post(
        "/auth/login",
        json={"email": "attacker@example.com", "password": "attacker123"}
    )
    return response.json()["access_token"]
