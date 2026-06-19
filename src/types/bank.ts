export interface DepositBankItem {
  id: number;
  providerName: string;
  bankCode: string;
  slug: string;
  accountName: string;
  accountNo: string;
  currency: string;
  paymentServiceType: string;
  isEnabled: boolean;
  isDefaultEftAccount: boolean;
  isDepositEnabled: boolean;
  logoUrl?: string; // Adding optional in case it comes back or we map it
}
export interface Bank {
  id: number;
  name: string;
  code: string;
  vkn: string;
}

// Mapped internal type for UI usage (if needed distinct from API item)
export interface BankItem {
  name: string;
  description: string;
  accountName: string;
  iban: string; // accountNo maps to this
  availability: "instant" | "business";
  fee?: "free";
  methodLabel: string;
  mobile?: boolean;
  logo?: string;
}

export interface UserBank {
  id: number;
  label: string;
  iban: string;
  currency: string;
  bankId: number;
  bank: string;
  bankName?: string;
  taxId?: string; // If applicable from backend
  logoUrl?: string;
  color?: string; // Optional for UI consistency
}

export interface DepositBankItem {
  id: number;
  providerName: string;
  bankCode: string;
  slug: string;
  accountName: string;
  accountNo: string;
  currency: string;
  paymentServiceType: string;
  isEnabled: boolean;
  isDefaultEftAccount: boolean;
  isDepositEnabled: boolean;
}

export interface AddBankRequest {
  label: string;
  iban: string;
  currency: string;
  bankId: number;
}

