"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { flowHover } from "@/components/ui/flow-hover-button";

const industries = [
  "E-commerce",
  "Hospitality & Food",
  "Real Estate",
  "Health & Wellness",
  "Professional Services",
  "Technology / SaaS",
  "Energy & Solar",
  "Other",
];

const goalOptions = ["New website", "Redesign", "Add content", "SEO & Growth"];

// "Valid" = non-empty, no spaces, ending in a .tld (e.g. .com, .de, .solar).
function isValidUrl(value: string) {
  const v = value.trim().replace(/\/+$/, "");
  return /^\S+\.[a-z]{2,}$/i.test(v);
}

type Modal = "closed" | "details" | "done";

export function SiteAnalyzer() {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<Modal>("closed");
  const [industry, setIndustry] = useState("");
  const [goals, setGoals] = useState<string[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const open = modal !== "closed";

  // Lock body scroll + close on Escape while the modal is open.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function handleAnalyze(e: React.FormEvent) {
    e.preventDefault();
    if (!isValidUrl(url)) {
      setError("Invalid URL");
      return;
    }
    setError(null);
    setModal("details");
  }

  function closeModal() {
    // Clear the hero input once the user has completed the flow.
    if (modal === "done") setUrl("");
    setModal("closed");
    setIndustry("");
    setGoals([]);
  }

  function toggleGoal(goal: string) {
    setGoals((prev) => (prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]));
  }

  const cleanUrl = url.trim().replace(/\/+$/, "");

  return (
    <div className="mt-4 max-w-[522px]">
      <form onSubmit={handleAnalyze} className="flex gap-2.5">
        <input
          type="text"
          inputMode="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          aria-label="Your website URL"
          aria-invalid={!!error}
          placeholder="yourwebsite.com"
          className="h-[60px] flex-1 rounded-xl bg-white/10 px-5 text-sm text-white outline-none transition-colors placeholder:text-white/35 focus:bg-white/[0.14] aria-[invalid=true]:ring-1 aria-[invalid=true]:ring-red-400/60"
        />
        <button
          type="submit"
          className={flowHover("dark", "h-[60px] shrink-0 rounded-xl px-6 text-sm font-bold")}
        >
          Let&rsquo;s analyze
        </button>
      </form>

      {/* Fixed-height slot so showing the error never shifts the page. */}
      <p
        role="alert"
        aria-hidden={!error}
        className={`mt-2 min-h-[1.25rem] text-sm text-red-400 transition-opacity duration-200 ${
          error ? "opacity-100" : "opacity-0"
        }`}
      >
        {error || " "}
      </p>

      {mounted && open
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label="Project details"
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            >
              {/* Dimmed backdrop */}
              <button
                aria-label="Close"
                onClick={closeModal}
                className="absolute inset-0 cursor-default bg-black/70 backdrop-blur-sm"
              />

              {/* Panel */}
              <div className="relative z-10 w-full max-w-[460px] animate-pop-in rounded-2xl border border-white/10 bg-[#101114] p-6 shadow-2xl sm:p-8">
                <button
                  type="button"
                  aria-label="Close"
                  onClick={closeModal}
                  className="absolute right-4 top-4 flex size-8 items-center justify-center rounded-full text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden>
                    <line x1="6" y1="6" x2="18" y2="18" />
                    <line x1="18" y1="6" x2="6" y2="18" />
                  </svg>
                </button>

                {modal === "details" ? (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setModal("done");
                    }}
                  >
                    <h3 className="text-2xl tracking-[-0.8px]">Let&rsquo;s scope it out</h3>
                    <p className="mt-2 text-sm font-light leading-6 text-white/65">
                      A few details about{" "}
                      <span className="font-medium text-accent">{cleanUrl}</span> so we
                      can tailor the analysis.
                    </p>

                    {/* Industry */}
                    <label className="mt-6 block text-xs font-light text-white/50">
                      What industry are you in?
                    </label>
                    <select
                      required
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="mt-1.5 h-12 w-full rounded-xl bg-white/10 px-4 text-sm text-white outline-none transition-colors focus:bg-white/[0.14]"
                    >
                      <option value="" disabled className="text-ink">
                        Select your industry
                      </option>
                      {industries.map((i) => (
                        <option key={i} value={i} className="text-ink">
                          {i}
                        </option>
                      ))}
                    </select>

                    {/* Goals */}
                    <p className="mt-5 text-xs font-light text-white/50">
                      What do you need? (pick any)
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-2">
                      {goalOptions.map((g) => {
                        const active = goals.includes(g);
                        return (
                          <button
                            type="button"
                            key={g}
                            aria-pressed={active}
                            onClick={() => toggleGoal(g)}
                            className={`rounded-lg px-3.5 py-2 text-sm transition-colors ${
                              active
                                ? "bg-white font-medium text-ink"
                                : "border border-white/15 text-white/80 hover:bg-white/10"
                            }`}
                          >
                            {g}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="submit"
                      disabled={!industry}
                      className={flowHover(
                        "dark",
                        "mt-7 h-12 w-full rounded-xl px-6 text-sm font-bold disabled:cursor-not-allowed disabled:opacity-50",
                      )}
                    >
                      Submit
                    </button>
                  </form>
                ) : (
                  <div className="py-2 text-center">
                    <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-accent/15 text-accent">
                      <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <h3 className="mt-4 text-2xl tracking-[-0.8px]">Thank you!</h3>
                    <p className="mt-2 text-sm font-light leading-6 text-white/65">
                      We&rsquo;ve received your details for{" "}
                      <span className="font-medium text-white">{cleanUrl}</span>. We&rsquo;ll
                      be in touch soon.
                    </p>
                    <button
                      type="button"
                      onClick={closeModal}
                      className={flowHover("dark", "mt-6 h-11 w-full rounded-xl px-6 text-sm font-bold")}
                    >
                      Done
                    </button>
                  </div>
                )}
              </div>
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}
