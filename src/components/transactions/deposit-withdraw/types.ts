export type Transaction = {
  id: string;
  date: string;
  amount: string;
  status: "success" | "pending" | "processing" | "failed";
  type: "withdraw" | "deposit";
  bank: string;
  bankAccount: string;
  iban: string;
  description?: string;
};

export type CryptoTransaction = {
  id: string;
  transactionId?: number;
  hasDeclaration?: boolean;
  needsDeclaration?: boolean;
  asset: string;
  network: string;
  date: string;
  amount: string;
  status: "success" | "pending" | "processing" | "failed";
  address: string;
  txId: string;
  type: "withdraw" | "deposit";
};

export type FiatTransactionsTabProps = {
  rows: Transaction[];
  loading: boolean;
  t: (key: string) => string;
  expanded: string | null;
  onExpand: (id: string | null) => void;
};

export type CryptoTransactionsTabProps = {
  rows: CryptoTransaction[];
  loading: boolean;
  t: (key: string) => string;
  copyWithToast: (value: string) => void;
  onDeclareClick: (mode: "withdraw" | "deposit", transactionId?: number) => void;
  onDetailClick: (row: CryptoTransaction) => void;
};
