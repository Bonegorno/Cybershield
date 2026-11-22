# 🛡️ КиберЩит — прототип системы защиты МСП

## Требования
- Python 3.10+
- Node.js 18+ и npm

## Запуск бэкенда
```bash
cd backend
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload