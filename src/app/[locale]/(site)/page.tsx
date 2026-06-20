import type { Metadata } from "next";
import { Suspense } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { withLocale } from "@/lib/i18n/href";
import { HeroSection } from "@/components/home/Hero";
import { ThreeStepExperience } from "@/components/home/ThreeStepExperience";
import { TestimonialsSection } from "@/components/home/Testimonials";
import { FAQSection } from "@/components/home/FAQSection";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import { AnimatedSection } from "@/components/layout/AnimatedSection";
import { resolveLocale, getHomeMetadata, getHomeStructuredData } from "@/lib/seo/homepage";

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const resolved = await params;
    const locale = resolveLocale(resolved.locale);
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("access_token")?.value;

    if (accessToken) {
        redirect(withLocale("/dashboard", locale));
    }

    return (
        <Suspense fallback={<HomeSkeleton />}>
            <HomeContent locale={locale} />
        </Suspense>
    );
}

async function HomeContent({ locale }: { locale: ReturnType<typeof resolveLocale> }) {
    const structuredData = await getHomeStructuredData(locale);

    return (
        <div className="space-y-7  pb-7">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify(structuredData),
                }}
            />
            <AnimatedSection id="experience">
                <HeroSection />
            </AnimatedSection>
            <AnimatedSection id="experience-steps">
                <ThreeStepExperience />
            </AnimatedSection>
            <AnimatedSection id="testimonials">
                <TestimonialsSection />
            </AnimatedSection>
            <AnimatedSection id="faq">
                <FAQSection />
            </AnimatedSection>
        </div>
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const resolved = await params;
    const locale = resolveLocale(resolved.locale);

    return getHomeMetadata(locale);
}
