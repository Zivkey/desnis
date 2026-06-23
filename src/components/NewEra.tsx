import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";
import { WHATSAPP_URL } from "@/lib/contact";

export function NewEra() {
  return (
    <section id="lifestyle" className="relative border-y border-white/10 py-20 lg:py-24">
      <Container>
       <Reveal stagger={0.12}>
        <h2 className="max-w-[589px] text-[34px] leading-tight tracking-[-1.44px] sm:text-[40px] lg:text-[48px]">
          A new era of digital agencies
        </h2>
        <p className="mt-6 max-w-[580px] text-lg font-light leading-7 text-white/65">
          We pair senior, hands-on craft with AI to ship faster than a traditional
          agency, without the bloated teams or endless calls.
        </p>

        <div className="mt-8 flex items-center gap-2">
          <Link
            href="/contact"
            className={flowHover("dark", "rounded-xl px-6 py-3 text-base tracking-[-0.32px]")}
          >
            Get in touch
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 rounded-xl bg-accent py-3 pl-5 pr-6 text-base font-medium tracking-[-0.32px] text-ink transition-opacity hover:opacity-90"
          >
            <Image src={assets.whatsapp} alt="" width={24} height={24} />
            WhatsApp
          </a>
        </div>
       </Reveal>
      </Container>
    </section>
  );
}
