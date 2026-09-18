import Link from "next/link";
import { NewsletterForm } from "@/components/layout/newsletter-form";

const FOOTER_COLUMNS = [
  {
    title: "Shop",
    links: [
      { label: "Browse gift cards", href: "/#gift-cards" },
      { label: "Shop by category", href: "/#gift-cards" },
      { label: "Cart", href: "/cart" },
      { label: "Checkout", href: "/checkout" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "How it works", href: "/#how-it-works" },
      { label: "Why Giftly", href: "/#gift-cards" },
      { label: "Reviews", href: "/#gift-cards" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQ", href: "/#faq" },
      { label: "Contact", href: "mailto:hello@giftly.example" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container py-14">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
          <div className="max-w-sm">
            <Link href="/" aria-label="Giftly home" className="wordmark">
              giftly<span className="text-brand">.</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Digital gift cards for every occasion — delivered straight to their inbox in minutes.
            </p>
            <NewsletterForm />
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:justify-items-end">
            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-sm font-medium">{column.title}</p>
                <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      {link.href.startsWith("mailto:") ? (
                        <a href={link.href} className="hover:text-foreground">
                          {link.label}
                        </a>
                      ) : (
                        <Link href={link.href} className="hover:text-foreground">
                          {link.label}
                        </Link>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-12 flex flex-col-reverse items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Giftly. All rights reserved.</p>
          <p>Portfolio demo — brands shown are for illustration and no real gift cards are issued.</p>
        </div>
      </div>
    </footer>
  );
}
