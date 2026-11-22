from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from database import SessionLocal, engine, Base
import models, schemas
from ml_model import predict_risk
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI(title="КиберЩит API", version="1.0")

# Разрешаем запросы с фронтенда
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/transactions/", response_model=schemas.TransactionResponse)
def create_transaction(tx: schemas.TransactionCreate, db: Session = Depends(get_db)):
    risk = predict_risk(tx.amount, tx.is_new_recipient, tx.hour_of_day)
    status = "suspicious" if risk > 0.7 else "approved"

    db_tx = models.Transaction(
        amount=tx.amount,
        recipient_inn=tx.recipient_inn,
        is_new_recipient=tx.is_new_recipient,
        hour_of_day=tx.hour_of_day,
        risk_score=risk,
        status=status
    )
    db.add(db_tx)
    db.commit()
    db.refresh(db_tx)
    return db_tx

@app.get("/api/transactions/", response_model=list[schemas.TransactionResponse])
def get_transactions(db: Session = Depends(get_db)):
    return db.query(models.Transaction).order_by(models.Transaction.id.desc()).all()

@app.post("/api/check-counterparty/")
def check_counterparty(cp: schemas.CounterpartyCheck, db: Session = Depends(get_db)):
    # Имитация проверки через ФНС (для демонстрации)
    # В реальности здесь был бы запрос к API ФНС
    import random
    score = random.randint(30, 100)
    return {
        "inn": cp.inn,
        "name": cp.name,
        "reliability_score": score,
        "verdict": "Надежный" if score > 70 else "Высокий риск"
    }