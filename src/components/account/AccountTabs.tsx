export const ACCOUNT_TABS = [
  "profile",
  "corporate",
  "bank",
  "address",
  "security",
  "preferences",
] as const;

export const ACCOUNT_TAB_PATH: Record<(typeof ACCOUNT_TABS)[number], string> = {
  profile: "/account/profile",
  corporate: "/account/account-info",
  bank: "/account/bank",
  address: "/account/address",
  security: "/account/security",
  preferences: "/account/preferences",
};

/**
 * The desktop account tabs are now rendered once by the account route-segment
 * layout (`account/layout.tsx`) with an animated indicator. This component is a
 * no-op kept only so legacy pages that still render it don't show a duplicate tab
 * bar during the incremental migration. The `ACCOUNT_TABS` / `ACCOUNT_TAB_PATH`
 * exports are still used by the mobile `AccountMenuClient`. Remove call sites as
 * each page is migrated to content-only.
 */
export function AccountTabs(_props: { active: (typeof ACCOUNT_TABS)[number] }) {
  void _props;
  return null;
}
