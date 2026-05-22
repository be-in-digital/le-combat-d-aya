import Link from "next/link";
import { Icon } from "./icon";
import { NAV_LINKS } from "./site-data";

export function Footer() {
  return (
    <footer className="bg-primary text-on-primary w-full pt-16 md:pt-20 pb-10">
      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 md:gap-12 mb-12 md:mb-16">
        <div className="md:col-span-2 lg:col-span-5">
          <div className="font-serif italic text-3xl md:text-4xl mb-6">
            Le Combat d&apos;Alya
          </div>
          <p className="text-on-primary/80 text-sm mb-8 max-w-sm leading-relaxed">
            S&apos;engager pour demain, aujourd&apos;hui. Une association
            dédiée à la recherche et au soutien des familles touchées par la
            maladie.
          </p>
          <div className="flex gap-3">
            {[
              { icon: "public", label: "Site web" },
              { icon: "mail", label: "Email" },
              { icon: "share", label: "Partager" },
            ].map(({ icon, label }) => (
              <a
                key={icon}
                href="#"
                className="w-11 h-11 rounded-full border border-on-primary/20 flex items-center justify-center hover:bg-on-primary hover:text-primary transition-all"
                aria-label={label}
              >
                <Icon name={icon} className="text-lg" />
              </a>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          <h5 className="uppercase tracking-[0.25em] text-[10px] font-bold text-on-primary/70 mb-6">
            Navigation
          </h5>
          <ul className="space-y-4 text-sm font-serif italic">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="hover:text-primary-fixed-dim transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="lg:col-span-2">
          <h5 className="uppercase tracking-[0.25em] text-[10px] font-bold text-on-primary/70 mb-6">
            Légal
          </h5>
          <ul className="space-y-4 text-sm font-serif italic">
            {[
              { label: "Mentions légales", href: "/mentions-legales" },
              { label: "Confidentialité", href: "/confidentialite" },
              { label: "CGU", href: "/cgu" },
              { label: "Presse", href: "/contact" },
              { label: "Partenariats", href: "/contact" },
            ].map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href}
                  className="hover:text-primary-fixed-dim transition-colors"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-2 lg:col-span-3">
          <h5 className="uppercase tracking-[0.25em] text-[10px] font-bold text-on-primary/70 mb-6">
            Contact
          </h5>
          <address className="not-italic text-sm space-y-3 text-on-primary/80">
            <p className="font-serif italic">
              Association Le Combat d&apos;Alya
            </p>
            <p>15 rue de la Solidarité</p>
            <p>75011 Paris, France</p>
            <p className="pt-3">
              <a
                href="mailto:contact@lecombatdalya.fr"
                className="hover:text-primary-fixed-dim transition-colors underline underline-offset-4 decoration-on-primary/30 break-words"
              >
                contact@lecombatdalya.fr
              </a>
            </p>
          </address>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-6 md:px-10 pt-8 border-t border-on-primary/15 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 text-center">
        <div className="uppercase tracking-[0.25em] text-[10px] text-on-primary/60 md:text-left">
          © 2026 Le Combat d&apos;Alya · L&apos;élégance au service de
          l&apos;engagement
        </div>
        <div className="flex flex-wrap justify-center items-center gap-x-6 md:gap-x-8 gap-y-3">
          <Link
            href="/aider"
            className="uppercase tracking-[0.25em] text-[10px] text-on-primary/60 hover:text-on-primary"
          >
            Faire un don
          </Link>
          <Link
            href="/contact"
            className="uppercase tracking-[0.25em] text-[10px] text-on-primary/60 hover:text-on-primary"
          >
            Nous contacter
          </Link>
          <span aria-hidden className="hidden md:inline-block w-px h-3 bg-on-primary/20" />
          <a
            href="https://beindigital.fr"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 uppercase tracking-[0.25em] text-[10px] text-on-primary/50 hover:text-on-primary transition-colors group"
          >
            <span>Powered by</span>
            <Icon
              name="favorite"
              filled
              className="text-[12px] text-secondary-fixed group-hover:scale-110 transition-transform"
            />
            <span className="font-semibold tracking-[0.2em] text-secondary-fixed group-hover:text-white transition-colors">Be In Digital</span>
          </a>
        </div>
      </div>
    </footer>
  );
}
