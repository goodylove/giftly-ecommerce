import { Accordion, AccordionItem, AccordionPanel, AccordionTrigger } from "@/components/ui/accordion";
import { Reveal } from "@/components/ui/reveal";

const FAQS = [
  {
    id: "delivery",
    question: "How quickly does the gift card arrive?",
    answer:
      "As soon as your payment is confirmed. The code is emailed to the address you enter at checkout, usually within a couple of minutes.",
  },
  {
    id: "payment",
    question: "Which payment methods can I use?",
    answer:
      "Checkout is handled by Paystack, so you can pay by debit card, bank transfer or USSD. Your card details are entered on Paystack's page and never touch Giftly.",
  },
  {
    id: "expiry",
    question: "Do the cards expire?",
    answer:
      "No. Once a code is issued it stays valid, so the person you sent it to can spend it whenever they're ready.",
  },
  {
    id: "recipient",
    question: "Can I send a card to someone else?",
    answer:
      "Yes. Enter their email at checkout and add a short message — they'll get the code directly, and you'll get a confirmation.",
  },
  {
    id: "failed-payment",
    question: "What happens if my payment fails?",
    answer:
      "Nothing is charged and nothing is lost. Your cart stays exactly as it was, so you can head back to checkout and try again with another method.",
  },
  {
    id: "security",
    question: "Is it safe to pay on Giftly?",
    answer:
      "Payments run through Paystack's hosted checkout and every order is verified server-side before it's marked as paid — a code is only released against a confirmed transaction.",
  },
];

export function Faq() {
  return (
    <section id="faq" aria-labelledby="faq-heading" className="faq-section scroll-mt-8">
      <div className="page-container faq-layout">
        <Reveal className="faq-intro">
          <h2 id="faq-heading" className="section-heading">
            Questions, answered
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            The things people usually want to know before sending their first card.
          </p>
        </Reveal>

        <Reveal delay={80}>
          <Accordion className="accordion" defaultValue={["delivery"]}>
            {FAQS.map((faq) => (
              <AccordionItem key={faq.id} value={faq.id}>
                <AccordionTrigger>{faq.question}</AccordionTrigger>
                <AccordionPanel>{faq.answer}</AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
