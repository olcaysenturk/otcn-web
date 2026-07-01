interface AccountHeaderProps {
    title: string;
    description: string;
}

/**
 * The account section header is now rendered once by the account route-segment
 * layout (`account/layout.tsx`). This component is a no-op kept only so the legacy
 * pages that still import it don't render a duplicate header during the
 * incremental migration. Drop the call sites as each page is migrated.
 */
export function AccountHeader(_props: AccountHeaderProps) {
    void _props;
    return null;
}
