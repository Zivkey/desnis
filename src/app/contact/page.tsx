import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { assets } from "@/lib/assets";

export const metadata: Metadata = {
  title: "Get in touch — DES/NIS",
  description: "Tell us about your project and we'll get back to you.",
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ plan?: string | string[] }>;
}) {
  const { plan } = await searchParams;
  const initialPlan = Array.isArray(plan) ? plan[0] : plan;

  return (
    <main className="relative flex min-h-screen flex-col items-center overflow-hidden bg-ink px-6 py-12 sm:py-16">
      {/* Same video as the hero, used as the page background */}
      <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
        <video
          autoPlay
          muted
          loop
          playsInline
          poster={assets.heroVideoPoster}
          className="absolute inset-0 size-full object-cover"
        >
          <source src={assets.heroVideoWebm} type="video/webm" />
          <source src={assets.heroVideoMp4} type="video/mp4" />
        </video>
        {/* Blue-grey tint + vignette so the form stays legible */}
        <div className="absolute inset-0 bg-[rgb(31,44,50)]/75" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(11,11,12,0)_0%,rgba(11,11,12,0.45)_60%,#0b0b0c_100%)]" />
      </div>

      <div className="relative z-10 flex w-full flex-col items-center">
        <Link
          href="/"
          aria-label="DES/NIS home"
          className="mb-10 inline-block transition-opacity hover:opacity-80"
        >
          <Image src={assets.logoMark} alt="DES/NIS" width={28} height={28} className="size-7" />
        </Link>
        <ContactForm initialPlan={initialPlan} />
      </div>
    </main>
  );
}
