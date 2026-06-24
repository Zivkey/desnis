import { ReactNode } from "react";
import Link from "next/link";
import { Container } from "./Container";
import { Navbar } from "./Navbar";
import { Footer } from "./Footer";

/**
 * Shared shell for the static legal pages (Privacy, Terms). Renders the site
 * nav + footer and a readable prose column; child <section>s supply the copy.
 */
export function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <main className="relative min-h-screen bg-ink">
      <Navbar />
      {/* Hairline under the navbar — matches the other pages */}
      <div className="absolute inset-x-0 top-24 z-10 h-px bg-white/10" />

      <Container className="relative z-10 pb-20 pt-32 lg:pb-24 lg:pt-40">
        <div className="mx-auto max-w-[760px]">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-white/50 transition-colors hover:text-white"
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to home
          </Link>

          <h1 className="mt-6 text-[40px] leading-[1.05] tracking-[-1.6px] sm:text-[48px]">
            {title}
          </h1>
          <p className="mt-3 text-sm text-white/50">Last updated: {updated}</p>

          {/* Prose: child-combinator utilities keep the section markup clean. */}
          <div
            className="mt-10 text-base font-light leading-7 text-white/70 [&_a]:text-white [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-normal [&_h2]:tracking-[-0.4px] [&_h2]:text-white [&_li]:mt-1.5 [&_p]:mt-3 [&_strong]:font-medium [&_strong]:text-white [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5"
          >
            {children}
          </div>
        </div>
      </Container>

      <Footer />
    </main>
  );
}
