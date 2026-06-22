"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";

import { useI18n } from "@/lib/i18n/I18nProvider";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type UserStatus = "active" | "invited";
type UserRow = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: UserStatus;
};

// ⚠️ TEMPORARY DEMO MOCK — sub-user management has no API yet.
const MOCK_USERS: UserRow[] = [
  { id: "u1", name: "Ali Enes Bozüyük", email: "ali.enes@switas.com", phone: "0539 646 2665", role: "Admin", status: "invited" },
  { id: "u2", name: "Ezgi Kaptanoğlu", email: "ezgi@switas.com", phone: "0539 646 2665", role: "Approver", status: "active" },
  { id: "u3", name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Viewer", status: "invited" },
  { id: "u4", name: "Ali Enes Bozüyük", email: "ali.enes@switas.com", phone: "0539 646 2665", role: "Viewer", status: "active" },
  { id: "u5", name: "Ezgi Kaptanoğlu", email: "ezgi@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" },
  { id: "u6", name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" },
  { id: "u7", name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" },
  { id: "u8", name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" },
];

const ROLE_CARDS = [
  { name: "admin", permissions: ["manageUsers", "manageRoles", "manageAddresses", "viewReports"] },
  { name: "approver", permissions: ["reviewWhitelist", "reviewRoles", "sendInvites"] },
  { name: "trader", permissions: ["tradeAssets", "swapTransfer", "manageOwnWhitelist"] },
  { name: "viewer", permissions: ["viewHistory", "viewSummaries"] },
];

const initials = (name: string) => {
  const parts = name.trim().split(" ");
  return ((parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "")).toUpperCase();
};

const CARD = "rounded-[22px] bg-[#0E0F10] p-6 shadow-[0px_2px_8px_0.3px_rgba(58,64,67,0.2)]";

export default function AccountUserPage() {
  const { t } = useI18n();
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<UserRow[]>(MOCK_USERS);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const id = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(id);
  }, []);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q),
    );
  }, [users, query]);

  const StatusBadge = ({ status }: { status: UserStatus }) => {
    const active = status === "active";
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
          active
            ? "border-[#27E9A6]/40 bg-[#27E9A6]/10 text-[#27E9A6]"
            : "border-[#FFD951]/40 bg-[#FFD951]/10 text-[#FFD951]",
        )}
      >
        {active ? t("userPage.status.active") : t("userPage.status.invited")}
      </span>
    );
  };

  const columns: DataTableColumn<UserRow>[] = [
    {
      id: "user",
      header: t("userPage.table.user"),
      width: "26%",
      skeleton: (
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
          <Skeleton className="h-4 w-28 bg-white/10" />
        </div>
      ),
      cell: (u) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8F93FE]/10 text-xs font-semibold text-[#8F93FE]">
            {initials(u.name)}
          </span>
          <span className="font-medium text-[#F4F7F8]">{u.name}</span>
        </div>
      ),
    },
    {
      id: "email",
      header: t("userPage.table.email"),
      width: "24%",
      cellClassName: "text-[#C5C9CC]",
      skeleton: <Skeleton className="h-4 w-40 bg-white/10" />,
      cell: (u) => <span className="block truncate">{u.email}</span>,
    },
    {
      id: "phone",
      header: t("userPage.table.phone"),
      width: "16%",
      cellClassName: "text-[#C5C9CC]",
      skeleton: <Skeleton className="h-4 w-24 bg-white/10" />,
      cell: (u) => u.phone,
    },
    {
      id: "role",
      header: t("userPage.table.role"),
      width: "14%",
      skeleton: <Skeleton className="h-6 w-16 rounded-full bg-white/10" />,
      cell: (u) => (
        <span className="inline-flex items-center rounded-full bg-white/5 px-2.5 py-1 text-xs font-medium text-[#F4F7F8]">
          {t(`userPage.roles.${u.role.toLowerCase()}`)}
        </span>
      ),
    },
    {
      id: "status",
      header: t("userPage.table.status"),
      width: "12%",
      skeleton: <Skeleton className="h-6 w-20 rounded-full bg-white/10" />,
      cell: (u) => <StatusBadge status={u.status} />,
    },
    {
      id: "action",
      header: "",
      width: "8%",
      align: "right",
      hideOnMobile: true,
      skeleton: (
        <div className="flex justify-end">
          <Skeleton className="h-9 w-9 rounded-full bg-white/10" />
        </div>
      ),
      cell: (u) => (
        <div className="flex justify-end">
          <button
            type="button"
            aria-label={t("account.bank.actions.delete")}
            onClick={() => setUsers((prev) => prev.filter((x) => x.id !== u.id))}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[#FF4D6D] text-[#FF4D6D] transition hover:bg-[#FF4D6D]/10"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Users */}
      <div className={CARD}>
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-medium text-[#F4F7F8]">{t("userPage.title")}</h2>
          <button
            type="button"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-[#27E9A6] px-4 py-2 text-xs font-bold text-[#27E9A6] transition hover:bg-[#27E9A6]/10"
          >
            <Plus className="h-4 w-4" />
            {t("userPage.addUser")}
          </button>
        </div>

        <div className="relative mt-4 w-full max-w-[500px]">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-[#5E666A]" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("userPage.filters.search")}
            className="h-10 w-full rounded-[24px] border border-[#3A4043] bg-[#0E0F10] pl-10 pr-3 text-sm text-[#F4F7F8] outline-none transition placeholder:text-[#5E666A] focus:border-[#5E666A]"
          />
        </div>

        <div className="mt-6">
          <DataTable<UserRow>
            columns={columns}
            data={rows}
            isLoading={isLoading}
            skeletonRows={5}
            tableLayout="fixed"
            getRowId={(u) => u.id}
            rowClassName={() => "hover:[&>td]:bg-[#121516]"}
          />
        </div>

        {!isLoading && rows.length > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-[#5E666A]">
              <span>{t("userPage.pagination.show")}</span>
              <span className="text-[#F4F7F8]">8</span>
            </div>
            <Pagination currentPage={1} totalPages={1} onPageChange={() => {}} />
          </div>
        )}
      </div>

      {/* Roles & permissions */}
      <div className={CARD}>
        <h2 className="text-lg font-medium text-[#F4F7F8]">{t("userPage.rolesTitle")}</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {ROLE_CARDS.map((role) => (
            <div key={role.name} className="flex h-full flex-col rounded-[16px] bg-[#191D1E] p-4">
              <h3 className="text-base font-medium text-[#8F93FE]">{t(`userPage.roles.${role.name}`)}</h3>
              <ul className="mt-3 list-disc space-y-1.5 pl-4 text-sm text-[#C5C9CC]">
                {role.permissions.map((p) => (
                  <li key={p}>{t(`userPage.permissions.${p}`)}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
