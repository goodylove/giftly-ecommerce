const steps = [
  { number: "01", title: "Choose a gift card", description: "Find a brand they love and choose how much to give." },
  { number: "02", title: "Make it a gift", description: "Add the recipient?s details and complete your purchase." },
  { number: "03", title: "Delivered by email", description: "The gift card arrives in their inbox, ready to use." },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" aria-labelledby="how-heading" className="how-section scroll-mt-8">
      <div className="page-container">
        <h2 id="how-heading" className="section-heading">How Giftly works</h2>
        <ol className="how-grid">{steps.map(({number,title,description}) => <li key={number}><span className="step-number">{number}</span><div><h3 className="text-base font-medium">{title}</h3><p className="mt-2 max-w-72 text-sm leading-6 text-muted-foreground">{description}</p></div></li>)}</ol>
      </div>
    </section>
  );
}
