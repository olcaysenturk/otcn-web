import * as React from "react";
import { cn } from "@/lib/utils";

type TabsContextValue = {
  value: string | undefined;
  onChange: (value: string) => void;
  animated: boolean;
  /** True once the sliding indicator has been measured on the client. */
  indicatorReady: boolean;
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
    <TabsContext.Provider value={{ value: activeValue, onChange: handleChange, animated: false, indicatorReady: false }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
}

type TabsListProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * When true, renders a single pill that slides between the active triggers
   * instead of each trigger painting its own active background.
   */
  animated?: boolean;
};

export function TabsList({ className, animated = false, children, ...props }: TabsListProps) {
  const ctx = React.useContext(TabsContext);
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);

  const updateIndicator = React.useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    const active = list.querySelector<HTMLElement>('[role="tab"][aria-selected="true"]');
    if (!active) {
      setIndicator(null);
      return;
    }
    setIndicator({ left: active.offsetLeft, width: active.offsetWidth });
  }, []);

  React.useLayoutEffect(() => {
    if (!animated) return;
    updateIndicator();
  }, [animated, updateIndicator, ctx?.value]);

  React.useEffect(() => {
    if (!animated) return;
    const list = listRef.current;
    if (!list || typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(() => updateIndicator());
    observer.observe(list);
    list.querySelectorAll('[role="tab"]').forEach((tab) => observer.observe(tab));
    return () => observer.disconnect();
  }, [animated, updateIndicator]);

  return (
    <TabsContext.Provider value={ctx ? { ...ctx, animated, indicatorReady: indicator !== null } : ctx}>
      <div
        ref={listRef}
        role="tablist"
        className={cn(
          "relative inline-flex h-12 items-center justify-center rounded-full border border-[#3A4043] bg-[#0E0F10] p-1 text-[#788084]",
          animated && "border-transparent",
          className,
        )}
        {...props}
      >
        {animated && indicator && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1 bottom-1 left-0 rounded-[12px] bg-[#F4F7F8] shadow-[0px_1px_2px_1px_rgba(21,21,20,0.05)] transition-[transform,width] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
            style={{ width: indicator.width, transform: `translateX(${indicator.left}px)` }}
          />
        )}
        {children}
      </div>
    </TabsContext.Provider>
  );
}

type TabsTriggerProps = React.HTMLAttributes<HTMLElement> & {
  value: string;
  asChild?: boolean;
};

export function TabsTrigger({ className, value, children, asChild, onClick, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  const animated = ctx?.animated ?? false;
  const indicatorReady = ctx?.indicatorReady ?? false;

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    onClick?.(event);
    if (!event.defaultPrevented) {
      ctx?.onChange(value);
    }
  };

  // In animated mode the white pill is measured on the client. Until it is ready
  // (SSR + first paint), the active trigger paints its own background so the
  // selected state is visible immediately, then hands off to the sliding pill.
  const baseClass = cn(
    "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C7F022]/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
    animated
      ? isActive
        ? indicatorReady
          ? "text-[#0E0F10]"
          : "bg-[#F4F7F8] text-[#0E0F10] shadow-sm"
        : "text-[#C5C9CC] hover:text-[#F4F7F8]"
      : isActive
        ? "bg-[#F4F7F8] text-[#0E0F10] shadow-sm"
        : "text-[#788084] hover:text-[#F4F7F8]",
    className,
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
