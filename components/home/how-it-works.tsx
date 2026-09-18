import { CardsThreeIcon, CoinsIcon, PaperPlaneTiltIcon } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";

const STEPS = [
  {
    icon: CardsThreeIcon,
    title: "Pick a card",
    body: "Browse brands they actually use — Amazon, Spotify, PlayStation and more.",
  },
  {
    icon: CoinsIcon,
    title: "Choose an amount",
    body: "Every card comes in set denominations. Pick the one that fits the occasion.",
  },
  {
    icon: PaperPlaneTiltIcon,
    title: "We deliver it",
    body: "The code lands in their inbox minutes after your payment clears.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="how-section scroll-mt-8">
      <div className="page-container">
        <Reveal>
          <h2 id="how-heading" className="section-heading">
            Sending a gift takes about a minute
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            No account to create, no delivery address to chase down. Three steps and it&apos;s on its way.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <ol className="how-grid">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.title}>
                  <span className="how-icon" aria-hidden="true">
                    <Icon size={22} />
                  </span>
                  <div>
                    <span className="step-number">Step {String(index + 1).padStart(2, "0")}</span>
                    <h3 className="text-[15px] font-medium tracking-tight">{step.title}</h3>
                    <p className="mt-1.5 text-sm leading-6 text-muted-foreground">{step.body}</p>
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
