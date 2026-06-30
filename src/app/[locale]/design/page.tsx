"use client";

import { useState } from "react";
import * as Popover from "@radix-ui/react-popover";
import type { DateRange } from "react-day-picker";
import { toast } from "sonner";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Check,
  ChevronRight,
  ClipboardList,
  Copy,
  FileText,
  Info,
  Plus,
  Search,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/skeleton";
import { InfoBox } from "@/components/ui/infobox";
import { Badge } from "@/components/ui/badge";
import { FilterPill } from "@/components/ui/filter-pill";
import { ResponsiveFilter } from "@/components/ui/responsive-filter";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { SearchInput } from "@/components/ui/search-input";
import { AutocompleteInput } from "@/components/ui/autocomplete-input";
import { I18nProvider } from "@/lib/i18n/I18nProvider";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { DataTable, type DataTableColumn } from "@/components/ui/table";
import { cn } from "@/lib/utils";

/* ──────────────────────────────────────────────────────────────────────────
 * Palette data (otcn — Figma "Colors" 52609-3435)
 * ──────────────────────────────────────────────────────────────────────── */

type Shade = { weight: string; hex: string };

const PRIMARY: Shade[] = [
  { weight: "50", hex: "#FFF4ED" },
  { weight: "100", hex: "#FEE6D6" },
  { weight: "200", hex: "#FDC9AB" },
  { weight: "300*", hex: "#FBA376" },
  { weight: "400", hex: "#F8733F" },
  { weight: "500", hex: "#F54A14" },
  { weight: "600", hex: "#E63510" },
  { weight: "700", hex: "#BF240F" },
  { weight: "800", hex: "#981F14" },
  { weight: "900*", hex: "#7A1D14" },
];

const SECONDARY: Shade[] = [
  { weight: "50", hex: "#EEFDFC" },
  { weight: "100", hex: "#D5F8F7" },
  { weight: "200", hex: "#D3F7F7" },
  { weight: "300*", hex: "#BBF3F2" },
  { weight: "400", hex: "#A2EEEE" },
  { weight: "500", hex: "#84E9E8" },
  { weight: "600", hex: "#1D949D" },
  { weight: "700", hex: "#1E7780" },
  { weight: "800", hex: "#216169" },
  { weight: "900*", hex: "#1F515A" },
];

const LIME: Shade[] = [
  { weight: "50", hex: "#F6FCDD" },
  { weight: "100", hex: "#EDF9B8" },
  { weight: "200", hex: "#E0F57E" },
  { weight: "300*", hex: "#C7F022" },
  { weight: "400", hex: "#B6DA2F" },
  { weight: "500", hex: "#8FAF2A" },
  { weight: "600", hex: "#5F7F32" },
  { weight: "700", hex: "#3F5F3A" },
  { weight: "800", hex: "#2B4A3F" },
  { weight: "900", hex: "#193133" },
];

const GREEN: Shade[] = [
  { weight: "50*", hex: "#EAFFF6" },
  { weight: "100", hex: "#CFFFEA" },
  { weight: "200", hex: "#A8FBE0" },
  { weight: "300", hex: "#7CF5D6" },
  { weight: "400", hex: "#4DEFC0" },
  { weight: "500", hex: "#2FE3AF" },
  { weight: "600*", hex: "#27E9A6" },
  { weight: "700", hex: "#1FBF8C" },
  { weight: "800", hex: "#148066" },
  { weight: "900", hex: "#0B3D35" },
];

const PURPLE: Shade[] = [
  { weight: "50", hex: "#F0F1FF" },
  { weight: "100", hex: "#DADBFF" },
  { weight: "200", hex: "#B8BBFF" },
  { weight: "300", hex: "#9FA3FE" },
  { weight: "400*", hex: "#8F93FE" },
  { weight: "500", hex: "#6E72F5" },
  { weight: "600", hex: "#5F63EE" },
  { weight: "700*", hex: "#565BEF" },
  { weight: "800", hex: "#4549D6" },
  { weight: "900", hex: "#2F319E" },
];

const BRAND = [
  { name: "Primary", hex: "#F54A14", token: "bg-primary" },
  { name: "Secondary", hex: "#84E9E8", token: "bg-secondary" },
  { name: "Black", hex: "#0E0F10", token: "bg-system-base" },
  { name: "White", hex: "#F4F7F8", token: "bg-foreground" },
];

const SYSTEM = [
  { name: "Background", hex: "#1F2628", token: "bg-background" },
  { name: "Base", hex: "#0E0F10", token: "bg-system-base" },
  { name: "Border", hex: "#3A4043", token: "border-border" },
  { name: "Text", hex: "#F4F7F8", token: "text-foreground" },
  { name: "Body Text + Icon", hex: "#C5C9CC", token: "text-muted-foreground" },
  { name: "Secondary Text", hex: "#5E666A", token: "text-gray-steel" },
];

const STATES = [
  { name: "Green / Success", base: "#27E9A6", border: "#27E9A6", token: "success" },
  { name: "Red / Error", base: "#FF4D6D", border: "#FF4D6D", token: "error" },
  { name: "Yellow / Warning", base: "#FFD951", border: "#FFD951", token: "warning" },
  { name: "Blue / Info", base: "#487AF6", border: "#487AF6", token: "info" },
];

const SPECIAL = [
  { name: "Para Çek", hex: "#27E9A6", token: "bg-para-cek" },
  { name: "Para Yatır", hex: "#FF4D6D", token: "bg-para-yatir" },
];

// Typography — Figma "Typography" (52609-2020). Typeface: Sora. Each entry's
// className matches the Figma text style (size / weight / line-height / tracking).
type TypeGroup = { group: string; rows: { name: string; meta: string; cls: string }[] };

const TYPE_SCALE: TypeGroup[] = [
  {
    group: "Heading",
    rows: [
      { name: "H1 / Heading 1", meta: "Sora Semibold · 32px", cls: "text-[32px] font-semibold leading-[48px] tracking-[-0.02em]" },
      { name: "H2 / Heading 2", meta: "Sora Semibold · 28px", cls: "text-[28px] font-semibold leading-[42px] tracking-[-0.02em]" },
      { name: "H3 / Heading 3", meta: "Sora Semibold · 24px", cls: "text-[24px] font-semibold leading-[32px] tracking-[-0.02em]" },
      { name: "H3 / Heading Bold 3", meta: "Sora Bold · 24px", cls: "text-[24px] font-bold leading-[32px] tracking-[-0.02em]" },
      { name: "H4 / Heading 4", meta: "Sora Bold · 20px", cls: "text-[20px] font-bold leading-[28px] tracking-[-0.02em]" },
    ],
  },
  {
    group: "Title",
    rows: [
      { name: "Title / Large", meta: "Sora Semibold · 20px", cls: "text-[20px] font-semibold leading-[1.5] tracking-[-0.01em]" },
      { name: "Title / Semibold", meta: "Sora Semibold · 18px", cls: "text-[18px] font-semibold leading-[1.5] tracking-[-0.015em]" },
      { name: "Title / Small", meta: "Sora Semibold · 16px", cls: "text-[16px] font-semibold leading-[1.5] tracking-[-0.015em]" },
    ],
  },
  {
    group: "Body / Large",
    rows: [
      { name: "Body / Large / Bold", meta: "Sora Bold · 16px", cls: "text-[16px] font-bold leading-[1.5] tracking-[-0.01em]" },
      { name: "Body / Large / Semibold", meta: "Sora Semibold · 16px", cls: "text-[16px] font-semibold leading-[1.5] tracking-[-0.01em]" },
      { name: "Body / Large / Regular", meta: "Sora Regular · 16px", cls: "text-[16px] font-normal leading-[1.5] tracking-[-0.01em]" },
    ],
  },
  {
    group: "Body / Medium",
    rows: [
      { name: "Body / Medium / Bold", meta: "Sora Bold · 14px", cls: "text-[14px] font-bold leading-[1.5] tracking-[-0.01em]" },
      { name: "Body / Medium / Semibold", meta: "Sora Semibold · 14px", cls: "text-[14px] font-semibold leading-[1.5] tracking-[-0.015em]" },
      { name: "Body / Medium / Regular", meta: "Sora Regular · 14px", cls: "text-[14px] font-normal leading-[1.5] tracking-[-0.015em]" },
    ],
  },
  {
    group: "Body / Small",
    rows: [
      { name: "Body / Small / Bold", meta: "Sora Bold · 13px", cls: "text-[13px] font-bold leading-[1.4] tracking-[-0.01em]" },
      { name: "Body / Small / Semibold", meta: "Sora Semibold · 13px", cls: "text-[13px] font-semibold leading-[1.4] tracking-[-0.015em]" },
      { name: "Body / Small / Regular", meta: "Sora Regular · 13px", cls: "text-[13px] font-normal leading-[1.4] tracking-[-0.015em]" },
    ],
  },
  {
    group: "Body / XSmall",
    rows: [
      { name: "Body / XSmall / Bold", meta: "Sora Bold · 12px", cls: "text-[12px] font-bold leading-[1.35] tracking-[-0.01em]" },
      { name: "Body / XSmall / Semibold", meta: "Sora Semibold · 12px", cls: "text-[12px] font-semibold leading-[1.35] tracking-[-0.01em]" },
      { name: "Body / XSmall / Regular", meta: "Sora Regular · 12px", cls: "text-[12px] font-normal leading-[1.35] tracking-[-0.01em]" },
    ],
  },
  {
    group: "Label & Button",
    rows: [
      { name: "Label / Semibold", meta: "Sora Semibold · 14px", cls: "text-[14px] font-semibold leading-[14px]" },
      { name: "Label / Small", meta: "Sora Regular · 12px", cls: "text-[12px] font-normal leading-[12px]" },
      { name: "Button / Semibold", meta: "Sora Bold · 14px", cls: "text-[14px] font-bold leading-[20px]" },
      { name: "Button / Small", meta: "Sora Bold · 12px", cls: "text-[12px] font-bold leading-[16px]" },
    ],
  },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Local helpers
 * ──────────────────────────────────────────────────────────────────────── */

const CARD = "rounded-[20px] border border-[#3A4043] bg-[#0E0F10]";

function CopyableCode({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard?.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title="Kopyala"
      className={cn(
        "inline-flex items-center gap-1 rounded-md bg-[#161A1B] px-2 py-1 font-mono text-[11px] text-[#C5C9CC] transition-colors hover:bg-[#1F2628] hover:text-[#F4F7F8]",
        copied && "bg-[#193133] text-[#f54a14]",
        className,
      )}
    >
      {copied ? <Check className="size-3" /> : <Copy className="size-3 opacity-60" />}
      {copied ? "Kopyalandı" : children}
    </button>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5">
      <div className="space-y-1">
        <h2 className="text-title-lg text-[#F4F7F8]">{title}</h2>
        {description && (
          <p className="text-body-sm text-[#788084]">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Panel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={cn(CARD, "p-6", className)}>{children}</div>;
}

/* ──────────────────────────────────────────────────────────────────────────
 * Date filter — preset list + "Özel aralık" (custom two-month calendar)
 * ──────────────────────────────────────────────────────────────────────── */

const DATE_PRESETS = [
  { id: "today", label: "Bugün" },
  { id: "7d", label: "Son 7 gün" },
  { id: "30d", label: "Son 30 gün" },
  { id: "month", label: "Bu ay" },
];

function fmtDate(d?: Date) {
  return d ? d.toLocaleDateString("tr-TR", { day: "2-digit", month: "short" }) : "…";
}

function DateFilter() {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [preset, setPreset] = useState<string>("7d");
  const [range, setRange] = useState<DateRange | undefined>();
  const [draft, setDraft] = useState<DateRange | undefined>();

  const value =
    preset === "custom" && range?.from
      ? `${fmtDate(range.from)} – ${fmtDate(range.to)}`
      : DATE_PRESETS.find((p) => p.id === preset)?.label ?? "Seçiniz";

  return (
    <Popover.Root
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (!o) setShowCustom(false);
      }}
    >
      <Popover.Trigger asChild>
        <FilterPill label="Tarih" value={value} />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="start"
          sideOffset={8}
          className="z-10050 outline-none data-[state=open]:animate-fade-scale"
        >
          {showCustom ? (
            <DateRangePicker
              selected={draft}
              onSelect={setDraft}
              showFooter
              summary={
                draft?.from ? `${fmtDate(draft.from)} – ${fmtDate(draft.to)}` : "Aralık seçin"
              }
              applyDisabled={!draft?.from || !draft?.to}
              onCancel={() => setShowCustom(false)}
              onApply={() => {
                setRange(draft);
                setPreset("custom");
                setShowCustom(false);
                setOpen(false);
              }}
            />
          ) : (
            <div className="min-w-55 rounded-[16px] border border-border bg-[#0E0F10] p-3 shadow-[0px_10px_24px_rgba(0,0,0,0.4)]">
              {DATE_PRESETS.map((p) => {
                const active = preset === p.id;
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => {
                      setPreset(p.id);
                      setOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between gap-6 rounded-[12px] px-3 py-2.5 text-left text-[13px] font-medium transition-colors",
                      active
                        ? "bg-border/50 text-primary"
                        : "text-[#F4F7F8] hover:bg-white/5",
                    )}
                  >
                    {p.label}
                    {active && <Check className="size-4" />}
                  </button>
                );
              })}
              <div className="my-1 h-px bg-[#3A4043]" />
              <button
                type="button"
                onClick={() => {
                  setDraft(range);
                  setShowCustom(true);
                }}
                className={cn(
                  "flex w-full items-center justify-between gap-6 rounded-[10px] px-3 py-2 text-left text-[13px] font-medium transition-colors",
                  preset === "custom"
                    ? "bg-[#f54a14]/10 text-[#f54a14]"
                    : "text-[#C5C9CC] hover:bg-white/5 hover:text-[#F4F7F8]",
                )}
              >
                Özel aralık
                <ChevronRight className="size-4" />
              </button>
            </div>
          )}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function ScaleRow({ name, shades }: { name: string; shades: Shade[] }) {
  return (
    <div className="space-y-3">
      <h3 className="text-[13px] font-semibold uppercase tracking-[0.08em] text-[#788084]">
        {name}
      </h3>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5 lg:grid-cols-10">
        {shades.map((s) => (
          <div key={s.weight} className="space-y-2">
            <div
              className="h-16 rounded-xl border border-white/5 shadow-sm"
              style={{ backgroundColor: s.hex }}
            />
            <div className="space-y-1 text-center">
              <p className="text-[11px] font-semibold text-[#C5C9CC]">{s.weight}</p>
              <CopyableCode className="text-[10px]">{s.hex}</CopyableCode>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Stepper — Figma "Steppers" (cyan secondary done/active, gray upcoming)
 * ──────────────────────────────────────────────────────────────────────── */

function Stepper({
  steps,
  current,
}: {
  steps: { label: string; icon: React.ReactNode }[];
  current: number;
}) {
  const count = steps.length;
  const stepPct = 100 / count;
  const half = stepPct / 2;

  return (
    <div className="relative px-1">
      {/* Track / completed (animated) / current half-gradient — Figma "Steppers" */}
      <div
        className="absolute top-2.75 h-0.75 bg-[#3A4043]"
        style={{ left: `${half}%`, right: `${half}%` }}
      />
      <div
        className="absolute top-2.75 h-0.75 bg-[#84E9E8] transition-all duration-500"
        style={{ left: `${half}%`, width: `${current * stepPct}%` }}
      />
      {current < count - 1 && (
        <div
          className="absolute top-2.75 h-0.75 bg-[linear-gradient(90deg,#F4F7F8_50%,#3A4043_50%)] transition-all duration-500"
          style={{ left: `calc(${half}% + ${current * stepPct}%)`, width: `${half}%` }}
        />
      )}

      <ol
        className="relative grid"
        style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}
      >
        {steps.map((s, i) => {
          const status = i < current ? "completed" : i === current ? "current" : "upcoming";
          return (
            <li key={s.label} className="flex flex-col items-center">
              <div
                className={cn(
                  "relative z-10 mb-3 flex size-6 items-center justify-center rounded-full border bg-[#0E0F10] transition-all duration-200",
                  status === "upcoming" ? "border-[#3A4043]" : "border-[#84E9E8]",
                )}
              >
                {status === "completed" ? (
                  <Check className="size-3.5 text-[#84E9E8]" />
                ) : (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      status === "current" ? "bg-[#84E9E8]" : "bg-[#5E666A]",
                    )}
                  />
                )}
              </div>
              <div className="flex items-center gap-1.5">
                <span className={status === "upcoming" ? "text-[#5E666A]" : "text-[#84E9E8]"}>
                  {s.icon}
                </span>
                <span
                  className={cn(
                    "whitespace-nowrap text-[12px] font-medium",
                    status === "completed"
                      ? "text-[#84E9E8]"
                      : status === "current"
                        ? "text-[#F4F7F8]"
                        : "text-[#5E666A]",
                  )}
                >
                  {s.label}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * Header nav — Figma "Header" (active = primary text + 2px underline)
 * ──────────────────────────────────────────────────────────────────────── */

function HeaderNav({ items, active }: { items: string[]; active: number }) {
  return (
    <div className="flex flex-wrap items-center gap-7 border-b border-border">
      {items.map((item, i) => (
        <button
          key={item}
          type="button"
          className={cn(
            "relative pb-3 text-[15px] transition-colors",
            i === active
              ? "font-bold text-primary"
              : "font-semibold text-foreground hover:text-muted-foreground",
          )}
        >
          {item}
          {i === active && (
            <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary" />
          )}
        </button>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────────
 * DataTable demo data
 * ──────────────────────────────────────────────────────────────────────── */

type DemoRow = {
  id: string;
  asset: string;
  price: string;
  change: string;
  positive: boolean;
};

const demoRows: DemoRow[] = [
  { id: "btc", asset: "Bitcoin · BTC", price: "₺3.214.500", change: "+2,41%", positive: true },
  { id: "eth", asset: "Ethereum · ETH", price: "₺182.340", change: "-1,12%", positive: false },
  { id: "sol", asset: "Solana · SOL", price: "₺6.820", change: "+5,03%", positive: true },
  { id: "xrp", asset: "Ripple · XRP", price: "₺21,40", change: "-0,34%", positive: false },
];

const demoColumns: DataTableColumn<DemoRow>[] = [
  { id: "asset", header: "Varlık", cell: (r) => <span className="font-medium">{r.asset}</span> },
  { id: "price", header: "Fiyat", align: "right", sortable: true, cell: (r) => r.price },
  {
    id: "change",
    header: "24s Değişim",
    align: "right",
    cell: (r) => (
      <span className={r.positive ? "text-[#27E9A6]" : "text-[#FF4D6D]"}>{r.change}</span>
    ),
  },
];

/* ──────────────────────────────────────────────────────────────────────────
 * Page
 * ──────────────────────────────────────────────────────────────────────── */

export default function DesignPage() {
  const [page, setPage] = useState(3);
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [sort, setSort] = useState<{ key: string; direction: "asc" | "desc" } | null>(null);
  const [txType, setTxType] = useState("dep");
  const [query, setQuery] = useState("");
  const [stepIdx, setStepIdx] = useState(1);

  const APP_STEPS = [
    { label: "Ön Başvuru", icon: <ClipboardList className="size-4" /> },
    { label: "Şirket Bilgileri", icon: <Building2 className="size-4" /> },
    { label: "Evrak Yükleme", icon: <FileText className="size-4" /> },
    { label: "Değerlendirme", icon: <BadgeCheck className="size-4" /> },
  ];

  return (
    <I18nProvider locale={DEFAULT_LOCALE} messages={{}}>
    <div className="dark min-h-screen bg-[#0E0F10] px-5 py-10 font-satoshi text-[#F4F7F8] md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <header className="space-y-2">
          <p className="text-[13px] font-medium uppercase tracking-[0.18em] text-[#f54a14]">
            otcn
          </p>
          <h1 className="text-h1 text-[#F4F7F8]">Design Guideline</h1>
          <p className="text-body-md max-w-2xl text-[#788084]">
            Renk paleti ve uygulamada kullanılan tüm UI bileşenlerinin canlı
            referansı. Her sekme farklı bir grubu gösterir.
          </p>
        </header>

        <Tabs defaultValue="colors" className="space-y-10">
          <TabsList animated className="flex-wrap">
            <TabsTrigger value="colors">Colors</TabsTrigger>
            <TabsTrigger value="typography">Typography</TabsTrigger>
            <TabsTrigger value="buttons">Buttons</TabsTrigger>
            <TabsTrigger value="forms">Forms</TabsTrigger>
            <TabsTrigger value="navigation">Navigation</TabsTrigger>
            <TabsTrigger value="data">Data &amp; Feedback</TabsTrigger>
          </TabsList>

          {/* ─────────────────────────── COLORS ─────────────────────────── */}
          <TabsContent value="colors" className="space-y-12">
            <Section title="Brand" description="Primary, Secondary ve nötr çekirdek renkler.">
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {BRAND.map((c) => (
                  <div key={c.name} className={cn(CARD, "overflow-hidden")}>
                    <div className="h-40" style={{ backgroundColor: c.hex }} />
                    <div className="space-y-2 p-4">
                      <p className="text-title-sm text-[#F4F7F8]">{c.name}</p>
                      <CopyableCode>{c.hex}</CopyableCode>
                      <CopyableCode className="block w-full text-[#f54a14]">
                        {c.token}
                      </CopyableCode>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section
              title="Color Scales"
              description="Marka ve fonksiyonel skalalar. * işaretli tonlar ana referanstır."
            >
              <Panel className="space-y-8">
                <ScaleRow name="Primary" shades={PRIMARY} />
                <ScaleRow name="Secondary" shades={SECONDARY} />
                <ScaleRow name="Lime" shades={LIME} />
                <ScaleRow name="Green" shades={GREEN} />
                <ScaleRow name="Purple · değişecek" shades={PURPLE} />
              </Panel>
            </Section>

            <Section title="System" description="Yüzey, kenarlık ve metin tonları (dark).">
              <Panel>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {SYSTEM.map((t) => (
                    <div key={t.name} className="flex items-center gap-3">
                      <div
                        className="size-12 shrink-0 rounded-xl border border-white/10"
                        style={{ backgroundColor: t.hex }}
                      />
                      <div className="space-y-1">
                        <p className="text-title-sm text-[#F4F7F8]">{t.name}</p>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <CopyableCode>{t.hex}</CopyableCode>
                          <CopyableCode className="text-[#f54a14]">{t.token}</CopyableCode>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </Section>

            <Section title="State" description="Success, error, warning ve info durum renkleri.">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {STATES.map((s) => (
                  <div
                    key={s.name}
                    className={cn(CARD, "space-y-4 p-5")}
                    style={{ borderColor: s.border }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="size-6 rounded-full"
                        style={{ backgroundColor: s.border }}
                      />
                      <h3 className="text-title-sm text-[#F4F7F8]">{s.name}</h3>
                    </div>
                    <div className="space-y-2">
                      <div
                        className="h-8 rounded-lg"
                        style={{ backgroundColor: s.base, opacity: 0.18 }}
                      />
                      <div className="h-8 rounded-lg" style={{ backgroundColor: s.border }} />
                      <CopyableCode className="text-[#f54a14]">{`border-${s.token}-border`}</CopyableCode>
                    </div>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Special" description="İşleme özel vurgu renkleri.">
              <div className="grid grid-cols-2 gap-4 sm:max-w-md">
                {SPECIAL.map((s) => (
                  <div key={s.name} className={cn(CARD, "space-y-3 p-5")}>
                    <div className="h-12 rounded-lg" style={{ backgroundColor: s.hex }} />
                    <p className="text-title-sm text-[#F4F7F8]">{s.name}</p>
                    <div className="flex flex-wrap gap-1.5">
                      <CopyableCode>{s.hex}</CopyableCode>
                      <CopyableCode className="text-[#f54a14]">{s.token}</CopyableCode>
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* ───────────────────────── TYPOGRAPHY ───────────────────────── */}
          <TabsContent value="typography" className="space-y-10 font-sora">
            {/* Typeface specimen — Figma "Typeface" */}
            <Section title="Typeface" description="Tasarım sistemi yazı tipi: Sora.">
              <div className={cn(CARD, "flex flex-col overflow-hidden md:flex-row")}>
                <div className="flex flex-col items-start justify-center gap-2 bg-[#F4F7F8] p-8 md:w-90">
                  <span className="font-sora text-[88px] font-semibold leading-none tracking-[-0.02em] text-[#0E0F10]">
                    Aa
                  </span>
                  <span className="font-sora text-[40px] font-bold tracking-[-0.02em] text-[#0E0F10]">
                    Sora
                  </span>
                </div>
                <div className="flex flex-1 flex-col justify-center gap-6 border-t border-[#3A4043] p-8 md:border-l md:border-t-0">
                  <div className="flex flex-wrap gap-x-12 gap-y-2">
                    <span className="text-[20px] font-normal text-[#9EA3AE]">Regular</span>
                    <span className="text-[20px] font-semibold text-[#9EA3AE]">Semibold</span>
                    <span className="text-[20px] font-bold text-[#9EA3AE]">Bold</span>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[28px] font-semibold tracking-[-0.02em] text-[#F4F7F8]">
                      AaBbCcDdEeFfGg
                    </p>
                    <p className="text-[28px] font-semibold tracking-[0.01em] text-[#F4F7F8]">
                      0123456789
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            {/* Styles — full type scale */}
            <Section title="Styles" description="Figma “Typography” (52609-2020) tam ölçek.">
              <div className="space-y-8">
                {TYPE_SCALE.map((g) => (
                  <div key={g.group} className={cn(CARD, "p-6")}>
                    <h3 className="mb-2 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#788084]">
                      {g.group}
                    </h3>
                    <div className="divide-y divide-[#3A4043]">
                      {g.rows.map((r) => (
                        <div
                          key={r.name}
                          className="flex flex-col gap-3 py-5 md:flex-row md:items-center md:justify-between"
                        >
                          <div className="min-w-55 space-y-0.5">
                            <p className="text-[14px] font-semibold text-[#F4F7F8]">{r.name}</p>
                            <p className="text-[12px] text-[#788084]">{r.meta}</p>
                          </div>
                          <p className={cn("truncate text-[#C5C9CC] md:text-right", r.cls)}>
                            The quick brown fox jumps over the lazy dog
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Section>
          </TabsContent>

          {/* ─────────────────────────── BUTTONS ────────────────────────── */}
          <TabsContent value="buttons" className="space-y-10">
            <Section
              title="Types & Styles"
              description="Figma “Button” (52609-3087): Primary (solid turuncu), Secondary (solid beyaz) ve Bordered. Metin Sora Bold."
            >
              <Panel className="space-y-6">
                {/* Each row = one type/style across the three sizes */}
                {[
                  { label: "Primary · Solid", variant: "default" as const },
                  { label: "Secondary · Solid", variant: "secondary" as const },
                  { label: "Secondary · Bordered", variant: "outline" as const },
                ].map((row) => (
                  <div key={row.label} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-body-xs-medium text-[#F4F7F8]">{row.label}</span>
                      <CopyableCode className="text-[#f54a14]">{`variant="${row.variant}"`}</CopyableCode>
                    </div>
                    <div className="flex flex-wrap items-center gap-4">
                      <Button variant={row.variant} size="lg">
                        <Plus /> Large <ArrowRight className="button-arrow" />
                      </Button>
                      <Button variant={row.variant}>
                        <Plus /> Medium <ArrowRight className="button-arrow" />
                      </Button>
                      <Button variant={row.variant} size="sm">
                        <Plus /> Small <ArrowRight className="button-arrow" />
                      </Button>
                      <Button variant={row.variant} disabled>
                        Disabled
                      </Button>
                    </div>
                  </div>
                ))}
              </Panel>
            </Section>

            <Section
              title="Sizes & Radius"
              description="Boyut → köşe: Small 8px · Medium 12px · Large 16px (Figma xsmall / s-m / m-l)."
            >
              <Panel className="flex flex-wrap items-center gap-4">
                <Button size="sm">Small · 8px</Button>
                <Button>Medium · 12px</Button>
                <Button size="lg">Large · 16px</Button>
                <Button size="xl">XL</Button>
                <Button size="icon" aria-label="ekle">
                  <Plus />
                </Button>
                <Button size="icon-sm" variant="outline" aria-label="ara">
                  <Search />
                </Button>
              </Panel>
            </Section>

            <Section
              title="Para Çek / Yatır"
              description="Figma “Para çek yatır” (52609-3283): pill, 2px renkli çerçeve, hover’da dolu + koyu metin."
            >
              <Panel className="flex flex-wrap items-center gap-4">
                <Button variant="glow-green" size="lg">Para Yatır</Button>
                <Button variant="glow-red" size="lg">Para Çek</Button>
                <span className="text-body-xs text-[#788084]">↑ üzerine gel: dolgu görünür</span>
              </Panel>
            </Section>

            <Section title="Diğer" description="Yardımcı varyantlar.">
              <Panel className="flex flex-wrap items-center gap-4">
                <Button variant="dark">Dark</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="green">Green</Button>
                <Button variant="link">Link</Button>
              </Panel>
            </Section>

            <Section
              title="Small Components"
              description="Figma “Small Components” (52609-2191): Badge, Toggle, Checkbox."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                {/* Badge */}
                <div className={cn(CARD, "space-y-4 p-6")}>
                  <p className="text-body-xs-medium uppercase tracking-[0.08em] text-[#788084]">Badge</p>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge direction="up">12%</Badge>
                    <Badge direction="down">12%</Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge direction="up" soft>12%</Badge>
                    <Badge direction="down" soft>12%</Badge>
                  </div>
                  <CopyableCode className="text-[#f54a14]">{`<Badge direction="up" soft />`}</CopyableCode>
                </div>

                {/* Toggle */}
                <div className={cn(CARD, "space-y-4 p-6")}>
                  <p className="text-body-xs-medium uppercase tracking-[0.08em] text-[#788084]">Toggle</p>
                  <div className="flex items-center gap-4">
                    <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                    <Switch defaultChecked={false} />
                    <Switch disabled defaultChecked />
                  </div>
                  <CopyableCode className="text-[#f54a14]">{`<Switch />`}</CopyableCode>
                </div>

                {/* Checkbox */}
                <div className={cn(CARD, "space-y-4 p-6")}>
                  <p className="text-body-xs-medium uppercase tracking-[0.08em] text-[#788084]">Checkbox</p>
                  <div className="flex items-center gap-4">
                    <Checkbox checked={checked} onCheckedChange={(v) => setChecked(Boolean(v))} />
                    <Checkbox defaultChecked={false} />
                    <Checkbox disabled defaultChecked />
                  </div>
                  <CopyableCode className="text-[#f54a14]">{`<Checkbox />`}</CopyableCode>
                </div>
              </div>
            </Section>
          </TabsContent>

          {/* ─────────────────────────── FORMS ──────────────────────────── */}
          <TabsContent value="forms" className="space-y-10">
            <Section
              title="Input"
              description="Figma “Inputs” (52609-2849): rounded-12, focus beyaz çerçeve + gölge, error #FF4D6D, success #27E9A6 + check. Label üstte, mesaj altta."
            >
              <Panel className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="i-default" className="text-[#C5C9CC]">Default</Label>
                  <Input id="i-default" placeholder="Input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="i-active" className="text-[#C5C9CC]">Active</Label>
                  <Input id="i-active" defaultValue="Input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="i-error" className="text-[#C5C9CC]">Error</Label>
                  <Input id="i-error" variant="error" defaultValue="Input" />
                  <p className="text-body-xs-medium text-[#FF4D6D]">Message</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="i-success" className="text-[#C5C9CC]">Success</Label>
                  <div className="relative">
                    <Input id="i-success" variant="success" defaultValue="Input" className="pr-10" />
                    <Check className="absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#27E9A6]" />
                  </div>
                  <p className="text-body-xs-medium text-[#27E9A6]">Message</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="i-disabled" className="text-[#5E666A]">Disabled</Label>
                  <Input id="i-disabled" disabled placeholder="Input" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="i-sm" className="text-[12px] text-[#C5C9CC]">Small (m/s)</Label>
                  <Input id="i-sm" placeholder="Input" className="h-9.5 py-2.5 text-[13px]" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="i-auth" className="text-[#C5C9CC]">Auth (login)</Label>
                  <Input id="i-auth" variant="auth" placeholder="E-posta adresi" />
                </div>
              </Panel>
            </Section>

            <Section title="Textarea & Select">
              <Panel className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <Textarea
                  label="Açıklama"
                  placeholder="Notunuzu yazın…"
                  helperText="En fazla 280 karakter."
                />
                <div className="space-y-2">
                  <Label>Varlık</Label>
                  <Select>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seçiniz" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="btc">Bitcoin (BTC)</SelectItem>
                      <SelectItem value="eth">Ethereum (ETH)</SelectItem>
                      <SelectItem value="sol">Solana (SOL)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </Panel>
            </Section>

            <Section title="Checkbox, Switch & Label">
              <Panel className="flex flex-col gap-6">
                <Label className="cursor-pointer">
                  <Checkbox
                    checked={checked}
                    onCheckedChange={(v) => setChecked(Boolean(v))}
                  />
                  Kullanım koşullarını okudum
                </Label>
                <Label className="cursor-pointer">
                  <Switch checked={switchOn} onCheckedChange={setSwitchOn} />
                  E-posta bildirimleri
                </Label>
              </Panel>
            </Section>

            <Section
              title="Search"
              description="Figma “Search products input” (52609-11387): nötr ikon, turuncu caret, sonuç dropdown’u, temizleme."
            >
              <Panel className="max-w-md">
                <SearchInput
                  value={query}
                  onValueChange={setQuery}
                  placeholder="Kripto ara…"
                  resultsLabel="İlgili sonuçlar"
                  emptyText="Sonuç bulunamadı"
                  results={[
                    { name: "Bitcoin", symbol: "BTC" },
                    { name: "Ethereum", symbol: "ETH" },
                    { name: "Solana", symbol: "SOL" },
                    { name: "Ripple", symbol: "XRP" },
                    { name: "Cardano", symbol: "ADA" },
                  ].filter((c) =>
                    `${c.name} ${c.symbol}`.toLowerCase().includes(query.toLowerCase()),
                  )}
                />
              </Panel>
            </Section>

            <Section
              title="Autocomplete"
              description="Figma “autocomplete” (52609-11372): satır içi tamamlama (yazılan beyaz + öneri grisi + turuncu caret) ve seçim dropdown’u. Tab/→ ile tamamla, ↑↓ gezin, Enter seç."
            >
              <Panel className="max-w-md">
                <AutocompleteInput
                  placeholder="Kripto ara…"
                  suggestions={[
                    "PayPal USD (PYUSD)",
                    "Polygon (MATIC)",
                    "Pyth Network (PYTH)",
                    "Polkadot (DOT)",
                    "Bitcoin (BTC)",
                    "Ethereum (ETH)",
                    "Solana (SOL)",
                  ]}
                />
              </Panel>
            </Section>

            <Section
              title="Filters"
              description="Figma “Filters” (52609-10380): label + ayraç + değer + chevron. l-g r16 · s-m r12."
            >
              <Panel className="flex flex-wrap items-center gap-4">
                <FilterPill label="İşlem Türü" />
                <FilterPill label="İşlem Türü" value="Para Yatırma" />
                <FilterPill
                  label="İşlem Türü"
                  value="Para Yatırma"
                  className="h-auto rounded-[16px] px-4 py-3"
                />
                <ResponsiveFilter
                  label="İşlem Türü"
                  value={txType}
                  onValueChange={setTxType}
                  drawerTitle="İşlem Türü"
                  options={[
                    { label: "Tümü", value: "all" },
                    { label: "Para Yatırma", value: "dep" },
                    { label: "Para Çekme", value: "wd" },
                  ]}
                />
              </Panel>
            </Section>

            <Section
              title="Date Picker"
              description="İki mod: hazır aralık listesi → “Özel aralık” seçilince iki-aylık takvim (Figma 52609-10509 / 10518)."
            >
              <Panel className="space-y-6">
                <div className="space-y-2">
                  <p className="text-body-xs text-[#788084]">
                    Filtre modu — preset + özel (popover)
                  </p>
                  <DateFilter />
                </div>
                <div className="space-y-2">
                  <p className="text-body-xs text-[#788084]">
                    Standalone — iki-aylık range takvim
                  </p>
                  <DateRangePicker showFooter summary="Tarih aralığı seçin" className="w-fit" />
                </div>
              </Panel>
            </Section>
          </TabsContent>

          {/* ───────────────────────── NAVIGATION ───────────────────────── */}
          <TabsContent value="navigation" className="space-y-10">
            <Section
              title="Tabs"
              description="Segmented control — Figma “Tab” (52609-2190). Konteyner padding 4px, gap 2px; aktif pill gölge 0px 1px 2px 1px rgba(21,21,20,.05)."
            >
              <Panel className="space-y-8">
                {/* l-g: container #0E0F10 (r16) · active pill #F4F7F8 (r12) · text #0E0F10 / inactive #C5C9CC */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-body-xs-medium text-[#F4F7F8]">Large</span>
                    <CopyableCode className="text-[#f54a14]">variant=&quot;default&quot;</CopyableCode>
                    <span className="text-body-xs text-[#788084]">16px · Sora SemiBold</span>
                  </div>
                  <Tabs defaultValue="a">
                    <TabsList animated>
                      <TabsTrigger value="a">First tab</TabsTrigger>
                      <TabsTrigger value="b">Second tab</TabsTrigger>
                      <TabsTrigger value="c">Third tab</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* s-m: container #1F2628 (r12) · active pill #0E0F10 (r8) · text #F4F7F8 / inactive #C5C9CC */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-body-xs-medium text-[#F4F7F8]">Small</span>
                    <CopyableCode className="text-[#f54a14]">variant=&quot;compact&quot;</CopyableCode>
                    <span className="text-body-xs text-[#788084]">12px · Sora SemiBold</span>
                  </div>
                  <Tabs defaultValue="a" variant="compact">
                    <TabsList animated>
                      <TabsTrigger value="a">Kripto Varlık Birimi</TabsTrigger>
                      <TabsTrigger value="b">Kripto Varlık Kategorisi</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* subtle: dark card / modal içi tam genişlik toggle */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-body-xs-medium text-[#F4F7F8]">Subtle</span>
                    <CopyableCode className="text-[#f54a14]">variant=&quot;subtle&quot;</CopyableCode>
                    <span className="text-body-xs text-[#788084]">kart/modal içi</span>
                  </div>
                  <Tabs defaultValue="a" variant="subtle" className="max-w-sm">
                    <TabsList animated>
                      <TabsTrigger value="a">Al</TabsTrigger>
                      <TabsTrigger value="b">Sat</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* segment: Figma "Tab" — koyu card pill, 16px, içerik bölümleri */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-body-xs-medium text-[#F4F7F8]">Segment</span>
                    <CopyableCode className="text-[#f54a14]">variant=&quot;segment&quot;</CopyableCode>
                    <span className="text-body-xs text-[#788084]">16px · içerik bölümü</span>
                  </div>
                  <Tabs defaultValue="a" variant="segment">
                    <TabsList animated>
                      <TabsTrigger value="a">Gainers</TabsTrigger>
                      <TabsTrigger value="b">Most Visited</TabsTrigger>
                      <TabsTrigger value="c">New</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>
              </Panel>
            </Section>

            <Section title="Accordion">
              <Panel>
                <Accordion type="single" collapsible>
                  <AccordionItem value="1" className="border-[#3A4043]">
                    <AccordionTrigger>Para yatırma ne kadar sürer?</AccordionTrigger>
                    <AccordionContent className="text-[#C5C9CC]">
                      Banka havalesi genelde anında, FAST ile 7/24 birkaç saniyede
                      hesabınıza geçer.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="2" className="border-[#3A4043]">
                    <AccordionTrigger>İşlem ücreti var mı?</AccordionTrigger>
                    <AccordionContent className="text-[#C5C9CC]">
                      Maker/taker ücretleri işlem hacminize göre kademeli olarak
                      uygulanır.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </Panel>
            </Section>

            <Section title="Pagination">
              <Panel className="flex justify-center">
                <Pagination currentPage={page} totalPages={10} onPageChange={setPage} />
              </Panel>
            </Section>

            <Section
              title="Dropdown / List"
              description="Figma “List” (52609-10457): seçili öğe zemin border/50, metin primary (#F54A14)."
            >
              <Panel className="max-w-55">
                <div className="rounded-[16px] border border-border bg-[#0E0F10] p-3">
                  {["Tümü", "Para Yatırma", "Para Çekme", "Komisyon"].map((item, i) => (
                    <button
                      key={item}
                      type="button"
                      className={cn(
                        "flex w-full items-center justify-between rounded-[12px] px-3 py-2.5 text-left text-[13px] transition-colors",
                        i === 1
                          ? "bg-border/50 font-semibold text-primary"
                          : "font-normal text-[#F4F7F8] hover:bg-white/5",
                      )}
                    >
                      {item}
                      {i === 1 && <Check className="size-4" />}
                    </button>
                  ))}
                </div>
              </Panel>
            </Section>

            <Section
              title="Stepper"
              description="Figma “Steppers” (52609-2498): animasyonlu ilerleme — tamamlanan cyan #84E9E8, current beyaz, sıradaki #5E666A. (ApplicationStepper ile aynı dil.)"
            >
              <Panel className="space-y-6">
                <Stepper steps={APP_STEPS} current={stepIdx} />
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={stepIdx === 0}
                    onClick={() => setStepIdx((i) => Math.max(0, i - 1))}
                  >
                    Geri
                  </Button>
                  <Button
                    size="sm"
                    disabled={stepIdx === APP_STEPS.length - 1}
                    onClick={() => setStepIdx((i) => Math.min(APP_STEPS.length - 1, i + 1))}
                  >
                    İlerle
                  </Button>
                  <span className="text-body-xs text-[#788084]">
                    Adım {stepIdx + 1}/{APP_STEPS.length}
                  </span>
                </div>
              </Panel>
            </Section>

            <Section
              title="Header Nav"
              description="Figma “Header” (52609-2238): aktif sekme turuncu #F54A14 + 2px alt çizgi."
            >
              <Panel>
                <HeaderNav
                  items={["Genel Bakış", "Al - Sat", "İşlemlerim", "Varlıklarım"]}
                  active={1}
                />
              </Panel>
            </Section>
          </TabsContent>

          {/* ────────────────────── DATA & FEEDBACK ─────────────────────── */}
          <TabsContent value="data" className="space-y-10">
            <Section title="DataTable" description="Uygulamanın kanonik tablo bileşeni.">
              <DataTable
                columns={demoColumns}
                data={demoRows}
                getRowId={(r) => r.id}
                sort={sort}
                onSortChange={(key) =>
                  setSort((p) =>
                    p?.key === key
                      ? { key, direction: p.direction === "asc" ? "desc" : "asc" }
                      : { key, direction: "asc" },
                  )
                }
              />
            </Section>

            <Section
              title="Alert / InfoBox"
              description="Figma “State” (52609-3435): success / error / warning / info — radial ikon zemini, durum renkleri."
            >
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <InfoBox variant="success-dark" title="Başarılı">
                  Para çekme talebiniz onaylandı.
                </InfoBox>
                <InfoBox variant="error-dark" title="Hata">
                  İşlem tamamlanamadı, lütfen tekrar deneyin.
                </InfoBox>
                <InfoBox variant="warning-dark" title="Uyarı">
                  İşlem şifrenizi kimseyle paylaşmayın.
                </InfoBox>
                <InfoBox variant="info-dark" title="Bilgi">
                  KYC doğrulaması tamamlandıktan sonra limitleriniz artar.
                </InfoBox>
              </div>
            </Section>

            <Section
              title="Toast"
              description="Anlık bildirimler (sonner). State renkleriyle: success/error/warning/info."
            >
              <Panel className="flex flex-wrap gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.success("İşlem başarılı")}
                >
                  Success
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.error("Bir hata oluştu")}
                >
                  Error
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast.warning("Dikkat edin")}
                >
                  Warning
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toast("Bilgilendirme mesajı")}
                >
                  Info
                </Button>
              </Panel>
            </Section>

            <Section title="Empty & Loading">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className={cn(CARD, "p-6")}>
                  <EmptyState
                    title="Kayıt bulunamadı"
                    description="Henüz bir işlem geçmişiniz yok."
                  />
                </div>
                <div className={cn(CARD, "space-y-3 p-6")}>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-10 rounded-full bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-3 w-2/3 bg-white/10" />
                      <Skeleton className="h-3 w-1/3 bg-white/10" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full bg-white/10" />
                </div>
              </div>
            </Section>

            <Section title="Badges" description="Durum etiketleri (token referansı).">
              <Panel className="flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#27E9A6]/10 px-3 py-1 text-body-sm text-[#27E9A6]">
                  <Check className="size-3.5" /> Tamamlandı
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FFD951]/10 px-3 py-1 text-body-sm text-[#FFD951]">
                  <Info className="size-3.5" /> Beklemede
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#FF4D6D]/10 px-3 py-1 text-body-sm text-[#FF4D6D]">
                  İptal edildi
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#487AF6]/10 px-3 py-1 text-body-sm text-[#487AF6]">
                  Bilgi
                </span>
              </Panel>
            </Section>
          </TabsContent>
        </Tabs>
      </div>
    </div>
    </I18nProvider>
  );
}
