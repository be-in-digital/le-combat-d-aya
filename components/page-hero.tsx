import { Icon } from "./icon";
import { FadeIn, FadeUp, Float, RevealText } from "./anim";

type Breadcrumb = { label: string; href?: string };

type PageHeroProps = {
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  meta?: React.ReactNode;
};

export function PageHero({
  eyebrow,
  title,
  intro,
  breadcrumbs,
  meta,
}: PageHeroProps) {
  return (
    <section className="relative px-6 md:px-10 pt-16 pb-16 md:pt-24 md:pb-20 overflow-hidden">
      <Float
        duration={18}
        amplitude={30}
        className="absolute -top-20 -right-32 w-[500px] h-[500px] bg-primary-fixed-dim/20 blur-[140px] -z-10 rounded-full"
      />
      <Float
        duration={22}
        amplitude={40}
        delay={1.5}
        className="absolute -bottom-32 -left-32 w-[600px] h-[600px] bg-secondary-fixed/20 blur-[160px] -z-10 rounded-full"
      />

      <div className="max-w-screen-2xl mx-auto">
        {breadcrumbs && (
          <FadeIn>
            <nav
              aria-label="Fil d'Ariane"
              className="flex items-center gap-2 text-xs text-on-surface-variant mb-8 uppercase tracking-[0.2em]"
            >
              {breadcrumbs.map((crumb, idx) => (
                <span key={idx} className="flex items-center gap-2">
                  {idx > 0 && (
                    <Icon
                      name="chevron_right"
                      className="text-[14px] opacity-50"
                    />
                  )}
                  {crumb.href ? (
                    <a
                      href={crumb.href}
                      className="hover:text-secondary transition-colors"
                    >
                      {crumb.label}
                    </a>
                  ) : (
                    <span className="text-primary font-semibold">
                      {crumb.label}
                    </span>
                  )}
                </span>
              ))}
            </nav>
          </FadeIn>
        )}

        <FadeIn className="flex items-center gap-6 mb-10 md:mb-14">
          <span className="text-secondary font-semibold tracking-[0.3em] uppercase text-[11px]">
            {eyebrow}
          </span>
          <div className="flex-1 h-px bg-outline-variant/40" />
          {meta && (
            <span className="hidden md:inline-block text-on-surface-variant font-serif italic text-sm">
              {meta}
            </span>
          )}
        </FadeIn>

        <h1 className="font-serif text-primary leading-[0.95] text-5xl md:text-7xl lg:text-8xl tracking-[-0.02em] max-w-5xl pb-[0.08em]">
          <RevealText delay={0.15} eager>
            {title}
          </RevealText>
        </h1>

        {intro && (
          <FadeUp delay={0.55}>
            <div className="mt-10 md:mt-12 max-w-2xl text-lg md:text-xl text-on-surface-variant leading-relaxed font-light">
              {intro}
            </div>
          </FadeUp>
        )}
      </div>
    </section>
  );
}
