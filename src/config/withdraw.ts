import { StepConfig } from "@/components/ui/bar";

export const getProgressBarSteps = (t: (key: string) => string): StepConfig[] => [
    {
        iconPath: "/icons/Home-04.svg",
        title: t("modals.addressModal.steps.info"),
    },
    {
        iconPath: "/icons/Flex-Align-Bottom.svg",
        title: t("modals.addressModal.steps.declare"),
    },
    {
        iconPath: "/icons/Shield-Alert-02.svg",
        title: t("modals.addressModal.steps.verify"),
    },
];
