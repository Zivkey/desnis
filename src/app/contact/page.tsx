import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/ContactForm";
import { Navbar } from "@/components/Navbar";
import { flowHover } from "@/components/ui/flow-hover-button";
import { assets } from "@/lib/assets";
import { CALENDLY_URL } from "@/lib/contact";

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
    <main className="relative min-h-screen overflow-hidden bg-ink">
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
        <div className="absolute inset-0 bg-[rgb(31,44,50)]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_0%,rgba(11,11,12,0)_0%,rgba(11,11,12,0.5)_60%,#0b0b0c_100%)]" />
      </div>

      {/* Site nav — links return to the matching section on home */}
      <Navbar />
      {/* Hairline under the navbar — matches the home page */}
      <div className="absolute inset-x-0 top-24 z-10 h-px bg-white/10" />

      <div className="relative z-10 mx-auto grid min-h-screen max-w-[1240px] grid-cols-1 items-stretch gap-12 px-6 pb-12 pt-28 lg:grid-cols-2 lg:gap-16 lg:px-10 lg:pb-16 lg:pt-32">
        {/* Left — copy + contact info */}
        <div className="flex flex-col">
          <h1 className="text-[40px] leading-[1.05] tracking-[-1.6px] sm:text-[52px] lg:text-[60px]">
            Get in touch
          </h1>
          <p className="mt-5 max-w-[440px] text-lg font-light leading-7 text-white/65">
            Whether you’re starting something new or improving what you have, we’re happy to help.
            Tell us about your project and we’ll get back to you fast.
          </p>

          <div className="mt-9 flex w-full max-w-[278px] items-center gap-4 text-sm text-white/40">
            <span className="h-px flex-1 bg-white/10" />
            <span>or</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <p className="mt-5 text-xl font-light tracking-[-0.4px] text-white/75">Schedule a call</p>

          <a
            href={CALENDLY_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={flowHover("light", "mt-5 w-full max-w-[278px] justify-between rounded-xl px-3.5 py-3")}
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

          <div className="mt-12 lg:mt-auto">
            <h2 className="text-lg tracking-[-0.4px]">General contact info</h2>
            <dl className="mt-4 space-y-2 text-base font-light text-white/65">
              <div className="flex gap-2">
                <dt className="text-white">Email:</dt>
                <dd>veljko@desnis.com</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-white">Phone:</dt>
                <dd>+381 64 0075000</dd>
              </div>
              <div className="flex gap-2">
                <dt className="text-white">Location:</dt>
                <dd>Belgrade, Serbia</dd>
              </div>
            </dl>
          </div>
        </div>

        {/* Right — form */}
        <div className="w-full lg:justify-self-end lg:max-w-[520px]">
          <ContactForm initialPlan={initialPlan} />
        </div>
      </div>
    </main>
  );
}
