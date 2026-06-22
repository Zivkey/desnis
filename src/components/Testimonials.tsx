import Image from "next/image";
import { ReactNode } from "react";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { OutliersLogo } from "./BrandLogos";
import { assets } from "@/lib/assets";

type Item = {
  quote: string;
  name: string;
  role: string;
  photo: string;
  logo: ReactNode;
  rotation: string;
};

const items: Item[] = [
  {
    quote:
      "Lorem ipsum dolor sit amet consectetur. Lectus gravida nunc nisl nisl. Sapien mattis sapien id massa sed aliquet erat. Sed habitant et enim faucibus dui.",
    name: "Lukas Pakter",
    role: "Founder of Haus and Outliers",
    photo: assets.testimonial1,
    logo: <OutliersLogo />,
    rotation: "rotate-[7deg]",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet consectetur. Lectus gravida nunc nisl nisl. Sapien mattis sapien id massa sed aliquet erat. Sed habitant et enim faucibus dui.",
    name: "Emil Kyulev",
    role: "Founder of Compass Solutions",
    photo: assets.testimonial2,
    logo: <Image src={assets.compassLogo} alt="Compass Energy Solutions" width={158} height={24} />,
    rotation: "-rotate-[7deg]",
  },
];

export function Testimonials() {
  return (
    <section className="relative py-24 lg:py-32">
      <Container>
        <Reveal>
          <h2 className="max-w-[640px] text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
            Hear it directly from the source
          </h2>
        </Reveal>

        <Reveal className="mt-12 grid gap-4 md:grid-cols-2" stagger={0.15}>
          {items.map((t) => (
            <article
              key={t.name}
              className="glass relative min-h-[431px] overflow-visible rounded-2xl p-10"
            >
              {/* Text content */}
              <div className="flex h-full flex-col justify-between gap-8">
                <p className="max-w-[430px] text-lg leading-6 tracking-[-0.36px] text-white">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-base tracking-[-0.48px] text-white">{t.name}</p>
                  <p className="mt-1 text-sm font-light tracking-[-0.42px] text-white/75">
                    {t.role}
                  </p>
                  <div className="mt-12">{t.logo}</div>
                </div>
              </div>

              {/* Angled video that drops out of the bottom of the card */}
              <div
                className={`absolute -bottom-14 right-12 w-[190px] overflow-hidden rounded-xl border border-white/10 shadow-[0_8px_64px_0_rgba(0,0,0,0.65)] ${t.rotation}`}
              >
                <div className="relative aspect-[5/8]">
                  <Image
                    src={t.photo}
                    alt={t.name}
                    fill
                    sizes="190px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50" />
                  <button
                    aria-label={`Play ${t.name}'s testimonial`}
                    className="absolute left-1/2 top-1/2 flex size-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-transform hover:scale-105"
                  >
                    <Image src={assets.playButton} alt="" width={56} height={56} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </Reveal>
      </Container>
    </section>
  );
}
