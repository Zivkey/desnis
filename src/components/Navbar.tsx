"use client";

import { useEffect, useState } from "react";
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
  const [open, setOpen] = useState(false);

  // Sticky-header scroll state.
  const [scrolled, setScrolled] = useState(false); // past the very top → show backdrop
  const [hidden, setHidden] = useState(false); // hidden while scrolling down

  // While the menu is open: lock body scroll, close on Escape, and close once
  // the viewport reaches the desktop breakpoint.
  useEffect(() => {
    if (!open) return;
    // <html> is the scroll container here (overflow-x + scrollbar-gutter live on
    // it), so lock it — not <body> — to actually freeze the page. scrollbar-gutter
    // keeps the layout from shifting when the scrollbar disappears.
    const root = document.documentElement;
    const prev = root.style.overflow;
    root.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const mql = window.matchMedia("(min-width: 1024px)");
    const onChange = () => mql.matches && setOpen(false);
    window.addEventListener("keydown", onKey);
    mql.addEventListener("change", onChange);
    return () => {
      root.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
      mql.removeEventListener("change", onChange);
    };
  }, [open]);

  // Sticky behaviour: show a backdrop once scrolled; hide the bar when scrolling
  // down and reveal it when scrolling up (classic pattern, both mobile + desktop).
  useEffect(() => {
    let last = window.scrollY;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      setScrolled(y > 8);
      // Near the top the bar is always fully shown — never hide or re-animate it
      // there (prevents the logo/links twitching up when the page settles at 0).
      if (y <= 96) setHidden(false);
      else if (y > last + 4) setHidden(true); // scrolling down (small deadzone)
      else if (y < last - 4) setHidden(false); // scrolling up
      last = y;
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // A zero-height sticky wrapper keeps the bar pinned during normal scroll but
    // lets it move with the page during rubber-band overscroll (so the
    // transparent header never detaches at the top), all without taking any
    // layout space — the bar overflows the wrapper and overlays the hero. The
    // backdrop lives inside it so it shares the header's stacking context (the
    // header always paints above it).
    <div className="sticky top-0 z-50 h-0">
      {/* Backdrop behind the dropdown — dims the page and closes on outside tap */}
      <div
        aria-hidden
        onClick={() => setOpen(false)}
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity ease-out lg:hidden ${
          open ? "opacity-100 duration-300" : "pointer-events-none opacity-0 duration-500"
        }`}
      />

        <header
          className={`border-b transition duration-300 ease-out will-change-transform ${
            scrolled || open ? "border-white/10 bg-ink/70 backdrop-blur-md" : "border-transparent"
          } ${hidden && !open ? "-translate-y-full" : "translate-y-0"}`}
        >
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

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link href="/contact" className={flowHover("dark", "rounded-xl px-6 py-3 text-base tracking-[-0.32px]")}>
              Get in touch
            </Link>
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Chat on WhatsApp"
              className="sfx-hover flex items-center justify-center rounded-xl bg-accent p-3 transition-opacity hover:opacity-90"
            >
              <Image src={assets.whatsapp} alt="" width={24} height={24} />
            </a>
          </div>

          {/* Mobile hamburger — morphs into an X when open */}
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="flex size-11 items-center justify-center rounded-xl text-white transition-colors hover:bg-white/10 lg:hidden"
          >
            <span className="relative block h-[18px] w-6">
              <span
                className={`absolute left-0 top-0 h-0.5 w-6 origin-center rounded-full bg-current transition duration-300 ease-out ${
                  open ? "translate-y-2 rotate-45" : ""
                }`}
              />
              <span
                className={`absolute left-0 top-1/2 h-0.5 w-6 -translate-y-1/2 rounded-full bg-current transition duration-300 ease-out ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-6 origin-center rounded-full bg-current transition duration-300 ease-out ${
                  open ? "-translate-y-2 -rotate-45" : ""
                }`}
              />
            </span>
          </button>
        </Container>

        {/* Mobile dropdown — slides down below the bar */}
        <div
          className={`grid overflow-hidden transition-[grid-template-rows] ease-out lg:hidden ${
            open ? "grid-rows-[1fr] duration-300" : "grid-rows-[0fr] duration-500"
          }`}
        >
          <div className="min-h-0 overflow-hidden">
            <Container className="pb-6">
              <nav className="flex flex-col" aria-hidden={!open}>
                {links.map((l) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    tabIndex={open ? 0 : -1}
                    onClick={() => setOpen(false)}
                    className="border-b border-white/10 py-4 text-lg font-light text-white/80 transition-colors hover:text-white"
                  >
                    {l.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6 flex items-center gap-2">
                <Link
                  href="/contact"
                  tabIndex={open ? 0 : -1}
                  onClick={() => setOpen(false)}
                  className={flowHover("dark", "flex-1 rounded-xl px-6 py-3 text-center text-base tracking-[-0.32px]")}
                >
                  Get in touch
                </Link>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chat on WhatsApp"
                  tabIndex={open ? 0 : -1}
                  className="sfx-hover flex items-center justify-center rounded-xl bg-accent p-3 transition-opacity hover:opacity-90"
                >
                  <Image src={assets.whatsapp} alt="" width={24} height={24} />
                </a>
              </div>
            </Container>
          </div>
        </div>
        </header>
    </div>
  );
}
