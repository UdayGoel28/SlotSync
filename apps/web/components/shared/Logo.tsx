export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="inline-block"
    >
      <rect width="32" height="32" rx="8" fill="url(#gradient)" />
      <path
        d="M10 12h12M10 16h8M10 20h10"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <circle cx="24" cy="20" r="3" fill="white" opacity="0.8" />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#4C6EF5" />
          <stop offset="1" stopColor="#748FFC" />
        </linearGradient>
      </defs>
    </svg>
  );
}
