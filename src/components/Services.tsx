import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SocialStack } from "./SocialStack";
import { SearchCard } from "./SearchCard";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";

function LearnMore() {
  return (
    <button className={flowHover("light", "rounded-xl px-4 py-3 text-sm font-semibold")}>
      Learn more
    </button>
  );
}

const columns = [
  {
    title: "Web Design & Development",
    visual: (
      <div className="relative aspect-[277/213] w-[277px] max-w-full overflow-hidden rounded-xl">
        <Image src={assets.whatWeDo} alt="" fill sizes="277px" className="object-contain" />
      </div>
    ),
  },
  { title: "SEO & AEO", visual: <SearchCard /> },
  { title: "Social Media & Collateral", visual: <SocialStack /> },
];

export function Services() {
  return (
    <section id="what-we-do" className="relative pt-20 lg:pt-24">
      <Container>
        <Reveal>
          <h2 className="text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
            What we do
          </h2>
          <p className="mt-6 max-w-[474px] text-lg font-light leading-7 text-white/65">
            One team for your entire web presence. We design and build it, get it
            ranking on Google and AI search, then create the content that keeps it
            growing.
          </p>
        </Reveal>
      </Container>

      {/* Full-width top line, matching the bottom separator */}
      <div className="mt-12 md:border-t md:border-white/10">
        <Container>
          {/* Transparent columns; bottom line is shared with the next section */}
          <Reveal className="grid gap-y-12 md:grid-cols-3 md:gap-0 md:border-x md:border-white/10 md:divide-x md:divide-white/10" stagger={0.12}>
            {columns.map((c) => (
              <div
                key={c.title}
                className="flex min-h-[440px] flex-col items-center justify-between gap-8 px-8 py-10 text-center"
              >
                <h3 className="text-xl tracking-[-0.4px]">{c.title}</h3>
                <div className="flex flex-1 items-center justify-center">{c.visual}</div>
                <LearnMore />
              </div>
            ))}
          </Reveal>
        </Container>
      </div>
    </section>
  );
}
