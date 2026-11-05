import {
  IconDevices,
  IconChefHat,
  IconShirt,
  IconDeviceGamepad2,
  IconTool,
  IconHeart,
  IconBook,
  IconBallFootball,
  IconCar,
  IconPaw,
  IconBabyCarriage,
  IconSofa,
  IconMusic,
  IconGift,
  IconBriefcase,
  IconPlant,
  IconShoe,
  IconClock,
  IconCategory,
  IconHome, 
} from "@tabler/icons-react";

export const MAPA_ICONES: Record<
  string,
  React.ComponentType<{ className?: string; stroke?: string; strokeWidth?: number | string }>
> = {
  devices: IconDevices,
  "chef-hat": IconChefHat,
  shirt: IconShirt,
  gamepad: IconDeviceGamepad2,
  tool: IconTool,
  heart: IconHeart,
  book: IconBook,
  "ball-football": IconBallFootball,
  car: IconCar,
  paw: IconPaw,
  "baby-carriage": IconBabyCarriage,
  sofa: IconSofa,
  music: IconMusic,
  gift: IconGift,
  briefcase: IconBriefcase,
  plant: IconPlant,
  shoe: IconShoe,
  clock: IconClock,
  home: IconHome,
};

interface CategoryIconProps {
  icone: string | null;
  className?: string;
}

export function CategoryIcon({ icone, className = "h-6 w-6" }: CategoryIconProps) {
  if (icone === "lipstick") {
    return <BatomIcon className={className} />;
  }

  const Icone = icone ? MAPA_ICONES[icone] : IconCategory;
  
  return (
    <div className={`categoria-icon flex items-center justify-center ${className}`}>
      {/* ✅ strokeWidth alterado para 1 (traço mais fino) */}
      <Icone className="h-full w-full" stroke="url(#categoria-gradient)" strokeWidth={1} />
    </div>
  );
}

export function BatomIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M10 3 L10 2 C10 1.5 10.5 1 11 1 L13 1 C13.5 1 14 1.5 14 2 L14 3 L14 8 L10 8 Z"
        stroke="url(#categoria-gradient)"
        strokeWidth="1" // ✅ Traço mais fino
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="9.5"
        y="8"
        width="5"
        height="4"
        stroke="url(#categoria-gradient)"
        strokeWidth="1" // ✅ Traço mais fino
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="9"
        y="12"
        width="6"
        height="10"
        stroke="url(#categoria-gradient)"
        strokeWidth="1" // ✅ Traço mais fino
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <line
        x1="9"
        y1="15"
        x2="15"
        y2="15"
        stroke="url(#categoria-gradient)"
        strokeWidth="0.75" // ✅ Linha interna ainda mais fina
        strokeLinecap="round"
      />
    </svg>
  );
}