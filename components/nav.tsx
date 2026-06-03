"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "./icon";
import { NAV_LINKS } from "./site-data";

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  // Reset menu when the route changes — React-recommended "previous prop"
  // pattern, no effect needed.
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    if (open) setOpen(false);
  }

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <nav className="sticky top-0 w-full z-50 bg-background/85 backdrop-blur-xl">
        <div className="flex justify-between items-center px-6 md:px-10 py-5 md:py-6 max-w-screen-2xl mx-auto gap-4">
          <Link
            href="/"
            className="flex items-center gap-3 md:gap-4 leading-none flex-shrink-0"
            aria-label="Le Combat d'Alya — accueil"
          >
            <Image
              src="/logo.png"
              alt=""
              width={56}
              height={56}
              priority
              className="w-11 h-11 md:w-14 md:h-14 object-contain"
            />
            <span className="flex flex-col">
              <span className="font-serif italic text-xl md:text-[28px] text-primary tracking-tight">
                Le Combat d&apos;Alya
              </span>
              <span className="hidden md:block text-[10px] uppercase tracking-[0.3em] text-on-surface-variant mt-1">
                Association · Depuis 2019
              </span>
            </span>
          </Link>

          <div className="hidden xl:flex gap-7 2xl:gap-9 font-serif italic tracking-wide text-[15px]">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={
                  isActive(link.href)
                    ? "text-secondary font-semibold relative after:content-[''] after:absolute after:-bottom-1 after:left-0 after:w-full after:h-px after:bg-secondary"
                    : "text-on-surface hover:text-primary transition-colors"
                }
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/aider"
              className="group relative bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-5 md:px-7 py-2.5 md:py-3 rounded-full font-semibold text-xs md:text-sm tracking-wide transition-all hover:scale-[1.03] active:scale-95 shadow-[0_8px_24px_-6px_rgba(184,0,75,0.35)]"
            >
              <span className="flex items-center gap-2">
                <Icon name="favorite" filled className="text-[14px] md:text-[16px]" />
                <span className="hidden sm:inline">Faire un don</span>
                <span className="sm:hidden">Don</span>
              </span>
            </Link>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="xl:hidden w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors"
              aria-label="Ouvrir le menu"
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      <div
        className={`xl:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <div
          className="absolute inset-0 bg-primary/30 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-full sm:max-w-md h-full bg-background shadow-2xl flex flex-col transition-transform duration-300 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center px-6 py-6 border-b border-outline-variant/30">
            <span className="flex items-center gap-3">
              <Image
                src="/logo.png"
                alt=""
                width={44}
                height={44}
                className="w-10 h-10 object-contain"
              />
              <span className="font-serif italic text-xl text-primary">
                Le Combat d&apos;Alya
              </span>
            </span>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="w-11 h-11 rounded-full bg-surface-container-high text-primary flex items-center justify-center hover:bg-surface-container-highest transition-colors"
              aria-label="Fermer le menu"
            >
              <Icon name="close" />
            </button>
          </div>
          <ul className="flex-1 overflow-y-auto px-6 py-8 space-y-1">
            {NAV_LINKS.map((link, idx) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`flex items-center justify-between py-4 border-b border-outline-variant/20 font-serif italic text-2xl transition-colors ${
                    isActive(link.href)
                      ? "text-secondary"
                      : "text-primary hover:text-secondary"
                  }`}
                >
                  <span className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-[0.3em] text-on-surface-variant font-sans not-italic">
                      0{idx + 1}
                    </span>
                    {link.label}
                  </span>
                  <Icon name="arrow_forward" className="text-base" />
                </Link>
              </li>
            ))}
          </ul>
          <div className="px-6 py-6 border-t border-outline-variant/30 bg-surface-container-low">
            <Link
              href="/aider"
              className="w-full bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-[0_8px_24px_-6px_rgba(184,0,75,0.35)]"
            >
              <Icon name="favorite" filled className="text-base" />
              Faire un don
            </Link>
            <p className="text-center text-xs text-on-surface-variant mt-4 italic font-serif">
              Association reconnue d&apos;intérêt général · 66 % déductible
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
