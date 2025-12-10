from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum

from .database import Base


class UserRole(str, enum.Enum):
    USER = "user"
    ADMIN = "admin"


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    full_name = Column(String)
    role = Column(String, default=UserRole.USER)
    credit_limit = Column(Float, default=1000.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    credit_requests = relationship("CreditRequest", back_populates="user")


class CreditRequest(Base):
    __tablename__ = "credit_requests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    previous_limit = Column(Float)
    requested_limit = Column(Float)
    status = Column(String, default="approved")
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="credit_requests")
