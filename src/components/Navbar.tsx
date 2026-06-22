import Image from "next/image";
import { Container } from "./Container";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";

const links = [
  { label: "What we do", href: "#what-we-do" },
  { label: "Our work", href: "#our-work" },
  { label: "Lifestyle", href: "#lifestyle" },
];

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-50">
      <Container className="flex items-center justify-between py-6">
        {/* Logo + left-aligned nav */}
        <div className="flex items-center gap-9">
          <a href="#" className="flex size-12 items-center justify-center rounded-lg bg-white/5 transition-colors hover:bg-white/10">
            <Image src={assets.logoMark} alt="DES/NIS" width={16} height={16} />
          </a>

          <nav className="hidden items-center gap-9 text-base font-light text-white/65 lg:flex">
            {links.map((l) => (
              <a key={l.label} href={l.href} className="transition-colors hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className={flowHover("dark", "rounded-xl px-6 py-3 text-base tracking-[-0.32px]")}
          >
            Get in touch
          </a>
          <a
            href="#contact"
            aria-label="WhatsApp"
            className="flex items-center justify-center rounded-xl bg-accent p-3 transition-opacity hover:opacity-90"
          >
            <Image src={assets.whatsapp} alt="" width={24} height={24} />
          </a>
        </div>
      </Container>
    </header>
  );
}
