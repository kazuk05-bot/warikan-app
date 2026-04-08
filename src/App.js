import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
} from "firebase/firestore";

function App() {
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [name, setName] = useState("");
  const [payer, setPayer] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("食費");
  const [date, setDate] = useState("");

  // URLからgroup取得
  const params = new URLSearchParams(window.location.search);
  const groupId = params.get("group") || "default";

  // 🔄 リアルタイム取得
  useEffect(() => {
    const q = query(collection(db, "groups", groupId, "expenses"));
    const unsub = onSnapshot(q, (snapshot) => {
      setExpenses(snapshot.docs.map((doc) => doc.data()));
    });
    return () => unsub();
  }, [groupId]);

  // メンバー追加
  const addMember = () => {
    if (!name) return;
    setMembers([...members, name]);
    setName("");
  };

  // 支出追加
  const addExpense = async () => {
    if (!payer || !amount) return;
    await addDoc(collection(db, "groups", groupId, "expenses"), {
      payer,
      amount: Number(amount),
      category,
      date,
    });
    setAmount("");
  };

  // 割り勘計算
  const calculate = () => {
    if (members.length === 0) return {};
    const total = expenses.reduce((sum, e) => sum + e.amount, 0);
    const avg = total / members.length;
    const balances = {};
    members.forEach((m) => (balances[m] = 0));
    expenses.forEach((e) => {
      balances[e.payer] += e.amount;
    });
    members.forEach((m) => {
      balances[m] -= avg;
    });
    return balances;
  };

  const balances = calculate();

  return (
    <div className="container">
      <h1>割り勘アプリ</h1>

      {/* メンバー */}
      <div className="card">
        <h2>メンバー</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="名前"
        />
        <button onClick={addMember}>追加</button>
        <ul>
          {members.map((m, i) => (
            <li key={i}>{m}</li>
          ))}
        </ul>
      </div>

      {/* 支出 */}
      <div className="card">
        <h2>支出追加</h2>
        <select value={payer} onChange={(e) => setPayer(e.target.value)}>
          <option value="">支払者</option>
          {members.map((m, i) => (
            <option key={i}>{m}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="金額"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option>食費</option>
          <option>交通費</option>
          <option>行楽費</option>
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={addExpense}>追加</button>
      </div>

      {/* 支出一覧 */}
      <div className="card">
        <h2>支出一覧</h2>
        <ul>
          {expenses.map((e, i) => (
            <li key={i}>
              {e.date} / {e.payer} / {e.amount}円 / {e.category}
            </li>
          ))}
        </ul>
      </div>

      {/* 精算 */}
      <div className="card">
        <h2>精算結果</h2>
        <ul>
          {Object.entries(balances).map(([name, value]) => (
            <li key={name}>
              {name}: {Math.round(value)}円
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;