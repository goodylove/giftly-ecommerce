import {
  EnvelopeSimpleIcon,
  InfinityIcon,
  LightningIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";

const FEATURES = [
  {
    icon: LightningIcon,
    title: "Delivered in minutes",
    body: "Digital codes, so there's nothing to ship and nothing to wait for.",
  },
  {
    icon: ShieldCheckIcon,
    title: "Payments you can trust",
    body: "Checkout runs on Paystack — card, bank transfer or USSD, all encrypted.",
  },
  {
    icon: InfinityIcon,
    title: "Codes that don't expire",
    body: "They can spend it today or hold on to it. No deadline, no fine print.",
  },
  {
    icon: EnvelopeSimpleIcon,
    title: "All you need is an email",
    body: "No app to install and no account for them to create before spending it.",
  },
];

export function WhyGiftly() {
  return (
    <section aria-labelledby="why-heading" className="why-section">
      <div className="page-container">
        <Reveal>
          <h2 id="why-heading" className="section-heading">
            Why people send Giftly
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            The small details that make a last-minute gift feel like a thoughtful one.
          </p>
        </Reveal>

        <div className="feature-grid">
          {FEATURES.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Reveal key={feature.title} delay={index * 70}>
                <article className="feature-card">
                  <span className="how-icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-[15px] font-medium tracking-tight">{feature.title}</h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{feature.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
