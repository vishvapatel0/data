from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List
from datetime import datetime

from ..database import get_db
from ..models import User, CreditRequest
from ..auth import get_current_user

router = APIRouter(prefix="/credit", tags=["credit"])


class CreditLimitResponse(BaseModel):
    user_id: int
    current_limit: float
    email: str

    class Config:
        from_attributes = True


class CreditIncreaseRequest(BaseModel):
    new_limit: float


class CreditRequestResponse(BaseModel):
    id: int
    previous_limit: float
    requested_limit: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


@router.get("/limit", response_model=CreditLimitResponse)
def get_credit_limit(current_user: User = Depends(get_current_user)):
    return CreditLimitResponse(
        user_id=current_user.id,
        current_limit=current_user.credit_limit,
        email=current_user.email
    )


@router.post("/increase", response_model=CreditRequestResponse)
def request_credit_increase(
    request: CreditIncreaseRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if request.new_limit <= current_user.credit_limit:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New limit must be greater than current limit"
        )

    if request.new_limit > 100000:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Maximum credit limit is 100000"
        )

    previous_limit = current_user.credit_limit
    current_user.credit_limit = request.new_limit
    
    credit_request = CreditRequest(
        user_id=current_user.id,
        previous_limit=previous_limit,
        requested_limit=request.new_limit,
        status="approved"
    )
    db.add(credit_request)
    db.commit()
    db.refresh(credit_request)
    
    return credit_request


@router.get("/history", response_model=List[CreditRequestResponse])
def get_credit_history(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    requests = db.query(CreditRequest).filter(
        CreditRequest.user_id == current_user.id
    ).order_by(CreditRequest.created_at.desc()).all()
    return requests
