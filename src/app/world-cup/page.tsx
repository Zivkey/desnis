import type { Metadata } from "next";
import Image from "next/image";
import { assets } from "@/lib/assets";
import { PRIME_SCALE_SCRIPT, WorldCupStage } from "@/components/WorldCupStage";
import { WorldCupCountdown } from "@/components/WorldCupCountdown";
import { AlphaHoverScale } from "@/components/AlphaHoverScale";
import { WorldCupSpainPlayer } from "@/components/WorldCupSpainPlayer";
import { WorldCupArgentinaPlayer } from "@/components/WorldCupArgentinaPlayer";
import { WorldCupVoteBar } from "@/components/WorldCupVoteBar";
import { WorldCupPhoto } from "@/components/WorldCupPhoto";
import { WorldCupPaper } from "@/components/WorldCupPaper";
import { WorldCupFanFavorite } from "@/components/WorldCupFanFavorite";

export const metadata: Metadata = {
  title: "The Countdown is on! — DES/NIS",
  description:
    "2026 WC Edition. Beat up the player you don\u2019t want taking home the trophy!",
  // Self-canonical: without this the page inherits the root layout's
  // canonical ("/"), which tells Google it's a duplicate of the homepage.
  // (This page is deliberately kept out of sitemap.ts.)
  alternates: { canonical: "/world-cup" },
};

export default function WorldCupPage() {
  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: PRIME_SCALE_SCRIPT }} />

      {/* The poster is a fixed 1440x900 design with no responsive layout — it
          only reads when cover-scaled onto a wide viewport. Below a laptop it
          crops to nonsense, so it's gated to lg+ and phones/tablets get the
          fallback below instead. */}
      <div className="hidden lg:block">
      <WorldCupStage>
        {/* Stadium backdrop — bleeds past the frame on every side. */}
        <div className="absolute left-1/2 top-[calc(50%+6px)] h-[912px] w-[1634px] -translate-x-1/2 -translate-y-1/2">
          <Image
            src={assets.worldCup.stadiumBg}
            alt=""
            fill
            unoptimized
            priority
            sizes="1634px"
            className="pointer-events-none max-w-none object-cover"
          />
        </div>

        {/* Spain player — picks up bandages at half health. */}
        <WorldCupSpainPlayer />

        {/* Argentina player — bandages at half health, drained once beaten. */}
        <WorldCupArgentinaPlayer />

        {/* Ball — cropped out of the original three-object artwork. */}
        <AlphaHoverScale
          hoverScale={0.714}
          opensMatchPaper
          className="absolute left-1/2 top-[calc(50%-79.5px)] h-[127px] w-[128px] -translate-x-1/2 -translate-y-1/2 scale-[0.68] rounded-[10000px] shadow-[0px_8px_64px_0px_rgba(0,0,0,0.65)] transition-[scale,opacity] duration-300 ease-out motion-reduce:transition-none group-data-[photo-expanded]:pointer-events-none group-data-[photo-expanded]:opacity-0"
        >
          <div className="absolute inset-0 overflow-hidden rounded-[10000px]">
            <Image
              src={assets.worldCup.ballSource}
              alt=""
              width={4000}
              height={2233}
              unoptimized
              priority
              className="absolute left-[-500.97%] top-[-232.28%] h-[669.29%] w-[1190.33%] max-w-none"
            />
          </div>
        </AlphaHoverScale>

        <div className="absolute left-1/2 top-[161px] flex w-[532px] -translate-x-1/2 flex-col items-center gap-[12px]">
          {/* text-[0px]/leading-[0] stop the whitespace between spans from
              adding its own line box — each span carries its own size.
              nowrap keeps it on one line as designed; it runs a few px past the
              532px column, which is why the column centres rather than clips. */}
          <h1 className="min-w-full whitespace-nowrap text-center text-[0px] leading-[0] tracking-[-1.56px] text-black">
            <span className="text-[52px] font-normal leading-[52px]">The</span>
            <span className="text-[52px] leading-[52px]"> </span>
            <span className="font-serif text-[58px] not-italic leading-[52px]">
              Countdown
            </span>
            <span className="font-serif text-[52px] not-italic leading-[52px]">
              {" "}
            </span>
            <span className="text-[52px] font-normal leading-[52px]">
              is on!
            </span>
          </h1>
          <p className="whitespace-nowrap text-center text-[18px] font-normal leading-[24px] text-black/75">
            Beat up the player you don&rsquo;t want taking home the trophy!
          </p>
        </div>

        {/* Badge for whoever wins the scrap. */}
        <WorldCupFanFavorite />

        {/* Photo — click morphs it into the expanded frame (Figma 2224:154). */}
        <WorldCupPhoto />

      </WorldCupStage>

      {/* Vote tally — pinned to the viewport for the same reason as the header:
          it sits 31px off the frame's bottom edge, which "cover" scaling crops
          away. Child offsets are measured from the pill, which is where the
          design's own numbers land (16/21px in from its top-left). */}
      <WorldCupVoteBar />

      {/* Header chrome is pinned to the viewport rather than living inside the
          scaled frame: "cover" scaling crops the frame's top edge off on any
          viewport shorter than 5:3, which would take the header with it. The
          offsets are the design's own — 24px in from the top/left/right. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[24px] top-[24px] h-[20px] w-[19.966px]">
          <Image
            src={assets.worldCup.logo}
            alt="DES/NIS"
            fill
            unoptimized
            sizes="20px"
            className="block max-w-none"
          />
        </div>

        <p className="absolute left-[171px] top-[24px] w-[115px] -translate-x-full text-right text-[16px] font-medium leading-[20px] text-black">
          des/nis agency
        </p>

        <WorldCupCountdown className="absolute left-[calc(50%+0.5px)] top-[24px] -translate-x-1/2 whitespace-nowrap text-center text-[16px] font-normal leading-[20px] text-black tabular-nums" />

        <p className="absolute right-[24px] top-[24px] w-[115px] whitespace-pre-wrap text-right text-[14px] font-normal leading-[20px] text-black/65">
          {`2026 `}
          <br aria-hidden />
          WC Edition
        </p>
      </div>

      {/* Head-to-head paper (Figma 2232:139). Last, and on its own scaled
          layer, so it covers the header and the vote bar too. */}
      <WorldCupPaper />
      </div>

      {/* Phone / tablet fallback (< lg). The interactive poster needs a wide
          desktop viewport; here we just show the stadium and point people to a
          bigger screen. */}
      <div className="fixed inset-0 lg:hidden">
        <Image
          src={assets.worldCup.stadiumBg}
          alt=""
          fill
          unoptimized
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Darken the stadium so the white copy stays legible over it. */}
        <div className="absolute inset-0 bg-black/60" />

        <div className="absolute inset-0 flex flex-col items-center justify-center gap-[16px] px-[32px] text-center">
          <p className="text-[12px] font-medium uppercase tracking-[0.22em] text-white/65">
            2026 WC Edition
          </p>
          <h1 className="text-[34px] leading-[1.06] tracking-[-0.8px] text-white">
            <span className="font-normal">The </span>
            <span className="font-serif not-italic">Countdown</span>
            <span className="font-normal"> is on!</span>
          </h1>
          <p className="max-w-[300px] text-[15px] leading-[22px] text-white/75">
            This one&rsquo;s built for the big screen. Open the site on a desktop
            browser to step into the stadium.
          </p>
        </div>
      </div>
    </>
  );
}
