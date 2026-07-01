import type { Locale } from "./config";
import { DEFAULT_LOCALE } from "./config";

type MessageLoader = () => Promise<Record<string, unknown>>;

const loaders: Record<Locale, Record<string, MessageLoader>> = {
  en: {
    common: () => import("./messages/en/common.json").then((mod) => mod.default),
    auth: () => import("./messages/en/auth.json").then((mod) => mod.default),
  },
  pt: {
    common: () => import("./messages/pt/common.json").then((mod) => mod.default),
    auth: () => import("./messages/pt/auth.json").then((mod) => mod.default),
  },
  es: {
    common: () => import("./messages/es/common.json").then((mod) => mod.default),
    auth: () => import("./messages/es/auth.json").then((mod) => mod.default),
  },
  ru: {
    common: () => import("./messages/ru/common.json").then((mod) => mod.default),
    auth: () => import("./messages/ru/auth.json").then((mod) => mod.default),
  },
};

export async function getMessages(
  locale: Locale,
  namespaces: string[] = ["common"],
) {
  const localeLoaders = loaders[locale] ?? loaders[DEFAULT_LOCALE];
  const fallbackLoaders =
    locale === DEFAULT_LOCALE ? localeLoaders : loaders[DEFAULT_LOCALE];

  const loaded = await Promise.all(
    namespaces.map(async (ns) => {
      const loader = localeLoaders[ns] ?? fallbackLoaders[ns];
      if (!loader) return {};
      try {
        return await loader();
      } catch {
        return {};
      }
    }),
  );

  return loaded.reduce<Record<string, unknown>>(
    (acc, item) => Object.assign(acc, item),
    {},
  );
}
