// Step 10 fleshes this out. Step 5 just gives it bones.

export function Hook() {
  return (
    <section className="container-prose py-24">
      <h1 className="text-balance">
        98% of compliance alerts are false positives. For Muslim and Arabic
        names, it&apos;s worse.
      </h1>
      <p className="mt-6 max-w-prose text-stone-600">
        Legacy compliance systems compare names. Entity resolution compares
        people. The difference is the difference between flagging every
        Muhammad in Toronto and flagging the one your bank actually owes a
        suspicious activity report on.
      </p>
      <a
        href="#demo"
        className="mt-8 inline-flex items-center gap-2 rounded-md border border-stone-900 bg-stone-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-stone-800"
      >
        See the demo
      </a>
    </section>
  );
}
