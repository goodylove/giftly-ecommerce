import Link from "next/link";
import { ArrowRightIcon, BasketIcon } from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

// One organic shape, drawn twice at different rotations and tints — the offset copy
// is what stops it reading as a geometric badge.
// Radii deliberately vary from ~36 to ~50 around the centre; an even radius just
// reads as a circle once the two copies overlap.
const BLOB =
  "M110 60c-2 18-13 28-31 33-18 5-33 13-43 8.6-10-4.4-14-25.4-12-41.6 2-16 5-34 13-39.8 8-6 33-2 43 5.4 10 7.4 32 16.4 30 34.4Z";

export function EmptyCart({ closesSheet }: { closesSheet?: boolean } = {}) {
  const ctaClassName = cn(buttonVariants({ size: "lg" }), "mt-7");

  return (
    <div className="empty-cart">
      <span className="empty-cart-art" aria-hidden="true">
        <svg viewBox="0 0 120 120" className="empty-cart-blob">
          <path className="blob-far" d={BLOB} transform="rotate(-34 60 60)" />
          <path className="blob-near" d={BLOB} />
        </svg>
        <BasketIcon size={42} weight="regular" className="empty-cart-icon" />
      </span>

      <p className="empty-cart-title">Your cart is empty</p>
      <p className="empty-cart-text">
        Looks like you haven&apos;t added a gift card yet.
      </p>

      {closesSheet ? (
        <SheetClose
          nativeButton={false}
          render={<Link href="/#gift-cards" className={ctaClassName} />}
        >
          Browse gift cards <ArrowRightIcon />
        </SheetClose>
      ) : (
        <Link href="/#gift-cards" className={ctaClassName}>
          Browse gift cards <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}
