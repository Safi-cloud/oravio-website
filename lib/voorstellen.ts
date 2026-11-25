// Ontwerpvoorstellen die je via een tijdelijke link deelt.
// Link: https://oravio.nl/voorstel/<code>
// Pas "geldigTot" aan om een link langer of korter geldig te maken (datum en tijd, Nederlandse tijd).
// Video's staan in de map private/demos en zijn alleen via een geldige link te bekijken.

export type Voorstel = {
  code: string;
  klant: string;
  sub: string;
  video: string; // bestandsnaam in private/demos
  geldigTot: string; // ISO, bijvoorbeeld "2026-11-30T23:59:00+01:00"
  // Wat de demo laat zien
  demoLabel: string; // bijvoorbeeld "Website Start + extra's uit Zakelijk"
  basis: string[]; // onderdelen uit het basispakket
  extra: string[]; // onderdelen uit het hogere pakket
  extraUit: string; // naam van het hogere pakket, bijvoorbeeld "Zakelijk"
  // Het aanbod
  aanbodLabel: string; // bijvoorbeeld "Introductieaanbod"
  betaalt: string; // bijvoorbeeld "U betaalt het Start-tarief"
  prijs: number;
  normaal: number; // prijs van het hogere pakket
  toelichting: string;
  aanspreken?: "u" | "je"; // standaard "u"
};

export const VOORSTELLEN: Voorstel[] = [
  {
    code: "gelukkige-voet-7q2m",
    klant: "De Gelukkige Voet",
    sub: "Pedicurepraktijk in 's-Hertogenbosch",
    video: "de-gelukkige-voet.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw behandelingen en prijzen",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Afspraak aanvragen met keuze voor behandeling en moment",
      "Klachtenkiezer met advies en prijs",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Introductieaanbod",
    betaalt: "Pakket Zakelijk, voor het tarief van pakket Start",
    prijs: 399,
    normaal: 995,
    toelichting: "Wilt u later ook een eigen pagina per behandeling, dan betaalt u alleen het verschil.",
  },
  {
    code: "de-graaf-x4k9",
    klant: "Gebr. de Graaf",
    sub: "Schilderwerken en Glashandel",
    video: "gebr-de-graaf.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw diensten",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop en telefoonnummer direct in beeld",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Offerteformulier in drie stappen",
      "Kleurenkiezer voor gevel, kozijnen en deur",
      "Projecten die vertrouwen geven",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Speciale prijs",
    betaalt: "Pakket Zakelijk, voor een speciale prijs",
    prijs: 499,
    normaal: 995,
    toelichting: "Wilt u later een eigen pagina per dienst, dan betaalt u alleen het verschil.",
  },
  {
    code: "bjj-culemborg-h8r3",
    klant: "BJJ Culemborg en Capoeira4Life",
    sub: "Eén site, drie voordeuren",
    video: "bjj-capoeira.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén pagina voor BJJ, capoeira en kids",
      "Ontwerp in jouw stijl, perfect op telefoon",
      "WhatsApp-knop en contactgegevens",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Drie voordeuren: BJJ, capoeira en kids",
      "Proefles aanvragen in een paar tikken",
      "Rooster altijd actueel",
      "Beide domeinnamen komen op de juiste plek binnen",
      "Oude pagina's doorgestuurd, je houdt je plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Vriendenprijs",
    betaalt: "Pakket Zakelijk, voor een vriendenprijs",
    prijs: 499,
    aanspreken: "je",
    normaal: 995,
    toelichting: "Daarnaast jaarlijks beheer, zodat je site snel, veilig en actueel blijft.",
  },
];

export function vindVoorstel(code: string) {
  return VOORSTELLEN.find((v) => v.code === code);
}

export function isGeldig(v: Voorstel, nu = new Date()) {
  return nu.getTime() <= new Date(v.geldigTot).getTime();
}

export function resterendeTijd(v: Voorstel, nu = new Date()) {
  const ms = new Date(v.geldigTot).getTime() - nu.getTime();
  const dagen = Math.floor(ms / 86_400_000);
  const uren = Math.max(1, Math.floor((ms % 86_400_000) / 3_600_000));
  return dagen >= 1 ? `nog ${dagen} ${dagen === 1 ? "dag" : "dagen"}` : `nog ${uren} uur`;
}
