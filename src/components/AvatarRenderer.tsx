import { EquippedItems } from "@/store/useUserStore";

/** Original 2D layered cartoon avatar — body/outfit, face, accessory, then hat, back to front. */
export default function AvatarRenderer({
  equipped,
  size = 48,
}: {
  equipped: EquippedItems;
  size?: number;
}) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label="Your avatar">
      <OutfitLayer id={equipped.outfit} />
      <circle cx="50" cy="42" r="26" fill="#ffcf9e" />
      <circle cx="41" cy="40" r="3.5" fill="#2b2b2b" />
      <circle cx="59" cy="40" r="3.5" fill="#2b2b2b" />
      <path d="M40 50 Q50 58 60 50" stroke="#2b2b2b" strokeWidth="3" fill="none" strokeLinecap="round" />
      <AccessoryLayer id={equipped.accessory} />
      <HatLayer id={equipped.hat} />
    </svg>
  );
}

function OutfitLayer({ id }: { id: string }) {
  const colors: Record<string, string> = {
    "outfit-base": "#58cc02",
    "outfit-hoodie": "#1cb0f6",
    "outfit-robe": "#8b5cf6",
  };
  return <rect x="20" y="62" width="60" height="34" rx="18" fill={colors[id] ?? colors["outfit-base"]} />;
}

function AccessoryLayer({ id }: { id: string }) {
  if (id === "accessory-glasses") {
    return (
      <g stroke="#2b2b2b" strokeWidth="2.5" fill="none">
        <circle cx="41" cy="40" r="7" />
        <circle cx="59" cy="40" r="7" />
        <line x1="48" y1="40" x2="52" y2="40" />
      </g>
    );
  }
  if (id === "accessory-scarf") {
    return <path d="M28 60 Q50 72 72 60 L72 68 Q50 80 28 68 Z" fill="#ff4b4b" />;
  }
  if (id === "accessory-badge") {
    return <circle cx="66" cy="70" r="8" fill="#ffc800" stroke="#b8860b" strokeWidth="2" />;
  }
  return null;
}

function HatLayer({ id }: { id: string }) {
  if (id === "hat-cap") {
    return <path d="M24 24 Q50 4 76 24 L76 30 L24 30 Z" fill="#1cb0f6" />;
  }
  if (id === "hat-wizard") {
    return <path d="M50 -6 L74 26 L26 26 Z" fill="#8b5cf6" />;
  }
  if (id === "hat-crown") {
    return (
      <path
        d="M26 26 L34 10 L44 22 L50 8 L56 22 L66 10 L74 26 Z"
        fill="#ffc800"
        stroke="#b8860b"
        strokeWidth="1.5"
      />
    );
  }
  return null;
}
