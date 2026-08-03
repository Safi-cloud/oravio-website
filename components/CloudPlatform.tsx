const CARDS = [
  { label: "Verhuurbedrijf", x: "8%", y: "6%", delay: "0s" },
  { label: "Webshop", x: "62%", y: "0%", delay: "1.4s" },
  { label: "Evenementen", x: "68%", y: "58%", delay: "0.7s" },
  { label: "Retailketen", x: "2%", y: "60%", delay: "2.1s" },
];

export default function CloudPlatform() {
  return (
    <div className="relative mx-auto aspect-[4/3] w-full max-w-xl">
      <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-b from-[#eaf4fc] to-[#f8fbfe]" />

      <div className="absolute bottom-[14%] left-1/2 h-40 w-72 -translate-x-1/2 rounded-full bg-white opacity-90 blur-2xl" />
      <div className="absolute bottom-[10%] left-[38%] h-24 w-40 -translate-x-1/2 rounded-full bg-white opacity-80 blur-xl" />
      <div className="absolute bottom-[10%] right-[30%] h-24 w-44 translate-x-1/2 rounded-full bg-white opacity-80 blur-xl" />

      <div
        className="bg-gradient-brand absolute left-1/2 top-1/2 flex h-24 w-24 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full"
        style={{ boxShadow: "0 20px 45px -12px rgba(29,110,125,0.35)" }}
      >
        <span className="font-display text-sm font-semibold tracking-tight text-white">ORAVIO</span>
      </div>

      {CARDS.map((card) => (
        <div
          key={card.label}
          className="float-node absolute rounded-2xl border border-[var(--line)] bg-white/90 px-4 py-3 backdrop-blur-sm"
          style={{ left: card.x, top: card.y, animationDelay: card.delay, boxShadow: "0 18px 30px -14px rgba(28,74,120,0.25)" }}
        >
          <span className="font-mono-label whitespace-nowrap text-[11px] tracking-wide text-[var(--navy)]">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}
