export default function OravioMark({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="oravioMarkGradient" x1="0" y1="0" x2="24" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#1D6E7D" />
          <stop offset="1" stopColor="#2F9E6E" />
        </linearGradient>
      </defs>
      <path
        d="M18.178 8c5.096 0 5.096 8 0 8c-5.095 0-7.617-8-12.714-8c-5.096 0-5.096 8 0 8c5.097 0 7.618-8 12.714-8z"
        stroke="url(#oravioMarkGradient)"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}
