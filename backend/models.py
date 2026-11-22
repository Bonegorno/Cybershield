from sqlalchemy import Column, Integer, String, Float, DateTime
from datetime import datetime
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    amount = Column(Float)
    recipient_inn = Column(String)
    is_new_recipient = Column(Integer)  # 1 - новый, 0 - старый
    hour_of_day = Column(Integer)
    risk_score = Column(Float)
    status = Column(String)  # "approved" или "suspicious"
    created_at = Column(DateTime, default=datetime.utcnow)

class Counterparty(Base):
    __tablename__ = "counterparties"

    id = Column(Integer, primary_key=True, index=True)
    inn = Column(String, unique=True, index=True)
    name = Column(String)
    reliability_score = Column(Integer)  # от 0 до 100