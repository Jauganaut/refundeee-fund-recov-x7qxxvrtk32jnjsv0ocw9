import { IndexedEntity } from "./core-utils";
import type { Profile, Case, Balance, CryptoWallet, Payment } from "@shared/types";
import { MOCK_WALLETS } from "@shared/mock-data";
// PROFILE ENTITY
export class ProfileEntity extends IndexedEntity<Profile> {
  static readonly entityName = "profile";
  static readonly indexName = "profiles";
  static readonly initialState: Profile = {
    id: "",
    email: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "user",
    created_at: "",
  };
  // We use email as the key for profiles to ensure uniqueness
  static keyOf(state: Partial<Profile>): string {
    return state.email ?? "";
  }
}
// CASE ENTITY
export class CaseEntity extends IndexedEntity<Case> {
  static readonly entityName = "case";
  static readonly indexName = "cases";
  static readonly initialState: Case = {
    id: "",
    user_id: "",
    amount_lost: 0,
    scam_type: "",
    uk_bank_account: false,
    payment_method: [],
    bank_name: "",
    scam_description: "",
    first_payment_date: "",
    heard_from: "",
    status: "submitted",
    created_at: "",
  };
}
// BALANCE ENTITY
export class BalanceEntity extends IndexedEntity<Balance> {
    static readonly entityName = "balance";
    static readonly indexName = "balances";
    static readonly initialState: Balance = {
        id: "",
        user_id: "",
        recovered_amount: 0,
        last_updated: "",
    };
    // Use user_id as the key to ensure one balance per user
    static keyOf(state: Partial<Balance>): string {
        return state.user_id ?? "";
    }
}
// CRYPTOWALLET ENTITY
export class CryptoWalletEntity extends IndexedEntity<CryptoWallet> {
    static readonly entityName = "crypto_wallet";
    static readonly indexName = "crypto_wallets";
    static readonly initialState: CryptoWallet = {
        id: "",
        cryptocurrency: "",
        wallet_address: "",
        network: "",
        is_active: true,
        created_at: "",
    };
    static readonly seedData = MOCK_WALLETS;
}
// PAYMENT ENTITY
export class PaymentEntity extends IndexedEntity<Payment> {
    static readonly entityName = "payment";
    static readonly indexName = "payments";
    static readonly initialState: Payment = {
        id: "",
        user_id: "",
        case_id: "",
        amount: 0,
        cryptocurrency: "",
        wallet_address: "",
        transaction_hash: "",
        status: "pending",
        created_at: "",
    };
}