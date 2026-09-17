import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container py-12">
        <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
          <div className="max-w-xs">
            <Link href="/" aria-label="Giftly home" className="wordmark">
              giftly<span className="text-brand">.</span>
            </Link>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Digital gift cards for every occasion — delivered straight to their inbox in minutes.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-medium">Shop</p>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
                <li><Link href="/#gift-cards" className="hover:text-foreground">Browse gift cards</Link></li>
                <li><Link href="/cart" className="hover:text-foreground">Cart</Link></li>
                <li><Link href="/checkout" className="hover:text-foreground">Checkout</Link></li>
              </ul>
            </div>
            <div>
              <p className="text-sm font-medium">Giftly</p>
              <ul className="mt-3 flex flex-col gap-2.5 text-sm text-muted-foreground">
                <li><a href="mailto:hello@giftly.example" className="hover:text-foreground">Contact</a></li>
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-10 flex flex-col-reverse items-center gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between">
          <p>© 2026 Giftly. All rights reserved.</p>
          {/* <p>Demo project — no real payments are processed.</p> */}
        </div>
      </div>
    </footer>
  );
}
