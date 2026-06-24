"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { flowHover } from "@/components/ui/flow-hover-button";
import { PLANS } from "@/lib/plans";

const field =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-[15px] text-white placeholder:text-white/35 outline-none transition-colors focus:border-white/30 focus:bg-white/[0.06]";
const label = "mb-1.5 block text-sm font-medium text-white/70";

export function ContactForm({ initialPlan }: { initialPlan?: string }) {
  const [plan, setPlan] = useState(PLANS.some((p) => p.slug === initialPlan) ? (initialPlan as string) : "");
  const [agreed, setAgreed] = useState(false);
  const [done, setDone] = useState(false);
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("sending");
    const payload = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      setDone(true);
    } catch {
      setStatus("error");
    }
  };

  if (done) {
    return (
      <div className="flex min-h-[420px] flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
        <h2 className="text-2xl tracking-[-0.96px]">Thanks — we’ll be in touch.</h2>
        <p className="mt-3 max-w-[360px] text-base font-light leading-7 text-white/65">
          We’ve got your details and will reach out shortly.
        </p>
        <Link href="/" className={flowHover("light", "mt-8 rounded-xl px-6 py-3 text-sm font-semibold")}>
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="w-full">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="firstName" className={label}>First name</label>
          <input id="firstName" name="firstName" required autoComplete="given-name" placeholder="First name" className={field} />
        </div>
        <div>
          <label htmlFor="lastName" className={label}>Last name</label>
          <input id="lastName" name="lastName" autoComplete="family-name" placeholder="Last name" className={field} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="email" className={label}>Email address</label>
        <input id="email" name="email" type="email" required autoComplete="email" placeholder="you@company.com" className={field} />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="company" className={label}>
            Company <span className="text-white/35">(optional)</span>
          </label>
          <input id="company" name="company" autoComplete="organization" placeholder="Company" className={field} />
        </div>
        <div>
          <label htmlFor="website" className={label}>
            Website <span className="text-white/35">(optional)</span>
          </label>
          <input id="website" name="website" type="text" inputMode="url" placeholder="https://…" className={field} />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="plan" className={label}>What are you interested in?</label>
        <div className="relative">
          <select
            id="plan"
            name="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className={`${field} cursor-pointer appearance-none pr-10 ${plan ? "" : "text-white/40"}`}
          >
            <option value="" className="text-black">Select one</option>
            {PLANS.map((p) => (
              <option key={p.slug} value={p.slug} className="text-black">
                {p.label}
              </option>
            ))}
          </select>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden
            className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-white/50"
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className={label}>Message</label>
        <textarea
          id="message"
          name="message"
          rows={4}
          placeholder="Write your message…"
          className={`${field} resize-none`}
        />
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
        <label className="flex items-center gap-2.5 text-sm text-white/70">
          <input
            type="checkbox"
            required
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="size-4 shrink-0 accent-white"
          />
          <span>
            I agree to the{" "}
            <Link href="/terms" className="text-white underline-offset-2 hover:underline">Terms</Link> and{" "}
            <Link href="/privacy" className="text-white underline-offset-2 hover:underline">Privacy Policy</Link>
          </span>
        </label>
        <button
          type="submit"
          disabled={status === "sending"}
          className={flowHover("light", "rounded-xl px-7 py-3 text-sm font-semibold disabled:opacity-60")}
        >
          {status === "sending" ? "Sending…" : "Submit"}
        </button>
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm text-red-400">Something went wrong. Please try again or email us directly.</p>
      )}
    </form>
  );
}
