import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Oravio",
  description: "Plan een gesprek over wat Oravio voor jouw onderneming kan betekenen.",
};

// Komt de bezoeker via de pagina Websites op maat (/contact?onderwerp=website),
// dan staat het juiste onderwerp in het formulier alvast geselecteerd.
export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { onderwerp } = await searchParams;
  const initialTopic = onderwerp === "website" ? "Een website op maat" : "Het Oravio-platform";
  return <ContactForm key={initialTopic} initialTopic={initialTopic} />;
}
