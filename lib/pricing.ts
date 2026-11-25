// Eén bron voor alle prijzen op de site. Pas hier aan, dan verandert het overal.
// Alle bedragen exclusief 21% btw.

export type WebsitePackage = {
  id: string;
  name: string;
  price: number;
  tag: string;
  forWho: string;
  featured?: boolean;
  items: string[];
};

export const WEBSITE_PACKAGES: WebsitePackage[] = [
  {
    id: "start",
    name: "Start",
    price: 399,
    tag: "Instapprijs",
    forWho: "Voor zzp'ers en starters die snel en professioneel online willen.",
    items: [
      "One-pager met diensten, over jou, reviews en contact",
      "Ontwerp op maat in jouw kleuren en met je logo",
      "Contactformulier met spambeveiliging, rechtstreeks in je mailbox",
      "WhatsApp-knop: klanten appen je met één tik",
      "Google-basis: titels, sitemap en Search Console",
      "Bedrijfsgegevens voor Google (LocalBusiness-schema)",
      "1 correctieronde, live binnen 1 week",
    ],
  },
  {
    id: "zakelijk",
    name: "Zakelijk",
    price: 995,
    tag: "Meest gekozen",
    featured: true,
    forWho: "Voor lokale ondernemers die gevonden willen worden en aanvragen willen binnenhalen.",
    items: [
      "Alles uit Start",
      "Tot 8 pagina's, bijvoorbeeld een pagina per dienst",
      "Teksten door ons geschreven",
      "Lokale SEO: zoekwoorden per pagina en Google Bedrijfsprofiel",
      "Offerteformulier, aanvragen direct in je mailbox",
      "Google-reviews op je website",
      "Meting van aanvragen, zonder cookiebanner",
      "Doorverwijzingen vanaf je oude site",
      "2 correctierondes, live in 2 tot 3 weken",
    ],
  },
  {
    id: "plus",
    name: "Plus",
    price: 1695,
    tag: "Uitgebreid",
    forWho: "Voor bedrijven met meerdere diensten of werkgebieden.",
    items: [
      "Alles uit Zakelijk",
      "Tot 15 pagina's",
      "Aparte pagina per dienst én per werkgebied",
      "Projecten, nieuws of portfolio",
      "Eén extra taal inbegrepen",
      "Vraag-en-antwoordblokken per dienst, met FAQ-schema voor Google",
      "Google Bedrijfsprofiel volledig ingericht",
      "3 correctierondes, live in 3 tot 4 weken",
    ],
  },
];

// Wat in elke website zit, ongeacht het pakket.
export const STANDARD = [
  { title: "Razendsnel", body: "Gebouwd met Next.js, dezelfde techniek die ook Nike en Netflix gebruiken. Pagina's laden in een oogwenk." },
  { title: "Geen plugins, geen lekken", body: "Geen verouderde plugins die gehackt kunnen worden. Minder storingen, minder zorgen." },
  { title: "Wereldwijd netwerk", body: "Je site staat op servers dicht bij je bezoekers, ook bij drukte." },
  { title: "Geen cookiebanner nodig", body: "We meten zonder tracking-cookies. Rustiger voor je bezoeker, netjes volgens de AVG." },
  { title: "Direct bereikbaar via WhatsApp", body: "Een WhatsApp-knop op elke pagina. Klanten appen je met één tik, de drempel is laag." },
  { title: "Beveiligd met SSL", body: "Het slotje in de adresbalk, automatisch verlengd." },
  { title: "Jouw domein, jouw gegevens", body: "Je domeinnaam staat op jouw naam en aanvragen komen rechtstreeks bij jou binnen." },
];

// Eerlijke vergelijking met een gangbare WordPress-site.
export const VERGELIJKING: { label: string; oravio: string; wordpress: string }[] = [
  { label: "Laadsnelheid", oravio: "Zeer snel, vooraf opgebouwde pagina's", wordpress: "Afhankelijk van thema en plugins" },
  { label: "Plugins bijhouden", oravio: "Niet nodig", wordpress: "Doorlopend, anders kwetsbaar" },
  { label: "Gevoeligheid voor hacks", oravio: "Zeer klein, geen database of inlogpagina", wordpress: "Groter, vooral via verouderde plugins" },
  { label: "Cookiebanner", oravio: "Niet nodig", wordpress: "Vaak wel, door plugins en statistieken" },
  { label: "Zelf teksten aanpassen", oravio: "Via ons, inbegrepen in beheer", wordpress: "Zelf, via een beheeromgeving" },
];

export const MAATWERK = {
  name: "Maatwerk",
  from: 2500,
  body: "Online reserveren, koppelingen met je planning of boekhouding, een klantportaal, WhatsApp-automatisering of een webshop. Je krijgt vooraf een vaste offerte.",
};

export type BeheerPlan = {
  id: string;
  name: string;
  perYear: number;
  perMonth: number;
  tag: string;
  featured?: boolean;
  body: string;
};

export const BEHEER_PLANS: BeheerPlan[] = [
  { id: "basis", name: "Basis", perYear: 240, perMonth: 20, tag: "Essentieel", body: "Je site draait snel, veilig en altijd up-to-date." },
  { id: "zorgeloos", name: "Zorgeloos", perYear: 420, perMonth: 35, tag: "Meest gekozen", featured: true, body: "Wijzigingen gewoon doorgeven, wij regelen het." },
  { id: "groei", name: "Groei", perYear: 780, perMonth: 65, tag: "Actief", body: "Je site wordt elk kwartaal beter en beter vindbaar." },
];

// Vergelijkingstabel beheer: true = inbegrepen, false = niet, string = toelichting.
export const BEHEER_FEATURES: { label: string; values: [boolean | string, boolean | string, boolean | string] }[] = [
  { label: "Snelle hosting op een wereldwijd netwerk", values: [true, true, true] },
  { label: "SSL-certificaat en beveiligingsupdates", values: [true, true, true] },
  { label: "Dagelijkse back-ups", values: [true, true, true] },
  { label: "Uptime-bewaking", values: [true, true, true] },
  { label: "Contactformulier en mailaflevering bewaakt", values: [true, true, true] },
  { label: "Kleine wijzigingen (tekst, foto's, openingstijden)", values: ["€65 per uur", "Tot 4 uur per jaar", "Tot 1 uur per maand"] },
  { label: "Reactietijd op een wijziging", values: ["5 werkdagen", "2 werkdagen", "1 werkdag"] },
  { label: "Check-up snelheid en vindbaarheid", values: [false, "Jaarlijks", "Elk kwartaal, met rapport"] },
  { label: "Google Bedrijfsprofiel bijhouden", values: [false, false, true] },
];

export const EXTRAS: { label: string; price: string }[] = [
  { label: "Extra pagina", price: "€95" },
  { label: "Teksten schrijven", price: "€75 per pagina" },
  { label: "Extra taal (Start en Zakelijk)", price: "€195 per taal" },
  { label: "Google Bedrijfsprofiel inrichten", price: "€95" },
  { label: "Zakelijke e-mail op eigen domein instellen", price: "€45" },
  { label: "WhatsApp Business inrichten (profiel, welkomstbericht, snelle antwoorden)", price: "€75" },
  { label: "Logo opfrissen", price: "vanaf €195" },
  { label: "Bestaande website verhuizen", price: "vanaf €95" },
  { label: "Domeinnaam .nl", price: "€15 per jaar" },
  { label: "Spoedlevering binnen 5 werkdagen", price: "+25%" },
  { label: "Werk buiten pakket", price: "€65 per uur" },
];

export const TERMS: string[] = [
  "Het ontwerpvoorstel met demovideo is gratis en vrijblijvend.",
  "Websitebouw: 50% bij akkoord, 50% bij oplevering.",
  "Beheer wordt per jaar vooraf gefactureerd en is jaarlijks opzegbaar, tot 1 maand voor het einde van het jaar.",
  "Elke website draait op onze hosting en heeft minimaal Beheer Basis.",
  "Je domeinnaam staat op jouw naam.",
  "Stop je met beheer, dan zetten we je website over naar een andere partij voor een vast bedrag van €150.",
];

export function euro(n: number) {
  return `€${n.toLocaleString("nl-NL")}`;
}
