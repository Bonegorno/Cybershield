from pydantic import BaseModel
from datetime import datetime

class TransactionCreate(BaseModel):
    amount: float
    recipient_inn: str
    is_new_recipient: int
    hour_of_day: int

class TransactionResponse(BaseModel):
    id: int
    amount: float
    risk_score: float
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

class CounterpartyCheck(BaseModel):
    inn: str
    name: str