import Image from "next/image";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { Testimonials } from "@/components/Testimonials";
import { Services } from "@/components/Services";
import { NewEra } from "@/components/NewEra";
import { Pricing } from "@/components/Pricing";
import { TokenEcosystem } from "@/components/TokenEcosystem";
import { Footer } from "@/components/Footer";
import { assets } from "@/lib/assets";

export default function Home() {
  return (
    <main className="relative min-h-screen bg-ink">
      <Navbar />
      <Hero />
      <Testimonials />

      {/* Single atmospheric backdrop: starts just below the "What we do" header
          and text, fades out around the top of the pricing cards (matches Figma
          "Moonlit Dunescape Serenity 1"). */}
      <div className="relative isolate">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[256px] -z-10 h-[1290px] overflow-hidden"
        >
          <Image
            src={assets.dunescape}
            alt=""
            fill
            sizes="100vw"
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#0b0b0c_0%,rgba(11,11,12,0)_41%,rgba(11,11,12,0)_85%,#0b0b0c_100%)]" />
        </div>

        <Services />
        <NewEra />
        <Pricing />
      </div>

      <TokenEcosystem />
      <Footer />
    </main>
  );
}
