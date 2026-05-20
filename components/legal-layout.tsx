import { ReactNode } from "react";

export function LegalLayout({ children }: { children: ReactNode }) {
  return (
    <section className="px-6 md:px-10 pb-24 md:pb-32">
      <div className="max-w-3xl mx-auto">
        <div
          className="prose-legal space-y-10 text-on-surface-variant"
          style={{ fontSize: "16px", lineHeight: 1.75 }}
        >
          {children}
        </div>
      </div>
    </section>
  );
}

export function LegalSection({
  title,
  children,
  id,
}: {
  title: string;
  children: ReactNode;
  id?: string;
}) {
  return (
    <section id={id} className="scroll-mt-32 space-y-4">
      <h2 className="font-serif text-primary text-2xl md:text-3xl leading-tight pt-2">
        {title}
      </h2>
      <div className="space-y-4 text-base leading-relaxed">{children}</div>
    </section>
  );
}

export function LegalDl({
  entries,
}: {
  entries: Array<{ term: string; value: ReactNode }>;
}) {
  return (
    <dl className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-x-6 gap-y-3 bg-surface-container-low rounded-2xl p-6 md:p-8">
      {entries.map((e) => (
        <div key={e.term} className="contents">
          <dt className="text-xs uppercase tracking-[0.25em] text-on-surface-variant font-semibold pt-1">
            {e.term}
          </dt>
          <dd className="text-on-surface font-serif italic">{e.value}</dd>
        </div>
      ))}
    </dl>
  );
}
