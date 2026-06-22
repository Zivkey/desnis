import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { ShowcaseCarousel } from "./ShowcaseCarousel";
import { SiteAnalyzer } from "./SiteAnalyzer";
import { assets } from "@/lib/assets";

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

      {/* Showcase carousel — auto-scrolls, drag to scrub, releases back to auto */}
      <Reveal y={20} delay={0.15}>
        <ShowcaseCarousel />
      </Reveal>
    </section>
  );
}
