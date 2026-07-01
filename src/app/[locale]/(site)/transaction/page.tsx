import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";

export default function Transactions({ params }: { params: { locale: string } }) {
  redirect(withLocale("/transaction/deposit-withdraw?tab=fiat", params.locale));
}
