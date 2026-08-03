import type { Metadata } from "next";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact — Oravio",
  description: "Plan een gesprek over wat Oravio voor jouw onderneming kan betekenen.",
};

export default function ContactPage() {
  return <ContactForm />;
}
