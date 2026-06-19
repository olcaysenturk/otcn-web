"use client";

import type { ComponentProps } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

const ICON_PATHS = {
  globe: "/globe.svg",
  file: "/file.svg",
  window: "/window.svg",
  arrow: "/assets/icons/Arrow.svg",
} as const;

export type SvgIconName = keyof typeof ICON_PATHS;

type BaseImageProps = Omit<
  ComponentProps<typeof Image>,
  "src" | "alt" | "fill" | "loader" | "quality" | "placeholder"
>;

type SvgIconProps = BaseImageProps & {
  /** Harita içindeki isim ya da manuel src geçebilirsin */
  name?: SvgIconName;
  /** Kendi src'ni geçmek istersen */
  src?: string;
  /** px cinsinden boyut (width/height sağlanmazsa kullanılır) */
  size?: number;
  /** Dekoratif kullanımda true yaparsan alt boş ve aria-hidden olur */
  decorative?: boolean;
  /** Alt yazısı; dekoratif değilse zorunlu. Boş geçersen name kullanılır */
  alt?: string;
};

export function SvgIcon({
  name,
  src,
  size = 16,
  className,
  decorative = false,
  alt,
  width,
  height,
  ...rest
}: SvgIconProps) {
  const resolvedSrc = src ?? (name ? ICON_PATHS[name] : undefined);
  if (!resolvedSrc) return null;

  const ariaHidden = decorative || !alt;
  const finalAlt = ariaHidden ? "" : alt ?? name ?? "icon";

  return (
    <Image
      src={resolvedSrc}
      alt={finalAlt}
      aria-hidden={ariaHidden}
      width={width ?? size}
      height={height ?? size}
      className={cn("inline-block select-none align-middle", className)}
      loading="lazy"
      {...rest}
    />
  );
}
