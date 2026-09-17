import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="page-container flex flex-wrap items-center justify-between gap-6 py-8">
        <Link href="/" aria-label="Giftly home" className="wordmark">Giftly.</Link>
        <nav aria-label="Footer navigation" className="flex gap-6 text-sm text-muted-foreground"><a href="#gift-cards" className="hover:text-foreground">Browse gift cards</a><a href="#how-it-works" className="hover:text-foreground">How it works</a></nav>
        <p className="text-xs text-muted-foreground">? 2026 Giftly</p>
      </div>
    </footer>
  );
}
