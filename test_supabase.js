const url = "https://tqvaxyfbdwzzfwftgxfi.supabase.co/rest/v1/transactions";
const headers = {
  "apikey": "sb_publishable_NyKhVIAvV-YaiKRrGkNbpg_GjuNSjHp",
  "Authorization": "Bearer sb_publishable_NyKhVIAvV-YaiKRrGkNbpg_GjuNSjHp",
  "Content-Type": "application/json",
  "Prefer": "return=representation"
};
const body = {
  type: "Sell",
  asset: "Bitcoin",
  symbol: "BTC",
  amount: "-0.1 BTC",
  value: "$100.00",
  usd_value: 100,
  status: "Completed",
  from: "Vault",
  to: "Bank"
};
fetch(url, { method: "POST", headers, body: JSON.stringify(body) })
  .then(r => r.json().then(data => ({status: r.status, data})))
  .then(console.log)
  .catch(console.error);