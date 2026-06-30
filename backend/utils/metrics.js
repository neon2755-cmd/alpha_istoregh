// Simple in-memory metrics for auth timings (dev only)
const MAX_ENTRIES = 2000;

const authDurations = []; // { email, ms, ts }

function addLoginDuration(email, ms) {
  authDurations.push({ email, ms, ts: Date.now() });
  if (authDurations.length > MAX_ENTRIES) authDurations.shift();
}

function getAuthMetrics() {
  const values = authDurations.map(e => e.ms).sort((a,b)=>a-b);
  const count = values.length;
  if (!count) return { count: 0 };
  const sum = values.reduce((s,x)=>s+x,0);
  const avg = sum / count;
  const p50 = values[Math.floor(count * 0.5)];
  const p95 = values[Math.floor(count * 0.95)];
  const latest = authDurations.slice(-20).map(e=>({email:e.email,ms:e.ms,ts:e.ts})).reverse();
  return { count, avg: Math.round(avg), p50, p95, latest };
}

module.exports = { addLoginDuration, getAuthMetrics };
