import NieuwVoorstel from "@/components/kompas/NieuwVoorstel";
import { ACTIE } from "@/lib/pricing";
import { SITE } from "@/lib/kompas-data";

export default function Nieuw() {
  return <NieuwVoorstel actie={{ voor: ACTIE.voor, normaal: 995, perMaand: ACTIE.perMaand }} site={SITE} />;
}
