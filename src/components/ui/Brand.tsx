import Link from "next/link";

type BrandProps = {
  href?: string;
  className?: string;
};

export default function Brand({ href = "/", className }: BrandProps) {
  return (
    <Link href={href} className={className} aria-label="Resumator home">
      <svg
        width="38"
        height="38"
        viewBox="0 0 48 48"
        aria-hidden="true"
        focusable="false"
      >
        <rect
          x="12"
          y="18"
          width="24"
          height="24"
          rx="7"
          transform="rotate(-35 24 30)"
          fill="#B9A8FF"
        />
        <rect
          x="8"
          y="12"
          width="24"
          height="24"
          rx="7"
          transform="rotate(-35 20 24)"
          fill="#78BFFF"
        />
        <rect
          x="12"
          y="5"
          width="24"
          height="24"
          rx="7"
          transform="rotate(-35 24 17)"
          fill="#248BFA"
        />
      </svg>

      <span>Resumator</span>
    </Link>
  );
}
