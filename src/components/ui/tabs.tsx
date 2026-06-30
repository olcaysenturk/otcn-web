import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * `default` — pill toggle used across the app (white active pill on a dark rail).
 * `subtle` — soft toggle used inside dark cards/modals (dark active pill on a
 * translucent `white/5` rail, full-width triggers).
 * `compact` — small toggle used in dense toolbars (dark active pill on a
 * `#1F2628` rail, auto-width triggers).
 * `segment` — Figma "Tab" segmented control (16px): dark `card` active pill on a
 * `background` rail, radius 14/12, used in content sections.
 */
type TabsVariant = "default" | "subtle" | "compact" | "segment";

type TabsContextValue = {
  value: string | undefined;
  onChange: (value: string) => void;
  animated: boolean;
  variant: TabsVariant;
  /** True once the sliding indicator has been measured on the client. */
  indicatorReady: boolean;
};

const TabsContext = React.createContext<TabsContextValue | null>(null);

type TabsProps = {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  className?: string;
  children: React.ReactNode;
};

export function Tabs({ defaultValue, value, onValueChange, variant = "default", className, children }: TabsProps) {
  const [internalValue, setInternalValue] = React.useState<string | undefined>(defaultValue);
  const activeValue = value ?? internalValue;

  const handleChange = (next: string) => {
    setInternalValue(next);
    onValueChange?.(next);
  };

  return (
    <TabsContext.Provider value={{ value: activeValue, onChange: handleChange, animated: false, variant, indicatorReady: false }}>
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
  const variant = ctx?.variant ?? "default";
  const listRef = React.useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = React.useState<{ left: number; width: number } | null>(null);
  // Gate the sliding-pill transition until after the first measurement + web
  // fonts settle, so it snaps to the right size instead of "growing" on load.
  const [transitionReady, setTransitionReady] = React.useState(false);

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

  // Re-measure once web fonts are ready (avoids a pre-font measurement), then
  // enable transitions on the next frame so the initial sizing never animates.
  React.useEffect(() => {
    if (!animated) return;
    let raf = 0;
    const finish = () => {
      updateIndicator();
      raf = requestAnimationFrame(() => setTransitionReady(true));
    };
    const fonts = typeof document !== "undefined" ? document.fonts : undefined;
    if (fonts && fonts.status !== "loaded") {
      fonts.ready.then(finish).catch(finish);
    } else {
      finish();
    }
    return () => cancelAnimationFrame(raf);
  }, [animated, updateIndicator]);

  return (
    <TabsContext.Provider value={ctx ? { ...ctx, animated, indicatorReady: indicator !== null } : ctx}>
      <div
        ref={listRef}
        role="tablist"
        className={cn(
          variant === "subtle" &&
            "relative flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 p-1 text-sm font-semibold text-white shadow-sm",
          variant === "compact" &&
            "relative flex w-max rounded-[10px] bg-[#1F2628] p-1",
          variant === "segment" &&
            "relative inline-flex w-max items-center rounded-[14px] bg-background p-1",
          variant === "default" &&
            "relative inline-flex h-12 items-center justify-center rounded-full border border-[#3A4043] bg-[#0E0F10] p-1 text-[#788084]",
          animated && variant === "default" && "border-transparent",
          className,
        )}
        {...props}
      >
        {animated && indicator && (
          <span
            aria-hidden
            className={cn(
              "pointer-events-none absolute top-1 bottom-1 left-0",
              transitionReady
                ? "transition-[transform,width] duration-300 ease-in-out"
                : "transition-none",
              variant === "subtle" && "rounded-xl bg-[#0F1415] shadow-sm",
              variant === "compact" && "rounded-[7px] bg-[#0E0F10] shadow-sm",
              variant === "segment" && "rounded-[12px] bg-card shadow-[0px_1px_2px_1px_rgba(21,21,20,0.05)]",
              variant === "default" && "rounded-[12px] bg-[#F4F7F8] shadow-[0px_1px_2px_1px_rgba(21,21,20,0.05)]",
            )}
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
  disabled?: boolean;
};

export function TabsTrigger({ className, value, children, asChild, onClick, ...props }: TabsTriggerProps) {
  const ctx = React.useContext(TabsContext);
  const isActive = ctx?.value === value;
  const variant = ctx?.variant ?? "default";
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
  const baseClass = variant === "subtle"
    ? cn(
        "relative z-10 inline-flex flex-1 items-center justify-center whitespace-nowrap rounded-xl px-3 py-2 text-sm font-semibold transition focus-visible:outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
        animated
          ? isActive
            ? indicatorReady
              ? "text-white"
              : "bg-[#0F1415] text-white shadow-sm"
            : "text-gray-400 hover:text-white"
          : isActive
            ? "bg-[#0F1415] text-white shadow-sm"
            : "text-gray-400 hover:text-white",
        className,
      )
    : variant === "compact"
    ? cn(
        "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-[7px] px-3 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 sm:text-[12px]",
        animated
          ? isActive
            ? indicatorReady
              ? "text-[#F4F7F8]"
              : "bg-[#0E0F10] text-[#F4F7F8] shadow-sm"
            : "text-[#C5C9CC]"
          : isActive
            ? "bg-[#0E0F10] text-[#F4F7F8]"
            : "text-[#C5C9CC]",
        className,
      )
    : variant === "segment"
    ? cn(
        "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-[12px] px-3.5 py-1.5 text-[16px] font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        animated
          ? isActive
            ? indicatorReady
              ? "text-foreground"
              : "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground"
          : isActive
            ? "bg-card text-foreground shadow-sm"
            : "text-muted-foreground hover:text-foreground",
        className,
      )
    : cn(
        "relative z-10 inline-flex items-center justify-center whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f54a14]/40 focus-visible:ring-offset-0 disabled:pointer-events-none disabled:opacity-50",
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
