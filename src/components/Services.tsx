import Image from "next/image";
import { Container } from "./Container";
import { assets } from "@/lib/assets";

function LearnMore() {
  return (
    <button className="glass-soft rounded-xl px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/15">
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

/* Two ad creatives, fanned and overlapping (Social Media & Collateral column) */
function SocialStack() {
  const card =
    "absolute w-[124px] overflow-hidden rounded-[10px] border-[3px] border-white/75 bg-white shadow-[0_5px_80px_0_rgba(0,0,0,0.65)]";
  return (
    <div className="relative h-[220px] w-[230px]">
      {/* back card */}
      <div className={`${card} left-0 top-1 -rotate-[6.68deg]`}>
        <div className="relative aspect-[124/156]">
          <Image src={assets.adCreative1} alt="" fill sizes="124px" className="object-cover" />
          <div className="absolute inset-0 bg-black/25" />
          <p className="absolute left-2.5 top-1/2 w-[80px] text-base font-bold leading-tight tracking-tight text-white">
            Pouzdan i tihi rad
          </p>
          <p className="absolute bottom-2 left-2.5 text-[5px] text-white">invertolux.com</p>
        </div>
      </div>
      {/* front card */}
      <div className={`${card} left-[58px] top-11 rotate-[5.46deg]`}>
        <div className="relative aspect-[124/156]">
          <Image src={assets.adCreative2} alt="" fill sizes="124px" className="object-cover" />
          <p className="absolute left-2.5 top-2 w-[72px] text-[13px] font-bold leading-tight tracking-tight text-white">
            Energetski efikasne.
          </p>
          <p className="absolute left-2.5 top-12 w-[74px] text-[6px] leading-tight text-white/75">
            Inverter klime sa niskom potrošnjom struje
          </p>
        </div>
      </div>
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
        <h2 className="text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
          What we do
        </h2>
        <p className="mt-6 max-w-[474px] text-lg font-light leading-7 text-white/65">
          Lorem ipsum dolor sit amet consectetur. Metus suscipit diam et quis
          ipsum adipiscing tortor lacus.
        </p>
      </Container>

      {/* Full-width top line, matching the bottom separator */}
      <div className="mt-12 md:border-t md:border-white/10">
        <Container>
          {/* Transparent columns; bottom line is shared with the next section */}
          <div className="grid gap-y-12 md:grid-cols-3 md:gap-0 md:border-x md:border-white/10 md:divide-x md:divide-white/10">
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
          </div>
        </Container>
      </div>
    </section>
  );
}
