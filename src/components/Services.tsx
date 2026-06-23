import Image from "next/image";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { SocialStack } from "./SocialStack";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";

function LearnMore() {
  return (
    <button className={flowHover("light", "rounded-xl px-4 py-3 text-sm font-semibold")}>
      Learn more
    </button>
  );
}

/* Frosted Google-style search result (SEO & AEO column) */
function SearchCard() {
  return (
    <div className="w-full max-w-[277px] overflow-hidden rounded-2xl bg-white/5 p-4 text-left shadow-[0_8px_128px_0_rgba(0,0,0,0.65)] backdrop-blur-[4px]">
      <p className="text-[8px] text-white/35">
        Environ 105 000 000 résultats (0,43 secondes)
      </p>
      <div className="mt-2.5 flex items-center gap-1.5">
        <span className="size-3 shrink-0 rounded-full bg-gradient-to-br from-fuchsia-500 to-rose-500" />
        <div className="leading-tight">
          <p className="text-[8px] text-white/75">Nom du site</p>
          <p className="text-[7px] text-white/75">
            <span className="font-bold">Annonce</span> · www.balsamiq.com/
          </p>
        </div>
      </div>
      <p className="mt-2 text-[11px] leading-snug text-white">
        Create Mockups - Balsamiq Wireframes
      </p>
      <p className="mt-1 text-[9px] leading-snug text-white/60">
        It&rsquo;s like sketching on a whiteboard. Go On, Unleash Your
        Creativity! Life&rsquo;s too short for bad software. Try Balsamiq
        Wireframes for Free!
      </p>
    </div>
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
            Lorem ipsum dolor sit amet consectetur. Metus suscipit diam et quis
            ipsum adipiscing tortor lacus.
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
