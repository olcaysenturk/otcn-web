import { JSX } from "react";
import type { ApplicationTab } from "@/components/application/ApplicationTabs";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/getMessages";
import {
  PreApplicationIcon,
  CompanyInfoIcon,
  DigitalDocumentIcon,
  WetSignatureIcon,
  ReviewProcessIcon,
} from "@/components/application/StepIcons";

type TabDef = {
  id: string;
  slug: string;
  status: "success" | "pending";
  icon: JSX.Element;
  labelKey: string;
  descriptionKey: string;
};

const TAB_DEFS: TabDef[] = [
  {
    id: "pre-application",
    slug: "pre-application",
    status: "success",
    icon: <PreApplicationIcon className="h-5 w-5" />,
    labelKey: "application.tabs.pre.label",
    descriptionKey: "application.tabs.pre.description",
  },
  {
    id: "company-info",
    slug: "company-info",
    status: "success",
    icon: <CompanyInfoIcon className="h-5 w-5" />,
    labelKey: "application.tabs.company.label",
    descriptionKey: "application.tabs.company.description",
  },
  {
    id: "digital-document-upload",
    slug: "digital-document-upload",
    status: "pending",
    icon: <DigitalDocumentIcon className="h-5 w-5" />,
    labelKey: "application.tabs.digital.label",
    descriptionKey: "application.tabs.digital.description",
  },
  {
    id: "wet-signature-delivery",
    slug: "wet-signature-delivery",
    status: "pending",
    icon: <WetSignatureIcon className="h-5 w-5" />,
    labelKey: "application.tabs.wet.label",
    descriptionKey: "application.tabs.wet.description",
  },
  {
    id: "review-process",
    slug: "review-process",
    status: "pending",
    icon: <ReviewProcessIcon className="h-5 w-5" />,
    labelKey: "application.tabs.review.label",
    descriptionKey: "application.tabs.review.description",
  },
];


function translate(messages: Record<string, unknown>, key: string) {
  const parts = key.split(".");
  let current: unknown = messages;

  for (const part of parts) {
    if (current && typeof current === "object" && part in (current as Record<string, unknown>)) {
      current = (current as Record<string, unknown>)[part];
    } else {
      current = undefined;
      break;
    }
  }

  return typeof current === "string" ? current : key;
}

export async function getApplicationTabs(locale: Locale = DEFAULT_LOCALE): Promise<(ApplicationTab & { slug: string })[]> {
  const messages = (await getMessages(locale, ["common"])) as Record<string, unknown>;
  return TAB_DEFS.map((tab) => ({
    ...tab,
    label: translate(messages, tab.labelKey),
    description: translate(messages, tab.descriptionKey),
  }));
}
