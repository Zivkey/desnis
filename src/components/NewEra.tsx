import Image from "next/image";
import { Container } from "./Container";
import { assets } from "@/lib/assets";

export function NewEra() {
  return (
    <section id="lifestyle" className="relative border-y border-white/10 py-20 lg:py-24">
      <Container>
        <h2 className="max-w-[589px] text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
          A new era of digital agencies
        </h2>
        <p className="mt-6 max-w-[474px] text-lg font-light leading-7 text-white/65">
          Lorem ipsum dolor sit amet consectetur. Metus suscipit diam et quis
          ipsum adipiscing tortor lacus.
        </p>

        <div className="mt-8 flex items-center gap-2">
          <a
            href="#contact"
            className="rounded-xl bg-white px-6 py-3 text-base font-medium tracking-[-0.32px] text-ink transition-colors hover:bg-black hover:text-white"
          >
            Get in touch
          </a>
          <a
            href="#contact"
            className="flex items-center gap-2.5 rounded-xl bg-accent py-3 pl-5 pr-6 text-base font-medium tracking-[-0.32px] text-ink transition-opacity hover:opacity-90"
          >
            <Image src={assets.whatsapp} alt="" width={24} height={24} />
            WhatsApp
          </a>
        </div>
      </Container>
    </section>
  );
}
