"use client";

import { AccountTableSkeleton } from "@/components/account/AccountSkeleton";
import { AccountTabs } from "@/components/account/AccountTabs";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { useEffect, useState } from "react";

const users = [
  { name: "Ali Enes Bozüyük", email: "ali.enes@switas.com", phone: "0539 646 2665", role: "Admin", status: "invited" as const },
  { name: "Ezgi Kaptanoğlu", email: "ezgi@switas.com", phone: "0539 646 2665", role: "Approver", status: "active" as const },
  { name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Viewer", status: "invited" as const },
  { name: "Ali Enes Bozüyük", email: "ali.enes@switas.com", phone: "0539 646 2665", role: "Viewer", status: "active" as const },
  { name: "Ezgi Kaptanoğlu", email: "ezgi@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" as const },
  { name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" as const },
  { name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" as const },
  { name: "Hilal Bayer", email: "hilalbayer@switas.com", phone: "0539 646 2665", role: "Trader", status: "active" as const },
];

const roleCards = [
  {
    name: "admin",
    permissions: ["manageUsers", "manageRoles", "manageAddresses", "viewReports"],
  },
  {
    name: "approver",
    permissions: ["reviewWhitelist", "reviewRoles", "sendInvites"],
  },
  {
    name: "trader",
    permissions: ["tradeAssets", "swapTransfer", "manageOwnWhitelist"],
  },
  {
    name: "viewer",
    permissions: ["viewHistory", "viewSummaries"],
  },
];

const initials = (name: string) => {
  const parts = name.split(" ");
  return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
};

export default function AccountUserPage() {
  const { t } = useI18n();
  const [tableLoading, setTableLoading] = useState(true);
  const [tableUsers, setTableUsers] = useState(users);

  useEffect(() => {
    let mounted = true;
    const loadUsers = async () => {
      try {
        // Placeholder for future API integration.
        if (mounted) {
          setTableUsers(users);
        }
      } finally {
        if (mounted) {
          setTableLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="">
      <AccountTabs active="corporate" />

      <div className="mt-6 flex flex-col gap-4 rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-sm  ">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 ">{t("userPage.title")}</h2>
          <button className="rounded-xl border border-[#E8EDF3] bg-white px-4 py-2 text-sm font-semibold text-gray-800 shadow-sm transition hover:bg-gray-50    ">
            {t("userPage.addUser")}
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3 py-2 text-gray-600 shadow-sm   ">
            <span className="text-gray-500">{t("userPage.filters.search")}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3 py-2 text-gray-600 shadow-sm   ">
            <span>{t("userPage.filters.status")}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E8EDF3] bg-white px-3 py-2 text-gray-600 shadow-sm   ">
            <span>{t("userPage.filters.role")}</span>
          </div>
        </div>

        {tableLoading ? (
          <AccountTableSkeleton />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-[#E8EDF3] shadow-sm ">
            <div className="w-full overflow-x-auto">
              <table className="w-full min-w-[900px] text-sm">
                <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wide text-gray-500  ">
                  <tr className="border-b border-[#E8EDF3] ">
                    <th className="px-3 py-3">{t("userPage.table.user")}</th>
                    <th className="px-3 py-3">{t("userPage.table.email")}</th>
                    <th className="px-3 py-3">{t("userPage.table.phone")}</th>
                    <th className="px-3 py-3">{t("userPage.table.role")}</th>
                    <th className="px-3 py-3">{t("userPage.table.status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {tableUsers.map((u, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 ">
                      <td className="px-3 py-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-800 ring-1 ring-gray-200   ">
                            {initials(u.name)}
                          </div>
                          <span className="text-sm font-semibold text-gray-900 ">{u.name}</span>
                        </div>
                      </td>
                      <td className="px-3 py-3 text-gray-700 ">{u.email}</td>
                      <td className="px-3 py-3 text-gray-700 ">{u.phone}</td>
                      <td className="px-3 py-3 text-gray-900 ">{t(`userPage.roles.${u.role.toLowerCase()}`)}</td>
                      <td className="px-3 py-3">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-semibold",
                            u.status === "active"
                              ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100   "
                              : "bg-amber-50 text-amber-600 ring-1 ring-amber-100   ",
                          ].join(" ")}
                        >
                          {u.status === "active" ? t("userPage.status.active") : t("userPage.status.invited")}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex items-center justify-between border-t border-[#E8EDF3] px-3 py-3 text-xs text-gray-500  ">
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-gray-300 px-2 py-1 hover:bg-gray-50  ">‹</button>
                <button className="rounded-lg bg-gray-900 px-3 py-1 text-white shadow-sm  ">1</button>
                <button className="rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-50  ">2</button>
                <button className="rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-50  ">3</button>
                <button className="rounded-lg px-2 py-1 text-gray-700 hover:bg-gray-50  ">…</button>
                <button className="rounded-lg px-3 py-1 text-gray-700 hover:bg-gray-50  ">10</button>
                <button className="rounded-lg border border-gray-300 px-2 py-1 hover:bg-gray-50  ">›</button>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-[#E8EDF3] px-3 py-1 ">
                {t("userPage.pagination.showing")}
                <button className="flex items-center gap-1 rounded-md border border-[#E8EDF3] bg-white px-2 py-1 text-xs font-semibold text-gray-700 shadow-sm hover:bg-gray-50   ">
                  {t("userPage.pagination.show")}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-2xl border border-[#E8EDF3] bg-white p-4 shadow-sm  ">
          <h2 className="text-lg font-semibold text-gray-900 ">{t("userPage.rolesTitle")}</h2>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {roleCards.map((role) => (
              <div
                key={role.name}
                className="flex h-full flex-col rounded-2xl border border-[#E8EDF3] bg-gray-50 p-4 text-sm text-gray-800 shadow-sm   "
              >
                <h3 className="text-base font-semibold text-gray-900 ">{t(`userPage.roles.${role.name}`)}</h3>
                <ul className="mt-3 list-disc space-y-1 pl-4 text-sm text-gray-700 ">
                  {role.permissions.map((p, idx) => (
                    <li key={idx}>{t(`userPage.permissions.${p}`)}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
