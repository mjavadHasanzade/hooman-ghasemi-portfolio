export function WebflowLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M8 20L20 44L23 27L32 44L44 20"
        stroke="#4353FF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M44 20C44 20 40 34 32 34C28 34 27 27 27 27"
        stroke="#4353FF"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function GsapLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 80 32" fill="none" className={className}>
      <text
        x="50%"
        y="70%"
        textAnchor="middle"
        fontFamily="Arial, sans-serif"
        fontWeight="800"
        fontStyle="italic"
        fontSize="26"
        fill="#88CE02"
      >
        GSAP
      </text>
    </svg>
  );
}

export function FigmaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 64" fill="none" className={className}>
      <path
        d="M14 0H26C33.7 0 40 6.3 40 14C40 21.7 33.7 28 26 28H14V0Z"
        fill="#F24E1E"
      />
      <path
        d="M0 28C0 20.3 6.3 14 14 14H26V28H14C6.3 28 0 34.3 0 42V28Z"
        fill="#FF7262"
        opacity="0.001"
      />
      <path
        d="M0 28C0 20.3 6.3 14 14 14H26V42H14C6.3 42 0 35.7 0 28Z"
        fill="#A259FF"
      />
      <path
        d="M0 56C0 48.3 6.3 42 14 42H26V56C26 60.4 22.4 64 18 64H14C6.3 64 0 63.7 0 56Z"
        fill="#0ACF83"
      />
      <path
        d="M26 14H14C6.3 14 0 7.7 0 0V0C0 -0.001 6.3 0 14 0H26V14Z"
        fill="#FF7262"
      />
      <circle cx="33" cy="28" r="7" fill="#1ABCFE" />
    </svg>
  );
}

export function FramerLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 64" fill="none" className={className}>
      <path
        d="M0 0H40V21.3H20L40 42.6H20V64L0 42.6V21.3H20L0 0Z"
        fill="#8B5CF6"
      />
    </svg>
  );
}

export function CodeLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className}>
      <path
        d="M22 16L8 32L22 48"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M42 16L56 32L42 48"
        stroke="currentColor"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M36 12L28 52"
        stroke="currentColor"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
