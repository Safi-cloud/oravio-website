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
  pakket: string;
  prijs: string;
  punten: string[];
};

export const VOORSTELLEN: Voorstel[] = [
  {
    code: "gelukkige-voet-7q2m",
    klant: "De Gelukkige Voet",
    sub: "Pedicurepraktijk in 's-Hertogenbosch",
    video: "de-gelukkige-voet.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    pakket: "Website Start",
    prijs: "€399 eenmalig",
    punten: [
      "Eén overzichtelijke pagina met al uw behandelingen en prijzen",
      "Klachtenkiezer met advies en prijs, als introductie inbegrepen",
      "Afspraak aanvragen en WhatsApp-knop op elke pagina",
      "Uw oude pagina's worden doorgestuurd, u houdt uw plek in Google",
    ],
  },
  {
    code: "de-graaf-x4k9",
    klant: "Gebr. de Graaf",
    sub: "Schilderwerken en Glashandel",
    video: "gebr-de-graaf.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    pakket: "Website Zakelijk",
    prijs: "€995 eenmalig",
    punten: [
      "Een eigen pagina per dienst, vindbaar in uw regio",
      "Kleurenkiezer en offerteformulier in drie stappen",
      "Projecten die vertrouwen geven",
      "Uw oude pagina's worden doorgestuurd, u houdt uw plek in Google",
    ],
  },
  {
    code: "bjj-culemborg-h8r3",
    klant: "BJJ Culemborg en Capoeira4Life",
    sub: "Eén site, drie voordeuren",
    video: "bjj-capoeira.mp4",
    geldigTot: "2026-11-30T23:59:00+01:00",
    pakket: "Website Zakelijk",
    prijs: "Prijs in overleg",
    punten: [
      "BJJ, capoeira en kids elk met een eigen pagina",
      "Beide domeinnamen komen op de juiste plek binnen",
      "Proefles aanvragen in een paar tikken",
      "Rooster altijd actueel",
    ],
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
