"use client";

import type { ReactNode } from "react";
import type { AuthStep } from "../types";
import { AuthSteps } from "./AuthSteps";

export type { AuthStep, AuthStepStatus } from "../types";

type AuthLayoutProps = {
  heading: string;
  steps: AuthStep[];
  email: string;
  callCenter: string;
  whatsappHref?: string;
  telegramHref?: string;
  children: ReactNode;
  showSteps?: boolean;
  leftContent?: ReactNode;
};

export function AuthLayout({
  heading,
  steps,
  children,
  showSteps = true,
  leftContent,
}: AuthLayoutProps) {
  return (
    <div className="flex min-h-[calc(100dvh-80px)] w-full justify-center overflow-auto px-2 pb-2 pt-6 md:px-6 md:pb-6 md:pt-1">
      <div className="relative z-10 flex w-full max-w-[1440px] flex-1 flex-col overflow-hidden rounded-[24px] border border-[#3A4043] bg-[#0D0F10] lg:flex-row lg:gap-0 lg:rounded-[48px] lg:border-0">
        <aside className="relative hidden min-h-[760px] shrink-0 overflow-hidden rounded-[40px] border border-[#3A4043] lg:m-6 lg:mr-0 lg:flex lg:w-[580px] lg:flex-col">
          {leftContent ?? (
            <div className="flex h-full flex-col justify-end p-8">
              <h1 className="text-3xl font-bold">{heading}</h1>
              {showSteps && <AuthSteps steps={steps} />}
            </div>
          )}
        </aside>

        <section className="relative flex min-h-[698px] flex-1 items-stretch justify-center px-5 py-7 lg:min-h-0 lg:items-center lg:px-16 lg:py-12">
          <div className="flex h-full w-full max-w-[520px] flex-col lg:h-auto lg:block">
            {children}
          </div>
        </section>
      </div>
    </div>
  );
}
