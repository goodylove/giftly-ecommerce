"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  return (
    <form
      className="mt-4"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
        setEmail("");
      }}
    >
      <label htmlFor="newsletter-email" className="text-sm font-medium">
        Get new brands in your inbox
      </label>
      <div className="mt-2.5 flex gap-2">
        <Input
          id="newsletter-email"
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          className="h-10"
        />
        <Button type="submit" className="h-10 shrink-0 px-4">
          Subscribe
        </Button>
      </div>
      {submitted && (
        <p role="status" className="mt-2 text-xs text-muted-foreground">
          Thanks for subscribing! You&apos;ll receive an email when we add new brands.
        </p>
      )}
    </form>
  );
}
