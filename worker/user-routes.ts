import { Hono } from "hono";
import type { Env } from './core-utils';
import { ProfileEntity, CaseEntity, BalanceEntity, CryptoWalletEntity, PaymentEntity } from "./entities";
import { ok, bad, notFound } from './core-utils';
import type { Case, Profile, Payment, DashboardData, AdminDashboardData, CryptoWallet, Balance } from "@shared/types";
// This is a mock user email for demo purposes, used as a fallback if no header is provided.
const MOCK_AUTH_USER_EMAIL = "test@example.com";
// In a real app, this would be a middleware that checks a JWT.
// For this mock, it checks for an 'X-User-Email' header.
const mockAuth = () => async (c: any, next: any) => {
  const userEmail = c.req.header('X-User-Email') || MOCK_AUTH_USER_EMAIL;
  if (userEmail) {
    const profileEntity = new ProfileEntity(c.env, userEmail);
    if (await profileEntity.exists()) {
      const user = await profileEntity.getState();
      c.set('user', user);
    }
  }
  await next();
};
const mockAdminAuth = () => async (c: any, next: any) => {
  // This is a simplified admin check for the demo.
  await next();
};
export function userRoutes(app: Hono<{ Bindings: Env }>) {
  // PUBLIC ROUTES
  app.post('/api/register', async (c) => {
    try {
      const body = await c.req.json();
      if (!body.email || !body.first_name || !body.last_name) return bad(c, 'Missing required personal information.');
      if (body.amount_lost === undefined || !body.scam_type) return bad(c, 'Missing required case information.');
      const profileEntity = new ProfileEntity(c.env, body.email);
      if (await profileEntity.exists()) {
          return bad(c, 'A user with this email already exists.');
      }
      const profileId = crypto.randomUUID();
      const now = new Date().toISOString();
      const profileData: Profile = {
        id: profileId,
        email: body.email,
        first_name: body.first_name,
        last_name: body.last_name,
        phone: body.phone,
        role: 'user',
        created_at: now,
      };
      await profileEntity.save(profileData);
      const caseData: Case = {
        id: crypto.randomUUID(),
        user_id: profileId,
        amount_lost: body.amount_lost,
        scam_type: body.scam_type,
        uk_bank_account: body.uk_bank_account,
        payment_method: body.payment_method,
        bank_name: body.bank_name,
        scam_description: body.scam_description,
        first_payment_date: body.first_payment_date,
        heard_from: body.heard_from,
        status: 'submitted',
        created_at: now,
      };
      const newCase = await CaseEntity.create(c.env, caseData);
      await BalanceEntity.create(c.env, {
          id: crypto.randomUUID(),
          user_id: profileId,
          recovered_amount: 0,
          last_updated: now,
      });
      return ok(c, { profile: profileData, case: newCase });
    } catch (error) {
      console.error('Registration failed:', error);
      return c.json({ success: false, error: 'Internal Server Error' }, 500);
    }
  });
  app.post('/api/login', async (c) => {
    return bad(c, "This is a mock endpoint. Please sign up to create a session.");
  });
  // USER ROUTES (mock-protected)
  const userApp = new Hono<{ Bindings: Env, Variables: { user: Profile } }>();
  userApp.use('*', mockAuth());
  userApp.get('/dashboard-data', async (c) => {
    const user = c.get('user');
    if (!user) {
      return notFound(c, 'User session not found. Please sign up to create an account and view your dashboard.');
    }
    const userId = user.id;
    const cases = await CaseEntity.list(c.env);
    const userCase = cases.items.find(item => item.user_id === userId);
    if (!userCase) return notFound(c, 'Case not found for this user.');
    const balanceEntity = new BalanceEntity(c.env, userId);
    if (!await balanceEntity.exists()) return notFound(c, 'Balance not found');
    const balance = await balanceEntity.getState();
    const allPayments = await PaymentEntity.list(c.env);
    const userPayments = allPayments.items.filter(p => p.user_id === userId);
    const data: DashboardData = {
      case: userCase,
      balance,
      payments: userPayments,
    };
    return ok(c, data);
  });
  userApp.get('/wallets', async (c) => {
    await CryptoWalletEntity.ensureSeed(c.env);
    const wallets = await CryptoWalletEntity.list(c.env);
    const activeWallets = wallets.items.filter(w => w.is_active);
    return ok(c, activeWallets);
  });
  userApp.post('/payments', async (c) => {
    const user = c.get('user');
    if (!user) return c.json({ success: false, error: 'Unauthorized' }, 401);
    const userId = user.id;
    const body = await c.req.json();
    if (!body.amount || !body.cryptocurrency || !body.wallet_address) {
      return bad(c, 'Missing required payment information.');
    }
    const cases = await CaseEntity.list(c.env);
    const userCase = cases.items.find(item => item.user_id === userId);
    const paymentData: Payment = {
      id: crypto.randomUUID(),
      user_id: userId,
      case_id: userCase?.id,
      amount: body.amount,
      cryptocurrency: body.cryptocurrency,
      wallet_address: body.wallet_address,
      transaction_hash: body.transaction_hash,
      status: 'confirmed', // Mocking as confirmed for demo
      created_at: new Date().toISOString(),
    };
    const newPayment = await PaymentEntity.create(c.env, paymentData);
    return ok(c, newPayment);
  });
  app.route('/api', userApp);
  // ADMIN ROUTES
  const admin = new Hono<{ Bindings: Env }>();
  admin.use('*', mockAdminAuth());
  admin.get('/dashboard-data', async (c) => {
    const cases = await CaseEntity.list(c.env);
    const profiles = await ProfileEntity.list(c.env);
    const balances = await BalanceEntity.list(c.env);
    const data: AdminDashboardData = {
      cases: cases.items,
      users: profiles.items,
      balances: balances.items,
    };
    return ok(c, data);
  });
  admin.put('/cases/:id', async (c) => {
    const caseId = c.req.param('id');
    const { status } = await c.req.json();
    if (!status) return bad(c, 'Status is required');
    const caseEntity = new CaseEntity(c.env, caseId);
    if (!await caseEntity.exists()) return notFound(c, 'Case not found');
    await caseEntity.mutate(s => ({ ...s, status }));
    return ok(c, await caseEntity.getState());
  });
  admin.put('/balances/:userId', async (c) => {
    const userId = c.req.param('userId');
    const { amount } = await c.req.json();
    if (typeof amount !== 'number') return bad(c, 'A valid amount is required');
    const balanceEntity = new BalanceEntity(c.env, userId);
    if (!await balanceEntity.exists()) return notFound(c, 'Balance not found for this user');
    await balanceEntity.mutate(s => ({
      ...s,
      recovered_amount: amount,
      last_updated: new Date().toISOString(),
    }));
    return ok(c, await balanceEntity.getState());
  });
  admin.get('/wallets', async (c) => {
    await CryptoWalletEntity.ensureSeed(c.env);
    const wallets = await CryptoWalletEntity.list(c.env);
    return ok(c, wallets.items);
  });
  admin.post('/wallets', async (c) => {
    const body = await c.req.json();
    if (!body.cryptocurrency || !body.network || !body.wallet_address) {
      return bad(c, 'Missing required wallet information.');
    }
    const walletData: CryptoWallet = {
      id: crypto.randomUUID(),
      cryptocurrency: body.cryptocurrency,
      network: body.network,
      wallet_address: body.wallet_address,
      is_active: true,
      created_at: new Date().toISOString(),
    };
    const newWallet = await CryptoWalletEntity.create(c.env, walletData);
    return ok(c, newWallet);
  });
  admin.put('/wallets/:id', async (c) => {
    const walletId = c.req.param('id');
    const body = await c.req.json();
    const walletEntity = new CryptoWalletEntity(c.env, walletId);
    if (!await walletEntity.exists()) return notFound(c, 'Wallet not found');
    await walletEntity.patch(body);
    return ok(c, await walletEntity.getState());
  });
  admin.delete('/wallets/:id', async (c) => {
    const walletId = c.req.param('id');
    const deleted = await CryptoWalletEntity.delete(c.env, walletId);
    if (!deleted) return notFound(c, 'Wallet not found');
    return ok(c, { id: walletId });
  });
  app.route('/api/admin', admin);
}