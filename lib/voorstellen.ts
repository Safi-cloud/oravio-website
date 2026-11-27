// Ontwerpvoorstellen die je via een tijdelijke link deelt.
// Link: https://oravio.nl/voorstel/<code>
// Pas "geldigTot" aan om een link langer of korter geldig te maken (datum en tijd, Nederlandse tijd).
// Video's staan in de map private/demos en zijn alleen via een geldige link te bekijken.

export type Voorstel = {
  code: string;
  klant: string;
  sub: string;
  video: string; // bestandsnaam in private/demos (leeg als videoUrl is gezet)
  videoUrl?: string; // video in Vercel Blob, geüpload via het Kompas
  eigen?: boolean; // aangemaakt in het Kompas
  verborgen?: boolean; // verborgen via het Kompas
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

// Basislijst in de code. Wijzigingen en nieuwe voorstellen uit het Kompas komen hier bovenop (zie lib/voorstellen-live.ts).
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
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
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
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
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
  {
    code: "sluijter-van-gemert-p3v8",
    klant: "Sluijter & van Gemert",
    sub: "Schilderwerken in 's-Hertogenbosch",
    video: "sluijter-van-gemert.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw diensten",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Offertesysteem in vier stappen met directe prijsindicatie",
      "Voor en na schuifje dat uw vakwerk laat zien",
      "Projecten die vertrouwen geven",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    toelichting: "Wilt u later een eigen pagina per dienst, dan betaalt u alleen het verschil.",
  },
  {
    code: "magnifiek-kappers-k7d2",
    klant: "Magnifiek Kappers",
    sub: "Kapsalon in 's-Hertogenbosch",
    video: "magnifiek-kappers.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw behandelingen en prijzen",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Online afspraak in drie stappen: behandeling, dag en tijd",
      "Kleuradvies waarin klanten tinten vergelijken",
      "Uw specials en producten mooi in beeld",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    toelichting: "Wilt u later een eigen pagina per behandeling, dan betaalt u alleen het verschil.",
  },
  {
    code: "fysio073-r5n6",
    klant: "Fysio073",
    sub: "Fysiotherapie in 's-Hertogenbosch",
    video: "fysio073.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw behandelingen en specialisaties",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Klikbaar lichaam: patiënt wijst de klacht aan en ziet de passende behandeling",
      "Uw team en specialisaties per therapeut",
      "Intake aanvragen met keuze voor een moment",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    toelichting: "Wilt u later een eigen pagina per specialisatie, dan betaalt u alleen het verschil.",
  },
  {
    code: "janet-loeffen-w2h4",
    klant: "Janet Loeffen Fysiotherapie",
    sub: "Fysiotherapie in Vught",
    video: "janet-loeffen.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw behandelingen",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven, in uw eigen woorden aangevuld",
      "Klachtencheck in drie vragen met direct persoonlijk advies",
      "Afspraak aanvragen vanuit het advies",
      "Werkwijze in vier heldere stappen",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    toelichting: "Uw eigen gegevens, foto's en behandelingen vullen we samen in voordat de site live gaat.",
  },
  {
    code: "van-lith-schilders-m9c3",
    klant: "Van Lith Schilders",
    sub: "Schildersbedrijf sinds 1926, Den Bosch",
    video: "van-lith-schilders.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al uw diensten",
      "Ontwerp in uw eigen stijl, perfect op telefoon",
      "Telefoonnummer en contactgegevens direct in beeld",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Eigen ingang per doelgroep: particulier, zakelijk, VvE, monumenten en industrie",
      "Familiegeschiedenis als interactieve tijdlijn",
      "Projectaanvraag voor particulier en zakelijk",
      "Uw oude pagina's doorgestuurd, u houdt uw plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    toelichting: "Wilt u later een eigen pagina per sector, dan betaalt u alleen het verschil.",
  },
  {
    code: "salon-lux-t6j8",
    klant: "Salon Lux",
    sub: "Beauty en wellness in Den Bosch",
    video: "salon-lux.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al je behandelingen",
      "Ontwerp in jouw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Klanten stellen zelf hun wellnessmoment samen en kiezen dag en tijd",
      "Duobehandeling als eigen keuze",
      "Lux Cosmetics mooi in beeld",
      "Je oude pagina's doorgestuurd, je houdt je plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    aanspreken: "je",
    toelichting: "Wil je later een eigen pagina per behandeling, dan betaal je alleen het verschil.",
  },
  {
    code: "by-wendys-f4q7",
    klant: "BY WENDYS Hair Artist",
    sub: "Cut, color en extensions in Rosmalen",
    video: "by-wendys.mp4",
    geldigTot: "2026-12-03T23:59:00+01:00",
    demoLabel: "Website Zakelijk",
    basis: [
      "Eén overzichtelijke pagina met al je specialismen",
      "Ontwerp in jouw eigen stijl, perfect op telefoon",
      "WhatsApp-knop, contactgegevens en openingstijden",
      "Basis voor Google: titels, sitemap en bedrijfsgegevens",
    ],
    extra: [
      "Teksten door ons geschreven",
      "Extensions-schuifje: klanten zien direct lengte, volume en kleur",
      "Terugbelverzoek in een paar tikken, passend bij werken op afspraak",
      "Jouw werkwijze van consult tot nazorg",
      "Je oude pagina's doorgestuurd, je houdt je plek in Google",
    ],
    extraUit: "Zakelijk",
    aanbodLabel: "Tijdelijke actie",
    betaalt: "Pakket Zakelijk, voor de actieprijs van Start",
    prijs: 199,
    normaal: 995,
    aanspreken: "je",
    toelichting: "Wil je later een eigen pagina per specialisme, dan betaal je alleen het verschil.",
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
