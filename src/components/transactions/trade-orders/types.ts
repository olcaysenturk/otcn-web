export type UiRow = {
  id: number;
  date: string;
  time: string;
  pair: string;
  type: string;
  side: "buy" | "sell";
  amount: string;
  price: string;
  filledPercent: number;
  filledAmount: string;
  total: string;
  trigger: string;
  status?: string | number;
};

export type TradeOrdersTabProps = {
  rows: UiRow[];
  loading: boolean;
  t: (key: string) => string;
  onCancelClick: (id: number) => void;
  getStatusBadge: (status?: string | number) => React.ReactNode;
  onDetailClick: (row: UiRow) => void;
};
