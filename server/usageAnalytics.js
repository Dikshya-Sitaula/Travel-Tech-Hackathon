import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

const DATA_DIRECTORY = resolve(process.cwd(), 'data');
const DATA_FILE = resolve(DATA_DIRECTORY, 'usage-analytics.json');
const LIMITS = { itinerary: 3, chat: 10, landmark: 1 };
const PREMIUM_PRICE_NPR = 999;

const respond = (response, status, body) => {
  response.statusCode = status;
  response.setHeader('Content-Type', 'application/json');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  response.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.end(JSON.stringify(body));
};

const readJsonBody = (request) => new Promise((resolveBody, reject) => {
  let body = '';
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 25_000) reject(new Error('Request is too large.'));
  });
  request.on('end', () => {
    try { resolveBody(JSON.parse(body || '{}')); } catch { reject(new Error('Invalid JSON request.')); }
  });
  request.on('error', reject);
});

const emptyStore = () => ({ version: 1, users: {} });

const loadStore = async () => {
  try {
    return JSON.parse(await readFile(DATA_FILE, 'utf8'));
  } catch (error) {
    if (error.code === 'ENOENT') return emptyStore();
    throw error;
  }
};

const saveStore = async (store) => {
  await mkdir(DATA_DIRECTORY, { recursive: true });
  await writeFile(DATA_FILE, `${JSON.stringify(store, null, 2)}\n`, 'utf8');
};

const normalizeUser = (store, userId) => {
  const current = store.users[userId] || {};
  return {
    userId,
    plan: current.plan === 'premium' ? 'premium' : 'free',
    usage: { itinerary: Number(current.usage?.itinerary) || 0, chat: Number(current.usage?.chat) || 0, landmark: Number(current.usage?.landmark) || 0 },
    createdAt: current.createdAt || new Date().toISOString(),
    updatedAt: current.updatedAt || new Date().toISOString(),
  };
};

const publicUsage = (user) => ({
  plan: user.plan,
  usage: user.usage,
  limits: user.plan === 'premium' ? { itinerary: null, chat: null, landmark: null } : LIMITS,
  premiumPriceNpr: PREMIUM_PRICE_NPR,
});

export const handleUsage = async (request, response) => {
  try {
    if (request.method === 'OPTIONS') return respond(response, 204, {});
    const store = await loadStore();
    if (request.method === 'GET') {
      const url = new URL(request.url, 'http://localhost');
      const userId = String(url.searchParams.get('userId') || '').trim().toLowerCase();
      if (!userId) return respond(response, 400, { error: 'A user ID is required.' });
      const user = normalizeUser(store, userId);
      if (!store.users[userId]) {
        store.users[userId] = user;
        await saveStore(store);
      }
      return respond(response, 200, publicUsage(user));
    }
    if (request.method === 'POST') {
      const { userId: rawUserId, feature } = await readJsonBody(request);
      const userId = String(rawUserId || '').trim().toLowerCase();
      if (!userId || !Object.hasOwn(LIMITS, feature)) return respond(response, 400, { error: 'A valid user and feature are required.' });
      const user = normalizeUser(store, userId);
      const limit = user.plan === 'premium' ? null : LIMITS[feature];
      if (limit !== null && user.usage[feature] >= limit) {
        return respond(response, 403, { error: `Free plan limit reached for ${feature}.`, code: 'PLAN_LIMIT', ...publicUsage(user) });
      }
      user.usage[feature] += 1;
      user.updatedAt = new Date().toISOString();
      store.users[userId] = user;
      await saveStore(store);
      return respond(response, 200, publicUsage(user));
    }
    return respond(response, 405, { error: 'Method not allowed.' });
  } catch (error) {
    return respond(response, 500, { error: error?.message || 'Unable to update plan usage.' });
  }
};

export const handleRevenue = async (request, response) => {
  if (request.method === 'OPTIONS') return respond(response, 204, {});
  if (request.method !== 'GET') return respond(response, 405, { error: 'Method not allowed.' });
  try {
    const store = await loadStore();
    const users = Object.values(store.users).map((entry) => normalizeUser(store, entry.userId));
    const premiumUsers = users.filter(({ plan }) => plan === 'premium').length;
    const featureTotals = users.reduce((totals, user) => ({
      itinerary: totals.itinerary + user.usage.itinerary,
      chat: totals.chat + user.usage.chat,
      landmark: totals.landmark + user.usage.landmark,
    }), { itinerary: 0, chat: 0, landmark: 0 });
    return respond(response, 200, {
      currency: 'NPR',
      premiumPrice: PREMIUM_PRICE_NPR,
      monthlyRecurringRevenue: premiumUsers * PREMIUM_PRICE_NPR,
      annualRunRate: premiumUsers * PREMIUM_PRICE_NPR * 12,
      totalUsers: users.length,
      freeUsers: users.length - premiumUsers,
      premiumUsers,
      conversionRate: users.length ? Number(((premiumUsers / users.length) * 100).toFixed(1)) : 0,
      featureTotals,
      users: users.map(({ userId, plan, usage, updatedAt }) => ({ userId, plan, usage, updatedAt })),
    });
  } catch (error) {
    return respond(response, 500, { error: error?.message || 'Unable to load revenue analytics.' });
  }
};
