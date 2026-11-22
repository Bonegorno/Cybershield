import React, { useState, useEffect } from 'react';
import './App.css';

const API_URL = "http://127.0.0.1:8000/api";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [form, setForm] = useState({ amount: '', recipient_inn: '', is_new_recipient: 0, hour_of_day: 12 });
  const [counterparty, setCounterparty] = useState({ inn: '', name: '' });
  const [checkResult, setCheckResult] = useState(null);

  const fetchTransactions = async () => {
    const res = await fetch(`${API_URL}/transactions/`);
    const data = await res.json();
    setTransactions(data);
  };

  useEffect(() => { fetchTransactions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch(`${API_URL}/transactions/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: parseFloat(form.amount),
        recipient_inn: form.recipient_inn,
        is_new_recipient: parseInt(form.is_new_recipient),
        hour_of_day: parseInt(form.hour_of_day)
      })
    });
    setForm({ amount: '', recipient_inn: '', is_new_recipient: 0, hour_of_day: 12 });
    fetchTransactions();
  };

  const handleCheck = async (e) => {
    e.preventDefault();
    const res = await fetch(`${API_URL}/check-counterparty/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(counterparty)
    });
    const data = await res.json();
    setCheckResult(data);
  };

  return (
    <div className="container">
      <h1>🛡️ КиберЩит — Панель управления</h1>

      <div className="grid">
        {/* Блок 1: Проверка транзакции */}
        <div className="card">
          <h2>Проверка платежа</h2>
          <form onSubmit={handleSubmit}>
            <input placeholder="Сумма (₽)" type="number" value={form.amount}
                   onChange={e => setForm({...form, amount: e.target.value})} required />
            <input placeholder="ИНН получателя" value={form.recipient_inn}
                   onChange={e => setForm({...form, recipient_inn: e.target.value})} required />
            <label>
              <input type="checkbox" checked={form.is_new_recipient === 1}
                     onChange={e => setForm({...form, is_new_recipient: e.target.checked ? 1 : 0})} />
              Новый получатель
            </label>
            <input type="number" min="0" max="23" value={form.hour_of_day}
                   onChange={e => setForm({...form, hour_of_day: e.target.value})} />
            <button type="submit">Проверить</button>
          </form>
        </div>

        {/* Блок 2: Проверка контрагента */}
        <div className="card">
          <h2>Проверка контрагента</h2>
          <form onSubmit={handleCheck}>
            <input placeholder="ИНН" value={counterparty.inn}
                   onChange={e => setCounterparty({...counterparty, inn: e.target.value})} required />
            <input placeholder="Название компании" value={counterparty.name}
                   onChange={e => setCounterparty({...counterparty, name: e.target.value})} required />
            <button type="submit">Проверить надежность</button>
          </form>
          {checkResult && (
            <div className={`result ${checkResult.reliability_score > 70 ? 'ok' : 'warn'}`}>
              <p><b>{checkResult.name}</b> (ИНН: {checkResult.inn})</p>
              <p>Рейтинг: {checkResult.reliability_score}/100</p>
              <p>Вердикт: {checkResult.verdict}</p>
            </div>
          )}
        </div>
      </div>

      {/* Блок 3: Журнал операций */}
      <div className="card">
        <h2>Журнал операций</h2>
        <table>
          <thead>
            <tr><th>ID</th><th>Сумма</th><th>ИНН</th><th>Риск</th><th>Статус</th></tr>
          </thead>
          <tbody>
            {transactions.map(tx => (
              <tr key={tx.id} className={tx.status === 'suspicious' ? 'row-warn' : ''}>
                <td>{tx.id}</td>
                <td>{tx.amount} ₽</td>
                <td>{tx.recipient_inn}</td>
                <td>{(tx.risk_score * 100).toFixed(0)}%</td>
                <td>{tx.status === 'approved' ? '✅ Одобрено' : '⚠️ Подозрительно'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;