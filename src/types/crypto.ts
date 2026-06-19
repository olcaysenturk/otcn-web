export interface CryptoAsset extends CryptoAssetResponse {
  // UI
  icon?: string;
}

export interface CryptoAssetResponse {
  assetName: string;
  assetSymbol: string;
  network: {
    networkName: string;
    networkLabel: string;
    settings: {
      depositMinConf: number;
      depositMinConfNotification: boolean;
      depositMinQty: number;
      feeQty: number;
      withdrawalMaxQty: number;
      withdrawalMinQty: number;
      depositEnabled: boolean;
      withdrawalEnabled: boolean;
      networkTime: number;
      hasMemoTag: boolean;
    }
  }[];
}

export type CryptoPlatform = {
  id: number;
  name: string;
  isActive: boolean;
};

export type CryptoDepositDeclarationDetail = {
  birthCityId: number | null;
  birthDistrictId: number | null;
  birthDate: string | null;
  address: string | null;
  identityInfo: string | null;
  externalCustomerNo: string | null;
};

export type AddDepositDeclarationPayload = {
  depositTransactionId: number;
  addressType: "PERSONAL" | "CORPORATE";
  senderName: string;
  senderType: "PERSONAL" | "CORPORATE";
  isOwnAddress: boolean;
  providerName: string;
  cryptoDepositDeclarationDetail: CryptoDepositDeclarationDetail | null;
  informationType: "ADDRESS" | "BIRTHPLACE" | "IDENTITY" | "EXTERNAL_CUSTOMER_NO" | null;
  description: string;
};

export type FormValues = {
  persona: "individual" | "corporate";
  senderName: string;
  isOwnAddress: boolean;
  informationType?: "ADDRESS" | "BIRTHPLACE" | "IDENTITY" | "EXTERNAL_CUSTOMER_NO" | null;
  address?: string;
  birthCityId?: number | null;
  birthDistrictId?: number | null;
  birthDate?: string | null;
  identityInfo?: string | null;
  externalCustomerNo?: string | null;
  addressType: "PERSONAL" | "CORPORATE";
  providerName?: string;
  otherProviderName?: string;
  description: string;
};

export type AddCryptoAddressPayload = {
  accountId: number;
  name: string;
  assetSymbol: string;
  address: string;
  memoTag: string | null;
  networkName: string;
  receiver: string;
  description: string;
  receiverType: ReceiverType;
  receiverBirthDate: string | null;
  identityNumber: string | null;
  taxNumber: string | null;
  providerType: ProviderType;
  providerName: string;
  receiverResidenceAddress: string;
  receiverCountry: string;
}

export type AddCryptoAddressResponse = {
  flowId: string;
  email: string;
  phone: string;
  isPhoneRequired: boolean;
  isEmailRequired: boolean;
  isAuthenticatorRequired: boolean;
}

export type CryptoAddress = {
  id: number;
  accountId: number;
  merchantId: number;
  name: string;
  assetSymbol: string;
  address: string;
  networkName: string;
  receiver: string;
  receiverType: ReceiverType;
  receiverBirthDate: string | null;
  identityNumber: string | null;
  providerType: ProviderType;
  receiverCountry: string;
}
export type ProviderType = "Wallet" | "Exchange";
export type ReceiverType = "Individual" | "Corporate";

export type PendingDepositDeclaration = {
  id: number;
  merchantId: number;
  accountId: number;
  assetSymbol: string;
  networkName: string;
  quantity: number | string;
  fromAddress: string;
  toAddress: string;
  uniqueCode?: string;
  txHash?: string;
  createdDate?: string;
};
