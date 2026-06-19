import { CoinIcon } from "@/components/ui/CoinIcon";
import { HERO_GLASS_CARD_CLASS } from "@/components/home/HeroMetricCard";
import { useI18n } from "@/lib/i18n/I18nProvider";
import { cn } from "@/lib/utils";
import type { HeroPopularCardProps } from "@/types/home";

export function HeroPopularCard({ coins, variant = "desktop" }: HeroPopularCardProps) {
  const { t } = useI18n();
  const isMobile = variant === "mobile";

  return (
    <div
      className={cn(
        HERO_GLASS_CARD_CLASS,
        isMobile
          ? "relative ml-auto h-[290px] w-full max-w-[250px] min-w-0 justify-self-end rounded-[10px] px-3 py-4"
          : "absolute right-0 top-0 h-[440px] w-[253px] rounded-[18px] px-5 py-6 xl:h-[528px] xl:w-[304px] xl:rounded-[22px] xl:px-6 xl:py-7",
      )}
    >
      <div
        className={cn(
          "font-bold leading-none text-white",
          isMobile ? "text-[10px]" : "text-[14px] xl:text-[16px]",
        )}
      >
        {t("home.hero.popular")}
      </div>

      <div
        className={cn(
          "flex flex-col justify-between",
          isMobile
            ? "mt-5 h-[238px]"
            : "mt-[38px] h-[338px] xl:mt-[46px] xl:h-[424px]",
        )}
      >
        {coins.map((coin) => {
          const isNegative = coin.change.startsWith("-");

          return (
            <div
              key={coin.symbol}
              className={cn(
                "grid items-center",
                isMobile
                  ? "grid-cols-[22px_minmax(0,1fr)_auto] gap-2"
                  : "grid-cols-[34px_1fr_auto] gap-2.5 xl:grid-cols-[40px_1fr_auto] xl:gap-3",
              )}
            >
              <CoinIcon
                symbol={coin.symbol}
                size={isMobile ? 22 : 34}
                className={cn(!isMobile && "xl:h-10 xl:w-10")}
              />
              <div
                className={cn(
                  "font-medium leading-none text-white",
                  isMobile ? "text-[11px]" : "text-[14px] xl:text-[17px]",
                )}
              >
                {coin.symbol}
              </div>
              <div className="text-right">
                <div
                  className={cn(
                    "font-medium leading-none text-white",
                    isMobile ? "text-[9px]" : "text-[12px] xl:text-[15px]",
                  )}
                >
                  {coin.price}
                </div>
                <div
                  className={cn(
                    "font-bold leading-none",
                    isMobile
                      ? "mt-1.5 text-[9px]"
                      : "mt-3 text-[10px] xl:mt-4 xl:text-[12px]",
                    isNegative ? "text-[#FF3F68]" : "text-[#00F0A8]",
                  )}
                >
                  {coin.change}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
