import Image from "next/image";

import { cn } from "@/lib/utils";

const COIN_ICON_PATHS: Record<string, string> = {
  APT: "/assets/coin-logo/APT.svg",
  ATR: "/assets/coin-logo/ATR.svg",
  BNB: "/assets/coin-logo/BNB.svg",
  BTC: "/assets/coin-logo/BTC.svg",
  DASH: "/assets/coin-logo/DASH.svg",
  DOGE: "/assets/coin-logo/DOGE.svg",
  DYM: "/assets/coin-logo/DYM.svg",
  ENA: "/assets/coin-logo/ENA.svg",
  ETC: "/assets/coin-logo/ETC.svg",
  ETH: "/assets/coin-logo/ETH.svg",
  JTO: "/assets/coin-logo/JTO.svg",
  LINK: "/assets/coin-logo/LINK.svg",
  MATIC: "/assets/coin-logo/MATIC.svg",
  MNT: "/assets/coin-logo/MNT.svg",
  ONDO: "/assets/coin-logo/ONDO.svg",
  POL: "/assets/coin-logo/POL.svg",
  RNDR: "/assets/coin-logo/RNDR.svg",
  SEI: "/assets/coin-logo/SEI.svg",
  SOL: "/assets/coin-logo/SOL.svg",
  STARKNET: "/assets/coin-logo/STRK.svg",
  STRK: "/assets/coin-logo/STRK.svg",
  STX: "/assets/coin-logo/STX.svg",
  SUI: "/assets/coin-logo/SUI.svg",
  TIA: "/assets/coin-logo/TIA.svg",
  TRX: "/assets/coin-logo/TRX.svg",
  TRY: "/assets/coin-logo/TRY.svg",
  USDT: "/assets/coin-logo/USDT.svg",
  VDA: "/assets/coin-logo/VDA.svg",
  W: "/assets/coin-logo/W.svg",
  XRP: "/assets/coin-logo/XRP.svg",
};

type CoinIconProps = {
  symbol: string;
  size?: number;
  className?: string;
};

export function CoinIcon({ symbol, size = 40, className }: CoinIconProps) {
  const normalizedSymbol = symbol.toUpperCase();
  const src = COIN_ICON_PATHS[normalizedSymbol];

  if (!src) {
    return (
      <span
        className={cn(
          "inline-flex shrink-0 items-center justify-center rounded-full bg-[#111515] text-[10px] font-black text-white",
          className,
        )}
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {normalizedSymbol.slice(0, 2)}
      </span>
    );
  }

  return (
    <Image
      src={src}
      alt={`${normalizedSymbol} logo`}
      width={size}
      height={size}
      className={cn("shrink-0 rounded-full object-contain", className)}
    />
  );
}
