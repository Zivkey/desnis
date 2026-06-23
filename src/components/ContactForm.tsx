"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { flowHover } from "@/components/ui/flow-hover-button";
import { PLANS } from "@/lib/plans";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-base text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/30 focus:bg-white/[0.06]";
const label = "mb-1.5 block text-sm font-medium text-white/70";

export function ContactForm({ initialPlan }: { initialPlan?: string }) {
  const [selected, setSelected] = useState<string[]>(
    PLANS.some((p) => p.slug === initialPlan) ? [initialPlan as string] : [],
  );
  const [done, setDone] = useState(false);

  const toggle = (slug: string) =>
    setSelected((s) => (s.includes(slug) ? s.filter((x) => x !== slug) : [...s, slug]));

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: connect to an email service / CRM endpoint.
    setDone(true);
  };

  if (done) {
    return (
      <div className="glass w-full max-w-[560px] rounded-2xl p-8 text-center sm:p-10">
        <h1 className="text-2xl tracking-[-0.96px]">Thanks — we’ll be in touch.</h1>
        <p className="mt-3 text-base font-light leading-7 text-white/65">
          We’ve got your details and will reach out shortly.
        </p>
        <Link href="/" className={flowHover("light", "mt-8 w-full rounded-xl py-3 text-sm font-semibold")}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="glass w-full max-w-[560px] rounded-2xl p-8 text-left sm:p-10">
      <h1 className="text-2xl tracking-[-0.96px]">Let’s build something.</h1>
      <p className="mt-2 text-base font-light leading-6 text-white/65">
        Tell us about your project and we’ll get back to you.
      </p>

      <div className="mt-8 space-y-5">
        <div>
          <label htmlFor="name" className={label}>
            Name
          </label>
          <input id="name" name="name" required autoComplete="name" placeholder="Your name" className={field} />
        </div>

        <div>
          <label htmlFor="email" className={label}>
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@company.com"
            className={field}
          />
        </div>

        <div>
          <label htmlFor="company" className={label}>
            Company name <span className="text-white/35">(optional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" placeholder="Company" className={field} />
        </div>

        <div>
          <label htmlFor="website" className={label}>
            Current website <span className="text-white/35">(optional)</span>
          </label>
          <input id="website" name="website" type="url" inputMode="url" placeholder="https://…" className={field} />
        </div>

        <div>
          <label htmlFor="message" className={label}>
            Tell us more
          </label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="What are you looking to build?"
            className={`${field} resize-none`}
          />
        </div>

        <fieldset>
          <legend className={label}>What are you interested in?</legend>
          <div className="grid gap-2.5 sm:grid-cols-2">
            {PLANS.map((p) => {
              const on = selected.includes(p.slug);
              return (
                <label
                  key={p.slug}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border bg-white/[0.04] px-4 py-3 transition-colors ${
                    on ? "border-white/40 bg-white/[0.08]" : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="plans"
                    value={p.slug}
                    checked={on}
                    onChange={() => toggle(p.slug)}
                    className="size-4 shrink-0 accent-white"
                  />
                  <span className="text-sm text-white/85">{p.label}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      </div>

      <button type="submit" className={flowHover("light", "mt-8 w-full rounded-xl py-3.5 text-sm font-semibold")}>
        Send message
      </button>
    </form>
  );
}
