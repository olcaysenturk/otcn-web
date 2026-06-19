import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string | undefined;
  onChange: (value: string) => void;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({ defaultValue, value, onValueChange, className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const activeValue = value ?? internalValue;

  const handleChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onChange: handleChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement>;

export function TabsList({ className, ...props }: TabsListProps) {
  return (
    <div
      role="tablist"
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-full border border-slate-200 bg-white/80 p-1 text-slate-500",
        className
      )}
      {...props}
    />
  );
}

type TabsTriggerProps = React.HTMLAttributes<HTMLElement> & {
  value: string;
  asChild?: boolean;
};

export function TabsTrigger({ className, value, children, asChild, onClick, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      ctx?.onChange(value);
    }
  };

  const baseClass = cn(
    "inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-all ring-offset-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300",
    isActive
      ? "bg-slate-900 text-slate-50 shadow-sm dark:bg-slate-50 dark:text-slate-900"
      : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-50",
    className
  );

  if (asChild && React.isValidElement(children)) {
    const childProps = (children as React.ReactElement<{ className?: string }>).props;
    return React.cloneElement(children, {
      role: "tab",
      "aria-selected": isActive,
      onClick: handleClick,
      className: cn(baseClass, childProps?.className),
      ...props,
    } as React.HTMLAttributes<HTMLElement>);
  }

  return (
    <button
      role="tab"
      type="button"
      aria-selected={isActive}
      onClick={handleClick}
      className={baseClass}
      {...props}
    >
      {children}
    </button>
  );
}

type TabsContentProps = React.HTMLAttributes<HTMLDivElement> & {
  value: string;
};

export function TabsContent({ className, value, children, ...props }: TabsContentProps) {
  const ctx = React.useContext(TabsContext);
  if (ctx?.value !== value) return null;

  return (
    <div role="tabpanel" className={cn(className)} {...props}>
      {children}
    </div>
  );
}
