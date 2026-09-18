import { QuotesIcon } from "@phosphor-icons/react/ssr";
import { Reveal } from "@/components/ui/reveal";

const TESTIMONIALS = [
  {
    quote:
      "Sent my sister an Amazon card at 11pm on her birthday. She had the code before midnight.",
    name: "Chidinma O.",
    location: "Lagos",
  },
  {
    quote:
      "The amount picker is the bit I like. You see exactly what you're paying before you get to checkout.",
    name: "Tunde A.",
    location: "Abuja",
  },
  {
    quote:
      "Paid with a bank transfer and the code was in my inbox straight after. That was the whole experience.",
    name: "Amaka E.",
    location: "Port Harcourt",
  },
];

function initials(name: string) {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Testimonials() {
  return (
    <section aria-labelledby="testimonials-heading" className="testimonials-section">
      <div className="page-container">
        <Reveal>
          <h2 id="testimonials-heading" className="section-heading">
            What people say
          </h2>
          <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground">
            Sample feedback from the Giftly demo experience.
          </p>
        </Reveal>

        <div className="testimonial-grid">
          {TESTIMONIALS.map((testimonial, index) => (
            <Reveal key={testimonial.name} delay={index * 80}>
              <figure className="testimonial-card">
                <QuotesIcon size={22} weight="fill" className="testimonial-mark" aria-hidden="true" />
                <blockquote className="testimonial-quote">{testimonial.quote}</blockquote>
                <figcaption className="testimonial-author">
                  <span className="testimonial-avatar" aria-hidden="true">
                    {initials(testimonial.name)}
                  </span>
                  <span>
                    <span className="block text-sm font-medium">{testimonial.name}</span>
                    <span className="block text-xs text-muted-foreground">{testimonial.location}</span>
                  </span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
