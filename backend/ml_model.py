import numpy as np
from sklearn.ensemble import RandomForestClassifier

# Обучаем простую модель на синтетических данных (для демонстрации)
# Признаки: [сумма, новый_получатель(0/1), час_дня]
X_train = np.array([
    [1000, 0, 14], [5000, 0, 12], [500, 0, 10], [2000, 0, 16],  # Нормальные
    [150000, 1, 3], [200000, 1, 2], [100000, 1, 23], [300000, 1, 1]  # Подозрительные
])
y_train = np.array([0, 0, 0, 0, 1, 1, 1, 1])

model = RandomForestClassifier(n_estimators=10, random_state=42)
model.fit(X_train, y_train)

def predict_risk(amount: float, is_new_recipient: int, hour_of_day: int) -> float:
    """Возвращает вероятность мошенничества от 0 до 1"""
    features = np.array([[amount, is_new_recipient, hour_of_day]])
    probability = model.predict_proba(features)[0][1]
    return round(float(probability), 2)