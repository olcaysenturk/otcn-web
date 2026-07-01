"use client";

import { ResponsiveFilter } from "@/components/ui/responsive-filter";

export type TransactionsFilterOption = {
  label: string;
  value: string;
};

interface TransactionsResponsiveFilterProps {
  label: string;
  value: string;
  options: TransactionsFilterOption[];
  onValueChange: (value: string) => void;
  className?: string;
  drawerTitle?: string;
}

export function TransactionsResponsiveFilter({
  label,
  value,
  options,
  onValueChange,
  className,
  drawerTitle,
}: TransactionsResponsiveFilterProps) {
  return (
    <ResponsiveFilter
      label={label}
      value={value}
      options={options}
      onValueChange={onValueChange}
      className={className}
      drawerTitle={drawerTitle}
    />
  );
}
