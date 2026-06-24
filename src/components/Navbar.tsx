import Image from "next/image";
import Link from "next/link";
import { Container } from "./Container";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";
import { WHATSAPP_URL } from "@/lib/contact";

// Absolute hrefs so the nav also works from other routes (e.g. /contact),
// returning to the matching section on the home page.
const links = [
  { label: "What we do", href: "/#what-we-do" },
  { label: "Our work", href: "/#our-work" },
  { label: "Pricing", href: "/#pricing" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6">
        {/* Logo + left-aligned nav */}
        <div className="flex items-center gap-9">
          <Link href="/" aria-label="DES/NIS home" className="inline-block transition-opacity hover:opacity-80">
            <Image src={assets.logoMark} alt="DES/NIS" width={24} height={24} className="h-6 w-6 max-w-none" />
          </Link>

          <nav className="hidden items-center gap-9 text-base font-light text-white/65 lg:flex">
            {links.map((l) => (
              <Link key={l.label} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Link href="/contact" className={flowHover("dark", "rounded-xl px-6 py-3 text-base tracking-[-0.32px]")}>
            Get in touch
          </Link>
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Chat on WhatsApp"
            className="flex items-center justify-center rounded-xl bg-accent p-3 transition-opacity hover:opacity-90"
          >
            <Image src={assets.whatsapp} alt="" width={24} height={24} />
          </a>
        </div>
      </Container>
    </header>
  );
}
