export type UiTransactionStatus = "success" | "pending" | "processing" | "failed";

export function mapApiStatusToTransactionStatus(apiStatus: unknown): UiTransactionStatus {
  const raw = String(apiStatus ?? "").toLowerCase();

  const successValues = ["2", "completed", "success"];
  const pendingValues = ["0", "pending"];
  const failedValues = ["3", "50", "90", "failed", "admincancel", "cancelled", "canceled", "rejected"];
  const processingValues = ["1", "4", "10", "20", "60", "processing", "waitingfee", "processinginqueue", "adminapprovewaiting", "waitdeclaration"];

  if (successValues.includes(raw)) return "success";
  if (pendingValues.includes(raw)) return "pending";
  if (failedValues.includes(raw)) return "failed";
  if (processingValues.includes(raw)) return "processing";

  return "processing";
}

export function getTransactionStatusTextKey(status: UiTransactionStatus): string {
  if (status === "success") return "transactions.filters.status.success";
  if (status === "pending") return "transactions.filters.status.pending";
  if (status === "failed") return "transactions.filters.status.failed";
  return "transactions.filters.status.processing";
}

export function getTransactionStatusClasses(status: UiTransactionStatus, withMinWidth = false): string {
  const color =
    status === "success"
      ? "bg-emerald-50 text-emerald-600 border-emerald-400"
      : status === "pending"
        ? "bg-amber-50 text-amber-600 border-amber-400"
        : status === "failed"
          ? "bg-red-50 text-red-600 border-red-400"
          : "bg-blue-50 text-blue-600 border-blue-400";

  const width = withMinWidth ? "justify-center min-w-[95px]" : "";
  return `inline-flex w-auto shrink-0 items-center rounded-full border px-3 py-1 text-xs font-semibold ${width} ${color}`.trim();
}
