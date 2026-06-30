// Simple in-memory metrics for auth timings (dev only)
const fs = require('fs');
const path = require('path');
const MAX_ENTRIES = 2000;
const PERSIST_PATH = path.join(__dirname, '..', 'metrics.jsonl');

const authDurations = []; // { email, ms, ts }

// Load persisted metrics (if any)
try {
  if (fs.existsSync(PERSIST_PATH)) {
    const data = fs.readFileSync(PERSIST_PATH, 'utf8').trim().split(/\r?\n/).filter(Boolean);
    for (const line of data) {
      try {
        const obj = JSON.parse(line);
        authDurations.push(obj);
      } catch {}
    }
  }
} catch (e) {
  console.error('Could not load persisted metrics:', e.message);
}

function persistEntry(entry) {
  try {
    fs.appendFile(PERSIST_PATH, JSON.stringify(entry) + '\n', (err) => {
      if (err) console.error('Failed to persist metric:', err.message);
    });
  } catch (e) {
    console.error('Failed to persist metric:', e.message);
  }
}

function addLoginDuration(email, ms) {
  const entry = { email, ms, ts: Date.now() };
  authDurations.push(entry);
  if (authDurations.length > MAX_ENTRIES) authDurations.shift();
  persistEntry(entry);
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
