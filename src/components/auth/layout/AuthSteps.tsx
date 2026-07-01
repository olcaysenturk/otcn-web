"use client";

import { cn } from "@/lib/utils";
import type { AuthStep } from "../types";

type AuthStepsProps = {
  steps: AuthStep[];
};

export function AuthSteps({ steps }: AuthStepsProps) {
  return (
    <div className="relative pl-2">
      <div
        className="absolute left-[27px] top-4 bottom-12 w-px border-l-2 border-dashed border-[#E8EDF3]"
        aria-hidden
      />
      <div className="relative space-y-8">
        {steps.map((step, index) => (
          <div key={step.id} className="relative flex gap-6">
            <div className="shrink-0">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold ring-4 ring-[#e0e7ff] shadow-sm",
                  step.status === "current"
                    ? "bg-[#4f46e5] text-white shadow-md"
                    : "bg-white text-gray-500 ring-[#e2e4e8] border border-[#E8EDF3]",
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </div>
            </div>
            <div>
              <h3 className="mb-1 text-base font-semibold text-gray-900">
                {step.title}
              </h3>
              <p className="text-sm leading-relaxed text-gray-600">
                {step.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
