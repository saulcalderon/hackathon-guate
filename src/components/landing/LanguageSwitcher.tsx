"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/routing";
import { useTransition } from "react";
import { cn } from "./Navbar";

export default function LanguageSwitcher({ scrolled }: { scrolled: boolean }) {
  const [isPending, startTransition] = useTransition();
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLanguageChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
  };

  return (
    <div
      className={cn(
        "flex items-center gap-1 p-1 rounded-full border transition-colors",
        scrolled
          ? "bg-white/10 border-white/10 backdrop-blur-md"
          : "bg-slate-100 border-slate-200"
      )}
    >
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleLanguageChange("en")}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-full transition-all",
          locale === "en"
            ? scrolled
              ? "bg-white text-black shadow-sm"
              : "bg-white text-slate-900 shadow-sm"
            : scrolled
              ? "text-slate-300 hover:text-white"
              : "text-slate-500 hover:text-slate-800"
        )}
      >
        EN
      </button>
      <button
        type="button"
        disabled={isPending}
        onClick={() => handleLanguageChange("es")}
        className={cn(
          "px-2.5 py-1 text-xs font-bold rounded-full transition-all",
          locale === "es"
            ? scrolled
              ? "bg-white text-black shadow-sm"
              : "bg-white text-slate-900 shadow-sm"
            : scrolled
              ? "text-slate-300 hover:text-white"
              : "text-slate-500 hover:text-slate-800"
        )}
      >
        ES
      </button>
    </div>
  );
}
