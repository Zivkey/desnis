import Image from "next/image";
import { assets } from "@/lib/assets";

export function OutliersLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`relative inline-block h-6 w-[118px] ${className}`}>
      <span className="absolute left-0 top-0 flex h-6 w-[21px] items-center justify-center">
        <Image src={assets.outliersIconB} alt="" width={12} height={21} className="-rotate-[31deg]" />
      </span>
      <Image src={assets.outliersIconA} alt="" width={15} height={14} className="absolute left-[3px] top-[5px]" />
      <Image src={assets.outliersWordmark} alt="The Outliers" width={99} height={14} className="absolute left-[19px] top-[5px]" />
    </span>
  );
}

export function CompassLogo({ className = "" }: { className?: string }) {
  return (
    <Image
      src={assets.compassLogo}
      alt="Compass Energy Solutions"
      width={158}
      height={24}
      className={className}
    />
  );
}

/** White-masked Hessen Kräuter wordmark (matches the Figma mask treatment). */
export function HessenLogo({ className = "" }: { className?: string }) {
  return (
    <span
      role="img"
      aria-label="Hessen Kräuter"
      className={`block h-[46px] w-[85px] bg-white ${className}`}
      style={{
        WebkitMaskImage: `url(${assets.hessenLogo})`,
        maskImage: `url(${assets.hessenLogo})`,
        WebkitMaskSize: "contain",
        maskSize: "contain",
        WebkitMaskRepeat: "no-repeat",
        maskRepeat: "no-repeat",
        WebkitMaskPosition: "center",
        maskPosition: "center",
      }}
    />
  );
}

export function AltaNapaLogo({ className = "" }: { className?: string }) {
  return (
    <span className={`flex flex-col items-center text-white ${className}`}>
      <Image src={assets.altaBird} alt="" width={22} height={34} />
      <span className="mt-1 font-serif text-[17px] uppercase leading-none tracking-wide">
        Alta Napa
      </span>
      <span className="mt-1 text-[5px] uppercase leading-none tracking-[0.18em] text-white/90">
        Premium Wine
      </span>
    </span>
  );
}
