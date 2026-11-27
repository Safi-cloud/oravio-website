import type { Metadata } from "next";
import IntakeHero from "@/components/intake/IntakeHero";
import IntakeWizard from "@/components/intake/IntakeWizard";

export const metadata: Metadata = {
  title: "Materialen aanleveren | Oravio",
  description: "Lever logo, foto's en gegevens voor je nieuwe website in één keer aan.",
  robots: { index: false, follow: false },
};

export default function IntakePage() {
  return (
    <>
      <IntakeHero />
      <section className="px-4 pb-24 pt-6 md:px-10">
        <IntakeWizard />
      </section>
    </>
  );
}
