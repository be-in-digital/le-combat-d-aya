import Link from "next/link";
import type { Metadata } from "next";
import { Icon } from "@/components/icon";
import { Nav } from "@/components/nav";
import { Footer } from "@/components/footer";
import { FadeUp, Float, RevealText } from "@/components/anim";

export const metadata: Metadata = {
  title: "Page introuvable · Le Combat d'Alya",
  description: "La page que vous cherchez n'existe pas ou a été déplacée.",
};

export default function NotFound() {
  return (
    <>
      <Nav />
      <main className="relative px-6 md:px-10 py-24 md:py-36 overflow-hidden min-h-[70vh] flex items-center">
        <Float
          duration={18}
          amplitude={30}
          className="absolute -top-20 -right-20 w-[500px] h-[500px] bg-primary-fixed-dim/25 blur-[120px] -z-10 rounded-full"
        />
        <Float
          duration={22}
          amplitude={40}
          delay={1.5}
          className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-secondary-fixed/30 blur-[140px] -z-10 rounded-full"
        />

        <div className="max-w-3xl mx-auto text-center">
          <FadeUp>
            <p className="text-xs uppercase tracking-[0.3em] text-secondary font-semibold mb-6 md:mb-8">
              Erreur 404 · Page introuvable
            </p>
          </FadeUp>

          <h1 className="font-serif text-primary leading-[0.92] text-7xl md:text-9xl lg:text-[160px] tracking-[-0.02em] mb-10 md:mb-12 pb-[0.08em]">
            <RevealText delay={0.1}>
              <span className="italic">Cette page</span>
            </RevealText>
            <RevealText delay={0.28}>
              s&apos;est <span className="italic text-secondary">égarée</span>.
            </RevealText>
          </h1>

          <FadeUp delay={0.6}>
            <p className="text-lg md:text-xl text-on-surface-variant leading-relaxed mb-12 md:mb-14 max-w-xl mx-auto font-serif italic">
              L&apos;adresse a peut-être changé, ou nous l&apos;avons mal
              écrite. Pendant que vous êtes ici, l&apos;essentiel reste à
              portée de main.
            </p>
          </FadeUp>

          <FadeUp delay={0.75}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/"
                className="bg-gradient-to-br from-secondary to-[#e01e62] text-on-secondary px-8 md:px-10 py-4 rounded-full font-bold text-base flex items-center justify-center gap-3 shadow-[0_12px_32px_-8px_rgba(184,0,75,0.4)] hover:scale-[1.03] transition-transform"
              >
                <Icon name="home" />
                Retour à l&apos;accueil
              </Link>
              <Link
                href="/aider"
                className="bg-transparent text-primary px-8 md:px-10 py-4 rounded-full font-semibold text-base border border-primary/20 hover:bg-surface-container-high transition-colors text-center inline-flex items-center justify-center gap-3"
              >
                <Icon name="favorite" filled className="text-base" />
                Faire un don
              </Link>
            </div>
          </FadeUp>

          <FadeUp delay={1}>
            <div className="mt-16 md:mt-20 pt-10 md:pt-12 border-t border-outline-variant/30 max-w-md mx-auto">
              <p className="text-xs uppercase tracking-[0.3em] text-on-surface-variant font-semibold mb-6">
                Vous cherchiez peut-être
              </p>
              <ul className="space-y-3 text-base font-serif italic text-primary">
                {[
                  { label: "Notre histoire", href: "/histoire" },
                  { label: "Nos missions", href: "/missions" },
                  { label: "Actualités", href: "/actualites" },
                  { label: "Nous contacter", href: "/contact" },
                ].map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="inline-flex items-center gap-2 hover:text-secondary transition-colors group"
                    >
                      {l.label}
                      <Icon
                        name="arrow_forward"
                        className="text-sm group-hover:translate-x-1 transition-transform"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </FadeUp>
        </div>
      </main>
      <Footer />
    </>
  );
}
