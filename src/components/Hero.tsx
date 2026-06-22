import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { AltaNapaLogo, CompassLogo, HessenLogo, OutliersLogo } from "./BrandLogos";
import { SiteAnalyzer } from "./SiteAnalyzer";
import { assets } from "@/lib/assets";

// Four unique cards shown in a repeating 1,2,3,4 sequence.
const cards = [
  { src: assets.cardFrame13, alt: "Outliers", href: "https://www.joinoutliers.com/", logo: <OutliersLogo />, color: "#43201c" },
  { src: assets.cardWebDesign, alt: "Hessen Kräuter", href: "https://www.hessenkraeuter.de/", logo: <HessenLogo />, color: "#2c6db4" },
  { src: assets.cardMockup, alt: "Compass Energy Solutions", href: "https://www.compassenergy.solar/", logo: <CompassLogo />, color: "#41474d" },
  { src: assets.cardGreenery, alt: "Alta Napa premium wine", href: "https://www.altanapawines.com/", logo: <AltaNapaLogo />, color: "#3c4a2b" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 lg:pt-40">
      {/* Night-sky backdrop for the first section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px]">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={assets.heroVideoPoster}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={assets.heroVideoWebm} type="video/webm" />
          <source src={assets.heroVideoMp4} type="video/mp4" />
        </video>
        {/* Blue-grey tint to match the Figma overlay */}
        <div className="absolute inset-0 bg-[rgb(31,44,50)]/75" />
        {/* Radial vignette + fade into the page background */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(11,11,12,0)_0%,rgba(11,11,12,0.35)_55%,#0b0b0c_100%)]" />
      </div>

      {/* Hairline under the navbar */}
      <div className="absolute inset-x-0 top-24 h-px bg-white/10" />

      <Container>
       <Reveal stagger={0.12}>
        {/* "Meet the team" pill */}
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 py-2 pl-2 pr-4 transition-colors hover:border-white/30 hover:bg-white/[0.06]"
        >
          <span className="flex items-center">
            <span className="size-[26px] overflow-hidden rounded-full border-[0.8px] border-white bg-white">
              <Image
                src={assets.avatar1}
                alt=""
                width={26}
                height={26}
                className="size-full object-cover"
              />
            </span>
            <span className="-ml-2 size-[26px] overflow-hidden rounded-full border-[0.8px] border-white bg-white">
              <Image
                src={assets.avatar2}
                alt=""
                width={26}
                height={26}
                className="size-full object-cover"
              />
            </span>
          </span>
          <span className="text-sm font-light text-white/65">
            Meet the team behind your project
          </span>
          <Image src={assets.arrowUp} alt="" width={14} height={14} className="opacity-65" />
        </a>

        {/* Headline + supporting copy */}
        <div className="mt-7 flex flex-col justify-between gap-8 lg:flex-row lg:items-start">
          <h1 className="max-w-[725px] text-[40px] leading-[1.05] tracking-[-1.2px] sm:text-[52px] lg:text-[64px] lg:tracking-[-1.92px]">
            Not a traditional agency, but a{" "}
            <span className="font-serif text-[44px] italic sm:text-[58px] lg:text-[72px]">
              hands-on web team
            </span>
            .
          </h1>
          <p className="max-w-[278px] text-lg font-light leading-7 text-white/65 lg:mt-6">
            We combine deep industry experience with AI to design, build, and
            launch digital experiences faster.
          </p>
        </div>

        {/* Calculator */}
        <p className="mt-12 text-lg font-light text-white/65">
          <span className="font-bold text-white">Calculate</span> how much your
          team could save.
        </p>
        <SiteAnalyzer />
       </Reveal>
      </Container>

      {/* Showcase carousel — auto-scrolls, pauses on hover, bleeds off both edges */}
      <Reveal y={20} delay={0.15}>
       <div id="our-work" className="group mt-14">
        {/* Clip horizontally for the marquee, but pad vertically so a card's
            hover scale isn't clipped top/bottom. Only the top padding is pulled
            back with a negative margin; the bottom stays as real space so the
            hero section's own overflow-hidden doesn't clip the scaled card. */}
        <div className="overflow-hidden py-3 -mt-3">
         <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 gap-6 pr-6"
              aria-hidden={dup === 1}
            >
              {/* Repeat the 1,2,3,4 set so each group is wider than the viewport
                  and the loop has no gap. */}
              {[...cards, ...cards].map((c, i) => (
                <a
                  key={i}
                  href={c.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit the ${c.alt} website (opens in a new tab)`}
                  style={{ backgroundColor: c.color }}
                  className="group/card relative block h-[398px] w-[278px] shrink-0 overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02]"
                >
                  {/* Scene image — fades out on hover to reveal the brand colour */}
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="278px"
                    className="object-cover transition-opacity duration-500 group-hover/card:opacity-0"
                  />
                  {/* Brand logo — sits at the top, slides to centre on hover */}
                  <div className="absolute inset-x-0 top-7 z-10 flex justify-center transition-all duration-500 ease-out group-hover/card:top-[38%] group-hover/card:-translate-y-1/2 group-hover/card:scale-110">
                    {c.logo}
                  </div>
                  {/* Clickable affordance */}
                  <span className="absolute bottom-4 right-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition-colors duration-300 group-hover/card:bg-white group-hover/card:text-ink">
                    <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <line x1="7" y1="17" x2="17" y2="7" />
                      <polyline points="7 7 17 7 17 17" />
                    </svg>
                  </span>
                </a>
              ))}
            </div>
          ))}
         </div>
        </div>
       </div>
      </Reveal>
    </section>
  );
}
