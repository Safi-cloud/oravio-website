# Changelog

## 0.6.2 (25 november 2026)

- Voorstelpagina toont eerst wat in de demo zit: de basis plus een gemarkeerd blok "Extra uit pakket Zakelijk".
- Daarnaast het aanbod: lager tarief, met de normale prijs van het hogere pakket doorgestreept en de besparing.

## 0.6.1 (25 november 2026)

- Bedrijfsadres (Vijfde Buitenpepers 14, 5231 GL 's-Hertogenbosch) op de contactpagina en in de footer.
- Bedrijfsgegevens voor Google (Organization-schema met adres en KvK) op elke pagina.

## 0.6.0 (25 november 2026)

- Persoonlijke voorstelpagina's op /voorstel/<code> met de demovideo, het voorgestelde pakket en een vervaldatum. Na de vervaldatum toont de pagina "verlopen" en is de video niet meer op te vragen.
- Video's staan in private/demos en worden alleen via een geldige link gestreamd (niet te downloaden via de speler).
- Mail naar contact@oravio.nl als de klant het voorstel opent, de video helemaal bekijkt of op "Ja, ik wil dit" klikt.
- Voorstellen beheren in lib/voorstellen.ts. Voorstelpagina's worden niet door Google geïndexeerd.

## 0.5.4 (25 november 2026)

- Plus: "Klaar voor AI-zoekmachines zoals ChatGPT" vervangen door het concrete "Vraag-en-antwoordblokken per dienst, met FAQ-schema voor Google".

## 0.5.3 (25 november 2026)

- KvK-nummer 67717187 in de footer van elke pagina en op de contactpagina.

## 0.5.2 (25 november 2026)

- WhatsApp-knop standaard in elk pakket; WhatsApp Business inrichten als extra (€75); WhatsApp-automatisering onder maatwerk.
- Rekentool op /prijzen: kies website, beheer en extra's en zie direct het totaal van het eerste jaar.
- Bewegende kleurrand om het populairste pakket.

## 0.5.1 (25 november 2026)

- Website Start naar €399 als instapprijs. Zakelijk tot 8 pagina's, Plus tot 15 pagina's.
- Per pakket concreet benoemd wat erin zit (Search Console, LocalBusiness-schema, reviews, meting zonder cookiebanner).
- Nieuwe sectie "In elke website" en een eerlijke vergelijking met een gangbare WordPress-site op /prijzen.

## 0.5.0 (25 november 2026)

- Nieuwe pagina /prijzen: websitepakketten Start, Zakelijk en Plus, maatwerk, beheerpakketten met schakelaar per maand of per jaar, vergelijkingstabel, extra's, afspraken en veelgestelde vragen.
- Alle prijzen staan centraal in lib/pricing.ts.
- Pakketten op /websites tonen nu prijzen en verwijzen naar /prijzen.
- "Prijzen" toegevoegd aan menu, footer en sitemap.
- KvK- en btw-nummer in de footer via lib/company.ts (verschijnt zodra ingevuld).

## 0.4.2 (25 november 2026)

- Spamval in het contactformulier hernoemd. Het oude veld heette "Website" en kon door automatisch invullen van de browser (Safari, wachtwoordmanagers) gevuld worden, waardoor echte berichten stil werden genegeerd. Genegeerde berichten worden nu gelogd.

## 0.4.1 (25 november 2026)

- Nieuwe bevestiging na het versturen van het contactformulier: geanimeerd vinkje, samenvatting van het bericht, "Wat er nu gebeurt" in drie stappen en knoppen naar de juiste vervolgpagina.

## 0.4.0 (25 november 2026)

- Contactformulier verstuurt nu via Resend (`/api/contact`) in plaats van via het mailprogramma van de bezoeker.
- Bevestiging "Bedankt" na versturen, nette HTML-mail naar contact@oravio.nl met beantwoorden naar de bezoeker.
- Bescherming tegen spam: onzichtbaar honeypot-veld en maximaal 5 berichten per IP per 10 minuten.
- Zolang `RESEND_API_KEY` niet is ingesteld, valt het formulier automatisch terug op de oude mailto-werking.
- Nodig in Vercel: `RESEND_API_KEY` (optioneel `CONTACT_FROM`, `CONTACT_TO`).

## 0.3.0 (25 november 2026)

- Websites op maat staat nu op zichzelf: geen beloftes meer over doorgroeien naar webshop, verhuur of boekingen.
- Derde pakket is nu **Website Plus** (meer pagina's, meertalig, Google Bedrijfsprofiel, halfjaarlijkse check-up).
- Veelgestelde vraag over uitbreiden naar webshop vervangen door "Kan ik later nog dingen laten toevoegen?".
- Homepage-blok heet nu **Ook voor een nieuwe website.**
- Contactformulier: optie "Website én platform" verwijderd.

## 0.2.0 (25 november 2026)

- Nieuwe pagina **Websites op maat** (`/websites`): hero met geanimeerde bouwstraat, analyse, werkwijze, beheer op jaarbasis, pakketten en veelgestelde vragen.
- Menu: link **Websites** toegevoegd tussen Platform en Branches.
- Homepage: blok **Nog geen platform nodig? Begin met een website.** boven het traject.
- Footer: nieuwe kolom **Diensten**.
- Contactformulier: keuzeveld **Waar gaat het over?**; via `/contact?onderwerp=website` staat "Een website op maat" alvast geselecteerd.
- Sitemap: `/websites` toegevoegd.
- Versie in `package.json` naar 0.2.0.
