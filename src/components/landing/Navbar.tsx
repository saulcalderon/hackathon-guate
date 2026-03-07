"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import clsx from "clsx";
import LanguageSwitcher from "./LanguageSwitcher";
import { twMerge } from "tailwind-merge";
import { useTranslations } from "next-intl";

export function cn(...inputs: (string | undefined | null | false)[]) {
  return twMerge(clsx(inputs));
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const t = useTranslations("Navbar");

  useEffect(() => {
    const handleScroll = () => {
      // Trigger the pill effect when scrolling down past 50px
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    // Set initial state
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed top-0 left-0 right-0 z-50 flex justify-center transition-all duration-500 ease-in-out",
        scrolled ? "pt-4 px-4" : "pt-0 px-0"
      )}
    >
      <nav
        className={cn(
          "relative flex items-center justify-between w-full transition-all duration-500 ease-in-out border border-transparent",
          scrolled
            ? "max-w-5xl bg-black/80 backdrop-blur-md rounded-full px-6 py-3 shadow-2xl border-white/10"
            : "max-w-7xl bg-transparent px-6 py-6 md:px-12"
        )}
      >
        {/* Left: Logo */}
        <div className="flex items-center gap-2 z-10">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <Image 
                src="/logo/Finrai.svg" 
                alt="Finrai Logo" 
                width={36} 
                height={36} 
                className={cn(
                  "w-full h-full object-contain transition-all duration-500",
                  scrolled && "brightness-0 invert"
                )} 
              />
            </div>
            {/* Hide the brand name when scrolled to save space in the pill */}
            <span
              className={cn(
                "font-bold text-xl tracking-tight transition-all duration-500 overflow-hidden whitespace-nowrap",
                scrolled ? "max-w-0 opacity-0 ml-0" : "max-w-[100px] opacity-100 text-slate-900 ml-1"
              )}
            >
              Findr.ai
            </span>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8 absolute left-1/2 -translate-x-1/2">
          {["product", "useCases", "pricing", "resources"].map((item) => (
            <Link
              key={item}
              href={`#${item.toLowerCase().replace(" ", "-")}`}
              className={cn(
                "text-sm font-semibold transition-colors hover:-translate-y-0.5 transform duration-200",
                scrolled
                  ? "text-slate-200 hover:text-white"
                  : "text-slate-600 hover:text-findrai-primary"
              )}
            >
              {t(item as any)}
            </Link>
          ))}
        </div>

        {/* Right: Auth / CTA Buttons & Language */}
        <div className="flex items-center gap-3 lg:gap-4 z-10">
          <LanguageSwitcher scrolled={scrolled} />
          <Link
            href="/login"
            className={cn(
              "px-5 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm hover:shadow-md hover:-translate-y-0.5 whitespace-nowrap",
              scrolled
                ? "bg-white text-black hover:bg-slate-100"
                : "bg-slate-900 text-white hover:bg-slate-800"
            )}
          >
            {t("login")}
          </Link>
        </div>
      </nav>
    </div>
  );
}
