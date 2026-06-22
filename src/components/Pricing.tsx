import { Container } from "./Container";
import { Reveal } from "./Reveal";
import { PricingTabs } from "./PricingTabs";

export function Pricing() {
  return (
    <section id="pricing" className="relative py-20 lg:py-24">
      <Container>
        <Reveal stagger={0.12}>
          <h2 className="text-[28px] leading-tight tracking-[-1.28px] sm:text-[32px]">
            Our pricing is simple
          </h2>
          <p className="mt-4 max-w-[474px] text-lg font-light leading-7 text-white/65">
            Lorem ipsum dolor sit amet consectetur. Metus suscipit diam et quis
            ipsum adipiscing tortor lacus.
          </p>
        </Reveal>

        <PricingTabs />
      </Container>
    </section>
  );
}
