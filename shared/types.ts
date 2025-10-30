export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}
export interface Profile {
  id: string; // UUID, matches auth.users.id
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: string; // 'user' or 'admin'
  created_at: string; // ISO 8601 timestamp
}
export interface Case {
  id: string; // UUID
  user_id: string; // Foreign key to profiles.id
  amount_lost: number;
  scam_type: string;
  uk_bank_account: boolean;
  payment_method: string[];
  bank_name: string;
  scam_description: string;
  first_payment_date: string; // YYYY-MM-DD
  heard_from: string;
  status: string; // e.g., 'submitted', 'in_review', 'active', 'closed'
  created_at: string; // ISO 8601 timestamp
}
export interface Balance {
  id: string; // UUID
  user_id: string; // Foreign key to profiles.id
  recovered_amount: number;
  last_updated: string; // ISO 8601 timestamp
}
export interface CryptoWallet {
  id: string; // UUID
  cryptocurrency: string;
  wallet_address: string;
  network: string;
  is_active: boolean;
  created_at: string; // ISO 8601 timestamp
}
export interface Payment {
  id: string; // UUID
  user_id: string; // Foreign key to profiles.id
  case_id?: string; // Foreign key to cases.id
  amount: number;
  cryptocurrency?: string;
  wallet_address?: string;
  transaction_hash?: string;
  status: string; // e.g., 'pending', 'confirmed', 'failed'
  created_at: string; // ISO 8601 timestamp
}
export interface DashboardData {
  case: Case;
  balance: Balance;
  payments: Payment[];
}
export interface AdminDashboardData {
  cases: Case[];
  users: Profile[];
  balances: Balance[];
}