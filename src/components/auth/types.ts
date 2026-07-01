export type AuthStepStatus = "current" | "upcoming" | "completed";

export type AuthStep = {
  id: string;
  title: string;
  description: string;
  status?: AuthStepStatus;
};
