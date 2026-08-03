import Link from "next/link";

export default function NotFound() {
  return (
    <section className="flex min-h-[60vh] flex-col items-center justify-center px-6 py-24 text-center">
      <p className="font-mono-label text-xs uppercase tracking-[0.2em] text-[var(--teal)]">404</p>
      <h1 className="font-display mt-4 text-3xl font-semibold tracking-tight text-[var(--ink)] md:text-4xl">
        Deze pagina bestaat niet
      </h1>
      <p className="mt-4 max-w-md text-sm leading-relaxed text-[var(--slate)] md:text-base">
        De pagina die je zoekt is verplaatst of bestaat niet (meer).
      </p>
      <Link
        href="/"
        className="bg-gradient-brand mt-8 rounded-full px-7 py-3.5 text-sm font-semibold text-white shadow-md transition-transform hover:scale-[1.02]"
      >
        Terug naar de homepage
      </Link>
    </section>
  );
}
