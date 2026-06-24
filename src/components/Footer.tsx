import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { FooterWordmark } from "./FooterWordmark";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";
import { CALENDLY_URL } from "@/lib/contact";

export function Footer() {
  return (
    <footer id="contact" className="relative isolate overflow-hidden border-t border-white/10 pt-16">
      {/* Moonlit sky backdrop — only the top (sky) of the image, contained to the footer */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <Image
          src={assets.dunescape}
          alt=""
          fill
          sizes="100vw"
          className="object-cover object-top opacity-25"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0b0c_0%,rgba(11,11,12,0)_41%,rgba(11,11,12,0)_85%,#0b0b0c_100%)]" />
      </div>

      <Container>
       <Reveal>
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div>
            <p className="text-base text-white/65">Email</p>
            <a
              href="mailto:veljko@desnis.com"
              className="mt-2 block text-2xl tracking-[-0.96px] text-white transition-colors hover:text-accent"
            >
              veljko@desnis.com
            </a>
          </div>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={flowHover("light", "w-full max-w-[278px] justify-between rounded-xl px-3.5 py-3")}
          >
            <span className="flex items-center">
              <span className="size-6 overflow-hidden rounded-full border-[0.75px] border-white bg-white">
                <Image src={assets.avatar1} alt="" width={24} height={24} className="size-full object-cover" />
              </span>
              <span className="-ml-1.5 size-6 overflow-hidden rounded-full border-[0.75px] border-white bg-white">
                <Image src={assets.avatar3} alt="" width={24} height={24} className="size-full object-cover" />
              </span>
            </span>
            <span className="text-sm font-semibold">Book a call</span>
          </a>
        </div>
       </Reveal>
      </Container>

      {/* Oversized wordmark — GSAP draws the letters on, looping. */}
      <div className="relative mt-10 w-full">
        <FooterWordmark />
      </div>

      <Container className="flex flex-col items-start gap-3 pb-10 pt-2">
        <p className="text-sm text-white/65">© 2026 DES/NIS All rights reserved.</p>
        <nav className="flex items-center gap-6 text-sm text-white/65">
          <Link href="/privacy" className="transition-colors hover:text-white">Privacy</Link>
          <Link href="/terms" className="transition-colors hover:text-white">Terms of Service</Link>
        </nav>
      </Container>
    </footer>
  );
}
