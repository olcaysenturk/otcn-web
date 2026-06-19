"use client";

import { create } from "zustand";
import type { ApplicationFormValues } from "@/lib/validation/ApplicationSchema";

type ApplicationStoreState = {
  formValues: ApplicationFormValues | null;
  setFormValues: (values: ApplicationFormValues) => void;
  isSavingGlobal: boolean;
  setIsSavingGlobal: (val: boolean) => void;
  submitAction: (() => Promise<void>) | null;
  setSubmitAction: (action: (() => Promise<void>) | null) => void;
};

export const useApplicationStore = create<ApplicationStoreState>((set) => ({
  formValues: null,
  setFormValues: (values) => set({ formValues: values }),
  isSavingGlobal: false,
  setIsSavingGlobal: (val) => set({ isSavingGlobal: val }),
  submitAction: null,
  setSubmitAction: (action) => set({ submitAction: action }),
}));
