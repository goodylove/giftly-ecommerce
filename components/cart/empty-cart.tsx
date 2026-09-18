import Link from "next/link";
import { ArrowRightIcon, GiftIcon } from "@phosphor-icons/react/ssr";
import { buttonVariants } from "@/components/ui/button";
import { SheetClose } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

export function EmptyCart({ closesSheet }: { closesSheet?: boolean } = {}) {
  const ctaClassName = cn(buttonVariants(), "mt-6 w-full");

  return (
    <div className="py-2 text-center">
      <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-xl bg-brand-soft text-brand">
        <GiftIcon size={28} weight="duotone" />
      </div>
      {/* <p className="font-heading text-2xl font-semibold tracking-tight">A little happiness goes here.</p> */}
      <p className="mt-3 text-sm leading-6 text-muted-foreground">
        Your cart is empty. Explore the collection and find a gift that feels just right.
      </p>
      {closesSheet ? (
        <SheetClose nativeButton={false} render={<Link href="/#gift-cards" className={ctaClassName} />}>
          Explore gift cards <ArrowRightIcon />
        </SheetClose>
      ) : (
        <Link href="/#gift-cards" className={ctaClassName}>
          Explore gift cards <ArrowRightIcon />
        </Link>
      )}
    </div>
  );
}
