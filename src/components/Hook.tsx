export function Hook() {
  return (
    <section className="container-prose flex min-h-[80vh] flex-col justify-center py-24">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
        An interactive teaching demo
      </p>
      <h1 className="mt-4 text-balance text-5xl font-semibold leading-[1.1] sm:text-6xl">
        <span className="text-flag">Banking While Muslim Is A Nightmare.</span>{' '}
        Muslim and Arabic names get flagged, screened, and debanked at rates
        far higher than others.
      </h1>
      <p className="mt-8 max-w-prose text-lg leading-relaxed text-stone-700">
        But is that simple prejudice, or a structural problem with compliance
        screening? Legacy compliance systems compare names. Entity resolution
        compares people. The difference is between flagging every Ahmad Khan
        in Toronto and flagging the entity OFAC actually has on its list.
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
