from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from ..database import get_db
from ..models import User, Wallet, Transaction
from ..auth import get_current_user

router = APIRouter(prefix="/wallets", tags=["wallets"])


class WalletResponse(BaseModel):
    id: int
    name: str
    balance: float
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True


class TransactionResponse(BaseModel):
    id: int
    wallet_id: int
    amount: float
    transaction_type: str
    description: str
    recipient_wallet_id: Optional[int]
    created_at: datetime

    class Config:
        from_attributes = True


class TransferRequest(BaseModel):
    recipient_wallet_id: int
    amount: float
    description: Optional[str] = "Transfer"


@router.get("/{wallet_id}", response_model=WalletResponse)
def get_wallet(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wallet not found",
        )
    return wallet


@router.get("/{wallet_id}/transactions", response_model=List[TransactionResponse])
def get_wallet_transactions(
    wallet_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Wallet not found",
        )
    transactions = (
        db.query(Transaction)
        .filter(Transaction.wallet_id == wallet_id)
        .order_by(Transaction.created_at.desc())
        .all()
    )
    return transactions


@router.post("/{wallet_id}/transfer", response_model=TransactionResponse)
def transfer_funds(
    wallet_id: int,
    transfer_data: TransferRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    source_wallet = db.query(Wallet).filter(Wallet.id == wallet_id).first()
    if not source_wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Source wallet not found",
        )

    if source_wallet.balance < transfer_data.amount:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Insufficient funds",
        )

    recipient_wallet = (
        db.query(Wallet).filter(Wallet.id == transfer_data.recipient_wallet_id).first()
    )
    if not recipient_wallet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Recipient wallet not found",
        )

    source_wallet.balance -= transfer_data.amount
    recipient_wallet.balance += transfer_data.amount

    transaction = Transaction(
        wallet_id=wallet_id,
        amount=-transfer_data.amount,
        transaction_type="transfer",
        description=transfer_data.description,
        recipient_wallet_id=transfer_data.recipient_wallet_id,
    )
    db.add(transaction)

    recipient_transaction = Transaction(
        wallet_id=transfer_data.recipient_wallet_id,
        amount=transfer_data.amount,
        transaction_type="transfer",
        description=f"Received from wallet {wallet_id}",
        recipient_wallet_id=None,
    )
    db.add(recipient_transaction)

    db.commit()
    db.refresh(transaction)

    return transaction


@router.get("/", response_model=List[WalletResponse])
def list_my_wallets(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    wallets = db.query(Wallet).filter(Wallet.owner_id == current_user.id).all()
    return wallets
