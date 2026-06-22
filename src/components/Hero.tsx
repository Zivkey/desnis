import Image from "next/image";
import { Container } from "./Container";
import { assets } from "@/lib/assets";

const cards = [
  { src: assets.cardFrame13, alt: "Project showcase" },
  { src: assets.cardWebDesign, alt: "Web design project" },
  { src: assets.cardMockup, alt: "Brand mockup" },
  { src: assets.cardFrame13, alt: "Editorial project" },
  { src: assets.cardGreenery, alt: "Alta Napa premium wine" },
  { src: assets.cardMockup, alt: "Product mockup" },
];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-28 lg:pt-32">
      {/* Night-sky backdrop for the first section */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[880px]">
        <Image
          src={assets.nightSky}
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        {/* Blue-grey tint to match the Figma overlay */}
        <div className="absolute inset-0 bg-[rgb(31,44,50)]/75" />
        {/* Radial vignette + fade into the page background */}
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(11,11,12,0)_0%,rgba(11,11,12,0.35)_55%,#0b0b0c_100%)]" />
      </div>

      {/* Hairline under the navbar */}
      <div className="absolute inset-x-0 top-24 h-px bg-white/10" />

      <Container>
        {/* "Meet the team" pill */}
        <a
          href="#"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 py-2 pl-2 pr-4"
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
        <div className="mt-4 flex max-w-[522px] gap-2.5">
          <div className="flex h-[60px] flex-1 items-center rounded-xl bg-white/10 px-5 text-sm text-white/35">
            yourwebsite.com
          </div>
          <button className="h-[60px] shrink-0 rounded-xl bg-white px-6 text-sm font-bold text-ink transition-opacity hover:opacity-90">
            Let&rsquo;s analyze
          </button>
        </div>
      </Container>

      {/* Showcase carousel — auto-scrolls, pauses on hover, bleeds off both edges */}
      <div id="our-work" className="group mt-14 overflow-hidden">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          {[0, 1].map((dup) => (
            <div
              key={dup}
              className="flex shrink-0 gap-6 pr-6"
              aria-hidden={dup === 1}
            >
              {cards.map((c, i) => (
                <div
                  key={i}
                  className="relative h-[398px] w-[278px] shrink-0 overflow-hidden rounded-2xl bg-accent-dark"
                >
                  <Image
                    src={c.src}
                    alt={c.alt}
                    fill
                    sizes="278px"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
