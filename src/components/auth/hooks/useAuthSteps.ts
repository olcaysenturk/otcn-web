"use client";

import { useI18n } from "@/lib/i18n/I18nProvider";
import type { AuthStep, AuthStepStatus } from "../types";

export type AuthFlowStage = "verify" | "password" | "success";

const STAGE_STATUS: Record<
  AuthFlowStage,
  Record<AuthStep["id"], AuthStepStatus>
> = {
  verify: {
    "activate-account": "current",
    "create-password": "upcoming",
    "start-trading": "upcoming",
  },
  password: {
    "activate-account": "completed",
    "create-password": "current",
    "start-trading": "upcoming",
  },
  success: {
    "activate-account": "completed",
    "create-password": "completed",
    "start-trading": "current",
  },
};

function baseSteps(t: (key: string) => string): Omit<AuthStep, "status">[] {
  return [
    {
      id: "activate-account",
      title: t("auth.steps.activate.title"),
      description: t("auth.steps.activate.description"),
    },
    {
      id: "create-password",
      title: t("auth.steps.password.title"),
      description: t("auth.steps.password.description"),
    },
    {
      id: "start-trading",
      title: t("auth.steps.start.title"),
      description: t("auth.steps.start.description"),
    },
  ];
}

export function useAuthSteps(stage: AuthFlowStage): AuthStep[] {
  const { t } = useI18n();
  return baseSteps(t).map((step) => ({
    ...step,
    status: STAGE_STATUS[stage][step.id],
  }));
}
