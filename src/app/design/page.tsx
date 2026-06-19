"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useState } from "react";
// Using local components matching the user-provided SVGs in public/icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M4 8H12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M8 4V12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const ArrowIcon = ({ className }: { className?: string }) => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M8 3.33464L12 8.0013L8 12.668" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const InfoIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 16V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 8H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const AlertIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="1.5" />
    <path d="M12 8V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M12 16H12.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const CheckIcon = ({ className }: { className?: string }) => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const typographyRows = [
  {
    label: "H1 / Heading 1",
    weight: "Satoshi (Medium)",
    size: "32px font size",
    className: "text-h1",
  },
  {
    label: "H2 / Heading 2",
    weight: "Satoshi (Medium)",
    size: "28px font size",
    className: "text-h2",
  },
  {
    label: "H3 / Heading 3",
    weight: "Satoshi (Medium)",
    size: "24px font size",
    className: "text-h3",
  },
  {
    label: "Title / Large",
    weight: "Satoshi (Medium)",
    size: "20px font size",
    className: "text-title-lg",
  },
  {
    label: "Title / Medium",
    weight: "Satoshi (Medium)",
    size: "16px font size",
    className: "text-title-md",
  },
  {
    label: "Title / Small",
    weight: "Satoshi (Medium)",
    size: "14px font size",
    className: "text-title-sm",
  },
  {
    label: "Body / Large",
    weight: "Satoshi (Medium)",
    size: "16px font size",
    className: "text-body-lg-medium",
  },
  {
    label: "Body / Large",
    weight: "Satoshi (Regular)",
    size: "16px font size",
    className: "text-body-lg",
  },
  {
    label: "Body / Medium",
    weight: "Satoshi (Medium)",
    size: "14px font size",
    className: "text-body-md-medium",
  },
  {
    label: "Body / Medium",
    weight: "Satoshi (Regular)",
    size: "14px font size",
    className: "text-body-md",
  },
  {
    label: "Body / Small",
    weight: "Satoshi (Medium)",
    size: "14px font size",
    className: "text-body-sm-medium",
  },
  {
    label: "Body / Small",
    weight: "Satoshi (Regular)",
    size: "14px font size",
    className: "text-body-sm",
  },
  {
    label: "Body / XSmall",
    weight: "Satoshi (Medium)",
    size: "12px font size",
    className: "text-body-xs-medium",
  },
  {
    label: "Body / XSmall",
    weight: "Satoshi (Regular)",
    size: "12px font size",
    className: "text-body-xs",
  },
];

// CopyableCode Component
const CopyableCode = ({ children, className }: { children: string; className?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(children);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <code
      onClick={handleCopy}
      className={cn(
        "cursor-pointer transition-colors duration-200 hover:bg-gray-200 hover:text-gray-900 active:scale-95 inline-block px-1 rounded",
        copied ? "bg-green-100 text-green-700" : "",
        className
      )}
      title="Click to copy"
    >
      {copied ? "Copied!" : children}
    </code>
  );
};

const TabSwitcher = ({
  options,
  defaultActive,
  className,
  onChange
}: {
  options: string[],
  defaultActive?: string,
  className?: string,
  onChange?: (val: string) => void
}) => {
  const [active, setActive] = useState(defaultActive || options[0]);

  const handleClick = (opt: string) => {
    setActive(opt);
    onChange?.(opt);
  }

  return (
    <div className={cn("inline-flex rounded-full bg-gray-100 p-1", className)}>
      {options.map(opt => (
        <button
          key={opt}
          onClick={() => handleClick(opt)}
          className={cn(
            "rounded-full px-6 py-2 text-xs font-semibold transition-all",
            active === opt
              ? "bg-white text-gray-900 shadow-sm"
              : "text-gray-500 hover:text-gray-900"
          )}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}


export default function DesignPage() {
  return (
    <div className="min-h-screen bg-background p-10 space-y-10">
      <section className="space-y-6">
        <h1 className="text-3xl font-bold">Design System</h1>
        <Tabs defaultValue="ui" className="space-y-10">
          <TabsList className="w-fit rounded-full bg-gray-100 p-1">
            <TabsTrigger value="ui" className="rounded-full px-5 py-2 text-xs font-semibold">
              UI Kit
            </TabsTrigger>
            <TabsTrigger value="colors" className="rounded-full px-5 py-2 text-xs font-semibold">
              Colors
            </TabsTrigger>
            <TabsTrigger value="typography" className="rounded-full px-5 py-2 text-xs font-semibold">
              Typography
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ui" className="space-y-10">
            {/* ... (UI Content same as before) ... */}


            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Buttons</h2>

              {/* Grid matching the image: 4 Columns (Dark, Outline, Primary, Secondary) */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Column 1: Dark (Neutral/Black) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Dark</h3>
                  <div className="flex flex-col items-start gap-4">
                    <Button variant="dark" size="lg">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="dark">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="dark" size="sm">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="pt-2">
                    <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="dark">Button</Button>`}</CopyableCode>
                  </div>
                </div>

                {/* Column 2: Outline (White) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Outline</h3>
                  <div className="flex flex-col items-start gap-4">
                    <Button variant="outline" size="lg">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="outline">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="pt-2">
                    <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="outline">Button</Button>`}</CopyableCode>
                  </div>
                </div>

                {/* Column 3: Primary (Purple) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Primary</h3>
                  <div className="flex flex-col items-start gap-4">
                    <Button variant="default" size="lg">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="default">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="default" size="sm">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="pt-2">
                    <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="default">Button</Button>`}</CopyableCode>
                  </div>
                </div>

                {/* Column 4: Secondary (Light Purple) */}
                <div className="space-y-4">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Secondary</h3>
                  <div className="flex flex-col items-start gap-4">
                    <Button variant="secondary" size="lg">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="secondary">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                    <Button variant="secondary" size="sm">
                      <PlusIcon className="size-4" /> Button <ArrowIcon className="size-4" />
                    </Button>
                  </div>

                  <div className="pt-2">
                    <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="secondary">Button</Button>`}</CopyableCode>
                  </div>
                </div>
              </div>



              {/* Disabled State Row */}
              <div className="pt-4 border-t">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider mb-4">Disabled</h3>
                <div className="flex flex-wrap gap-4">
                  <Button variant="default" disabled>
                    <PlusIcon className="size-4" /> Disabled Primary <ArrowIcon className="size-4" />
                  </Button>
                  <Button variant="secondary" disabled>
                    <PlusIcon className="size-4" /> Disabled Secondary <ArrowIcon className="size-4" />
                  </Button>
                  <Button variant="outline" disabled>
                    <PlusIcon className="size-4" /> Disabled Outline <ArrowIcon className="size-4" />
                  </Button>
                  <Button variant="dark" disabled>
                    <PlusIcon className="size-4" /> Disabled Dark <ArrowIcon className="size-4" />
                  </Button>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Form Elements (Input & Select)</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl">
                {/* Column 1 */}
                <div className="space-y-8">
                  {/* Default Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>

                  {/* Active/Focus Input (Simulated) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" className="pr-10 border-gray-900 border-[1.5px]" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>

                  {/* Error Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" variant="error" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF4D4D]">
                        <AlertIcon className="size-5" />
                      </div>
                    </div>
                    <p className="text-xs text-[#FF4D4D]">Message</p>
                  </div>

                  {/* Success Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" variant="success" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF9D]">
                        <CheckIcon className="size-5" />
                      </div>
                    </div>
                    <p className="text-xs text-[#00FF9D]">Message</p>
                  </div>

                  {/* Disabled Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" disabled className="pr-10 bg-gray-100 border-gray-200" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 2 (Replicating the same) */}
                <div className="space-y-8">
                  {/* Default Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>

                  {/* Active/Focus Input (Simulated) */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" className="pr-10 border-gray-900 border-[1.5px]" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-900">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>

                  {/* Error Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" variant="error" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#FF4D4D]">
                        <AlertIcon className="size-5" />
                      </div>
                    </div>
                    <p className="text-xs text-[#FF4D4D]">Message</p>
                  </div>

                  {/* Success Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" variant="success" className="pr-10" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-[#00FF9D]">
                        <CheckIcon className="size-5" />
                      </div>
                    </div>
                    <p className="text-xs text-[#00FF9D]">Message</p>
                  </div>

                  {/* Disabled Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-gray-600">Label</label>
                    <div className="relative">
                      <Input placeholder="Input" disabled className="pr-10 bg-gray-100 border-gray-200" />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300">
                        <InfoIcon className="size-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Tab Switcher</h2>
              <div className="p-10 bg-gray-50 rounded-xl space-y-4">
                <div>
                  <TabSwitcher options={["Kripto Varlık Birimi", "Kripto Varlık Kategorisi"]} />
                </div>
                <div>
                  <TabSwitcher
                    options={["Kripto Varlık Birimi", "Kripto Varlık Kategorisi"]}
                    className="bg-gray-50 border border-gray-100 shadow-sm"
                  />
                </div>

                <div className="pt-4 border-t mt-4">
                  <p className="text-xs font-medium text-gray-500 mb-2">Usage</p>
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<TabSwitcher options={["Option 1", "Option 2"]} />`}</CopyableCode>
                </div>
              </div>
            </section>

            <section className="space-y-8">
              <h2 className="text-2xl font-semibold">Glow Buttons</h2>

              {/* Red Glow Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Para Çek (Red Glow)</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <Button variant="glow-red" size="xl">
                    Para Çek
                  </Button>
                  <Button variant="glow-red">
                    Para Çek
                  </Button>
                  <Button variant="glow-red" size="sm">
                    Para Çek
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-red" size="xl">Para Çek</Button>`}</CopyableCode>
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-red">Para Çek</Button>`}</CopyableCode>
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-red" size="sm">Para Çek</Button>`}</CopyableCode>
                </div>
              </div>

              {/* Green Glow Group */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Para Yatır (Green Glow)</h3>
                <div className="flex flex-wrap items-center gap-6">
                  <Button variant="glow-green" size="xl">
                    Para Yatır
                  </Button>
                  <Button variant="glow-green">
                    Para Yatır
                  </Button>
                  <Button variant="glow-green" size="sm">
                    Para Yatır
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-green" size="xl">Para Yatır</Button>`}</CopyableCode>
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-green">Para Yatır</Button>`}</CopyableCode>
                  <CopyableCode className="text-[10px] text-gray-500 block">{`<Button variant="glow-green" size="sm">Para Yatır</Button>`}</CopyableCode>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="colors" className="space-y-16">
            {/* Primary Section */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Primary</h2>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                {/* Gradient I */}
                <div className="space-y-3">
                  <div className="h-[300px] rounded-28 bg-gradient-button shadow-lg"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Gradient I</p>
                    <p className="text-xs text-gray-500">(Buttons)</p>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400">#9564F4</p>
                      <p className="text-[10px] text-gray-400">#3E1C82</p>
                    </div>
                    <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-gradient-button</CopyableCode>
                  </div>
                </div>

                {/* Gradient II */}
                <div className="space-y-3">
                  <div className="h-[300px] rounded-28 bg-gradient-card shadow-lg"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Gradient II</p>
                    <p className="text-xs text-gray-500">(Cards)</p>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400">#151514</p>
                      <p className="text-[10px] text-gray-400">#9564F4</p>
                    </div>
                    <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-gradient-card</CopyableCode>
                  </div>
                </div>

                {/* Gradient III */}
                <div className="space-y-3">
                  <div className="h-[300px] rounded-28 bg-gradient-modal shadow-lg"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Gradient III</p>
                    <p className="text-xs text-gray-500">(Modals)</p>
                    <div className="space-y-0.5">
                      <p className="text-[10px] text-gray-400">#9564F4</p>
                      <p className="text-[10px] text-gray-400">#3E1C82</p>
                    </div>
                    <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-gradient-modal</CopyableCode>
                  </div>
                </div>

                {/* White */}
                <div className="space-y-3">
                  <div className="h-[300px] rounded-28 bg-white border border-gray-200 shadow-sm"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">White</p>
                    <p className="text-[10px] text-gray-400">#FFFFFF</p>
                  </div>
                  <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-white</CopyableCode>
                </div>

                {/* Black */}
                <div className="space-y-3">
                  <div className="h-[300px] rounded-28 bg-[#0F121A] shadow-lg"></div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">Black</p>
                    <p className="text-[10px] text-gray-400">#0F121A</p>
                  </div>
                  <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-foreground</CopyableCode>
                </div>
              </div>
            </section>

            {/* Light Theme / Dark Theme */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Light Theme / Dark Theme</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Light Theme */}
                <div className="border border-gray-200 rounded-28 p-8 bg-white space-y-6">
                  <h3 className="text-lg font-semibold">Light Theme</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-theme-bg"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Background</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#EDEAF8</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-theme-bg</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-white border border-gray-200"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Base</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#FFFFFF</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-white</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-white opacity-60 border border-gray-200"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Base (60% op.)</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#FFFFFF</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">bg-white/60</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#F0F0EF]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Light Border</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#F0F0EF</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">border-[#F0F0EF]</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#EAEBE8]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Border</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#EAEBE8</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">border-[#EAEBE8]</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#0F121A]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Text (Primary)</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#0F121A</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">text-foreground</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#4F5C75]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Body Text + Icon</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#4F5C75</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">text-muted-foreground</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-gray-steel"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium">Secondary Text</span>
                        <CopyableCode className="text-[10px] bg-gray-100 px-2 py-1 rounded">#6F7B91</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-600 block mt-1">text-gray-steel</CopyableCode>
                    </div>
                  </div>
                </div>

                {/* Dark Theme */}
                <div className="border border-[#262E42] rounded-28 p-8 bg-[#241257] space-y-6">
                  <h3 className="text-lg font-semibold text-white">Dark Theme</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#241257]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Background</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#241257</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:bg-theme-bg</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#12092C]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Base</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#12092C</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:bg-secondary</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#12092C] opacity-60"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Base (60% op.)</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#12092C</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:bg-secondary/60</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#2F3A52]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Light Border</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#2F3A52</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:border-muted</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#262E42]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Border</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#262E42</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:border-border</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#151514]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Text (Primary)</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#151514</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:text-foreground</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#F1F5F9]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Body Text + Icon</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#F1F5F9</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">dark:text-muted-foreground</CopyableCode>
                    </div>
                    <div className="space-y-2">
                      <div className="h-16 rounded-lg bg-[#E8EDF3]"></div>
                      <div className="flex justify-between items-center">
                        <span className="text-xs font-medium text-white">Secondary Text</span>
                        <CopyableCode className="text-[10px] bg-gray-800 text-gray-300 px-2 py-1 rounded">#E8EDF3</CopyableCode>
                      </div>
                      <CopyableCode className="text-[8px] text-purple-400 block mt-1">text-[#E8EDF3]</CopyableCode>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Colors (Purple, Blue, Orange) */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Colors</h2>

              {/* Purple */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Purple</h3>
                <div className="grid grid-cols-10 gap-2">
                  {[
                    { weight: 50, color: '#F3EFFF' },
                    { weight: 100, color: '#E3DAFF' },
                    { weight: 200, color: '#CDBDFF' },
                    { weight: 300, color: '#B39BFA' },
                    { weight: 400, color: '#9564F4' },
                    { weight: 500, color: '#7D55E8' },
                    { weight: 600, color: '#6C42F3' },
                    { weight: 700, color: '#582FD9' },
                    { weight: 800, color: '#3A1C9A' },
                    { weight: 900, color: '#241257' },
                  ].map(({ weight, color }) => (
                    <div key={weight} className="space-y-2">
                      <div className="h-16 rounded-xl shadow-sm" style={{ backgroundColor: color }}></div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-semibold text-gray-700">{weight}</p>
                        <CopyableCode className="text-[8px] text-gray-400">{color}</CopyableCode>
                        <div className="space-y-0.5 pt-1">
                          <CopyableCode className="block text-[7px] text-purple-600">{`bg-purple-${weight}`}</CopyableCode>
                          <CopyableCode className="block text-[7px] text-purple-600">{`text-purple-${weight}`}</CopyableCode>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blue */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Blue</h3>
                <div className="grid grid-cols-10 gap-2">
                  {[
                    { weight: 50, color: '#F2F7FE' },
                    { weight: 100, color: '#E3EEFD' },
                    { weight: 200, color: '#D4E6FC' },
                    { weight: 300, color: '#C0DAFB' },
                    { weight: 400, color: '#8ABCF9' },
                    { weight: 500, color: '#487AF6' },
                    { weight: 600, color: '#3F67D8' },
                    { weight: 700, color: '#3456B3' },
                    { weight: 800, color: '#2B458C' },
                    { weight: 900, color: '#213563' },
                  ].map(({ weight, color }) => (
                    <div key={weight} className="space-y-2">
                      <div className="h-16 rounded-xl shadow-sm" style={{ backgroundColor: color }}></div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-semibold text-gray-700">{weight}</p>
                        <CopyableCode className="text-[8px] text-gray-400">{color}</CopyableCode>
                        <div className="space-y-0.5 pt-1">
                          <CopyableCode className="block text-[7px] text-blue-600">{`bg-blue-${weight}`}</CopyableCode>
                          <CopyableCode className="block text-[7px] text-blue-600">{`text-blue-${weight}`}</CopyableCode>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Orange */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-600">Orange</h3>
                <div className="grid grid-cols-10 gap-2">
                  {[
                    { weight: 50, color: '#FFF7ED' },
                    { weight: 100, color: '#FFEBD3' },
                    { weight: 200, color: '#FFDFB9' },
                    { weight: 300, color: '#FFD49F' },
                    { weight: 400, color: '#FFB151' },
                    { weight: 500, color: '#FF9A2E' },
                    { weight: 600, color: '#FF8514' },
                    { weight: 700, color: '#F06F00' },
                    { weight: 800, color: '#D86000' },
                    { weight: 900, color: '#B84F00' },
                  ].map(({ weight, color }) => (
                    <div key={weight} className="space-y-2">
                      <div className="h-16 rounded-xl shadow-sm" style={{ backgroundColor: color }}></div>
                      <div className="text-center space-y-1">
                        <p className="text-[10px] font-semibold text-gray-700">{weight}</p>
                        <CopyableCode className="text-[8px] text-gray-400">{color}</CopyableCode>
                        <div className="space-y-0.5 pt-1">
                          <CopyableCode className="block text-[7px] text-orange-600">{`bg-orange-${weight}`}</CopyableCode>
                          <CopyableCode className="block text-[7px] text-orange-600">{`text-orange-${weight}`}</CopyableCode>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* State Colors */}
            <section className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Green / Success */}
                <div className="border-2 border-[#25B88A] rounded-28 p-6 bg-[#E9F8F3] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#25B88A]"></div>
                    <h3 className="text-sm font-bold text-[#0F121A]">Green / Success</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Base</p>
                      <div className="h-8 rounded-lg bg-[#E9F8F3]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#E9F8F3</CopyableCode>
                      <CopyableCode className="text-[8px] text-green-600 block mt-0.5">bg-success-base</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Border / Badge</p>
                      <div className="h-8 rounded-lg bg-[#25B88A]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#25B88A</CopyableCode>
                      <CopyableCode className="text-[8px] text-green-600 block mt-0.5">border-success-border</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#0F121A</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Desc</p>
                      <div className="h-8 rounded-lg bg-[#4F5C75]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#4F5C75</CopyableCode>
                    </div>
                  </div>
                </div>

                {/* Red / Error */}
                <div className="border-2 border-[#FF4D6D] rounded-28 p-6 bg-[#FFEDF0] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#FF4D6D]"></div>
                    <h3 className="text-sm font-bold text-[#0F121A]">Red / Error</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Base</p>
                      <div className="h-8 rounded-lg bg-[#FFEDF0]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#FFEDF0</CopyableCode>
                      <CopyableCode className="text-[8px] text-red-600 block mt-0.5">bg-error-base</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Border / Badge</p>
                      <div className="h-8 rounded-lg bg-[#FF4D6D]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#FF4D6D</CopyableCode>
                      <CopyableCode className="text-[8px] text-red-600 block mt-0.5">border-error-border</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#0F121A</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Desc</p>
                      <div className="h-8 rounded-lg bg-[#4F5C75]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#4F5C75</CopyableCode>
                    </div>
                  </div>
                </div>

                {/* Yellow / Warning */}
                <div className="border-2 border-[#FFD951] rounded-28 p-6 bg-[#FFF8EE] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#FFD951]"></div>
                    <h3 className="text-sm font-bold text-[#0F121A]">Yellow / Warning</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Base</p>
                      <div className="h-8 rounded-lg bg-[#FFF8EE]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#FFF8EE</CopyableCode>
                      <CopyableCode className="text-[8px] text-yellow-600 block mt-0.5">bg-warning-base</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Border / Badge / Icon</p>
                      <div className="h-8 rounded-lg bg-[#FFD951]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#FFD951</CopyableCode>
                      <CopyableCode className="text-[8px] text-yellow-600 block mt-0.5">border-warning-border</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#0F121A</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Desc</p>
                      <div className="h-8 rounded-lg bg-[#4F5C75]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#4F5C75</CopyableCode>
                    </div>
                  </div>
                </div>

                {/* Blue / Info */}
                <div className="border-2 border-[#487AF6] rounded-28 p-6 bg-[#F2F7FE] space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-6 rounded-full bg-[#25B88A]"></div>
                    <h3 className="text-sm font-bold text-[#0F121A]">Blue / Info</h3>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Base</p>
                      <div className="h-8 rounded-lg bg-[#F2F7FE]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#F2F7FE</CopyableCode>
                      <CopyableCode className="text-[8px] text-blue-600 block mt-0.5">bg-info-base</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Border</p>
                      <div className="h-8 rounded-lg bg-[#487AF6]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#487AF6</CopyableCode>
                      <CopyableCode className="text-[8px] text-blue-600 block mt-0.5">border-info-border</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#0F121A</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs text-[#4F5C75]">Desc / Badge</p>
                      <div className="h-8 rounded-lg bg-[#4F5C75]"></div>
                      <CopyableCode className="text-[10px] text-gray-500">#4F5C75</CopyableCode>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Special */}
            <section className="space-y-6">
              <h2 className="text-2xl font-semibold">Special</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                {/* Para Çek */}
                <div className="border-2 border-[#3AFFB6] rounded-28 p-6 bg-[#3AFFB6] space-y-4">
                  <h3 className="text-lg font-bold text-[#0F121A]">Para Çek</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#0F121A]">Base</p>
                      <div className="h-8 rounded-lg bg-[#3AFFB6] border border-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-[#0F121A]">#3AFFB6</CopyableCode>
                      <CopyableCode className="text-[8px] text-[#0F121A] block mt-0.5 font-semibold">bg-para-cek</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#0F121A]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-[#0F121A]">#0F121A</CopyableCode>
                      <CopyableCode className="text-[8px] text-[#0F121A] block mt-0.5 font-semibold">text-foreground</CopyableCode>
                    </div>
                  </div>
                </div>

                {/* Para Yatır */}
                <div className="border-2 border-[#FF4D6D] rounded-28 p-6 bg-[#E9F8F3] space-y-4">
                  <h3 className="text-lg font-bold text-[#0F121A]">Para Yatır</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#0F121A]">Base</p>
                      <div className="h-8 rounded-lg bg-[#E9F8F3] border border-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-[#0F121A]">#E9F8F3</CopyableCode>
                      <CopyableCode className="text-[8px] text-[#0F121A] block mt-0.5 font-semibold">bg-para-yatir</CopyableCode>
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-[#0F121A]">Text</p>
                      <div className="h-8 rounded-lg bg-[#0F121A]"></div>
                      <CopyableCode className="text-[10px] text-[#0F121A]">#0F121A</CopyableCode>
                      <CopyableCode className="text-[8px] text-[#0F121A] block mt-0.5 font-semibold">text-foreground</CopyableCode>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </TabsContent>

          <TabsContent value="typography" className="space-y-6">
            <div className="rounded-28 border border-gray-100 bg-transparent text-gray-900">
              {typographyRows.map((row, index) => (
                <div
                  key={`${row.label}-${row.weight}-${index}`}
                  className="flex flex-col gap-6 border-b border-gray-100 px-6 py-8 md:flex-row md:items-center md:justify-between"
                >
                  <div className="min-w-[220px] space-y-2 text-gray-500">
                    <p className="text-[13px] font-semibold text-blue-600">{row.label}</p>
                    <p className="text-[12px]">{row.weight}</p>
                    <p className="text-[12px] text-gray-400">{row.size}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className={`text-gray-900 ${row.className}`}>
                      The quick brown fox jumps over the lazy dog
                    </div>
                    <CopyableCode className="inline-block rounded-full border border-gray-200 bg-white px-3 py-1 text-[11px] font-medium text-gray-500">
                      {row.className}
                    </CopyableCode>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
