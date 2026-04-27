export function Hook() {
  return (
    <section className="container-prose flex min-h-[80vh] flex-col justify-center py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        An interactive teaching demo
      </p>
      <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.1] sm:text-6xl">
        98% of compliance alerts are false positives.
        <span className="text-flag"> For Muslim and Arabic names, it&apos;s worse.</span>
      </h1>
      <p className="mt-8 max-w-prose text-lg leading-relaxed text-stone-700">
        Legacy compliance systems compare names. Entity resolution compares
        people. The difference is the gap between flagging every Muhammad in
        Toronto and flagging the one your bank actually owes a suspicious
        activity report on.
      </p>
      <p className="mt-4 max-w-prose text-stone-600">
        This page walks through six small scenarios. The same input goes to
        both systems. Each scenario shows what a name-only matcher decides,
        what an entity-resolution model decides, and the math behind the
        second answer.
      </p>
      <div className="mt-10">
        <a
          href="#demo"
          className="inline-flex items-center gap-2 rounded-md border border-stone-900 bg-stone-900 px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-stone-800"
        >
          See the demo
          <span aria-hidden>↓</span>
        </a>
      </div>
    </section>
  );
}
