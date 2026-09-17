import Image from "next/image";
import { SteamLogoIcon } from "@phosphor-icons/react/ssr";
import type { GiftCard } from "@/lib/gift-cards";
import { cn } from "@/lib/utils";

export function CardArtwork({ card, className }: { card: GiftCard; className?: string }) {
  return (
    <div className={cn("gift-artwork", !card.imageSrc && `gift-artwork--${card.id}`, className)} aria-hidden="true">
      {card.imageSrc ? (
        <Image src={card.imageSrc} alt="" fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, (max-width: 1279px) 33vw, 300px" className="object-cover" />
      ) : card.id === "amazon" ? (
        <span className="amazon-wordmark">amazon<svg viewBox="0 0 120 25" fill="none"><path d="M10 5c26 16 61 17 92 1" stroke="currentColor" strokeWidth="4" strokeLinecap="round" /><path d="m91 4 14-2-2 12" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg></span>
      ) : (
        <span className="steam-wordmark"><SteamLogoIcon weight="fill" /><span>STEAM</span></span>
      )}
    </div>
  );
}
