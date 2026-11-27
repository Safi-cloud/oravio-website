# Changelog

## 1.2.2 (27 november 2026)

- Naam overal Xaverio in plaats van Casper: begroeting in het Kompas, WhatsApp-berichten en bevestigingsmail van de intake.

## 1.2.1 (27 november 2026)

- VAPID-sleutels worden opgeschoond (spaties, aanhalingstekens) en gecontroleerd; het Kompas zegt precies wat er mis is, ook als ze zijn omgewisseld.
- Meldingenkaart op mobiel netjes uitgelijnd; ntfy alleen zichtbaar als het is ingesteld of in de Android-app.

## 1.2.0 (27 november 2026)

- Android-app Kompas (apk): opent direct het Kompas, licht ontwerp, eigen icoon. De app opent `/kompas/start`, die doorstuurt naar het Kompas.
- Meldingen via de ntfy-app (`NTFY_TOPIC`): werkt naast de Android-app en op elk apparaat, ook als het Kompas dicht is.
- Instellingen toont in de app alleen wat daar werkt.

## 1.1.0 (27 november 2026)

- Kompas is nu een installeerbare app (PWA): eigen icoon, opent zonder adresbalk, snelkoppelingen naar Nieuw, Voorstellen en Intakes.
- Pushmeldingen op je telefoon: voorstel geopend, video afgekeken, akkoord en nieuwe intake. Tik op de melding en je zit direct bij die klant.
- Aanzetten en testen via Kompas > Instellingen. Vereist `VAPID_PUBLIC_KEY` en `VAPID_PRIVATE_KEY`.

## 1.0.1 (27 november 2026)

- Alle gedachtestreepjes uit de zichtbare teksten gehaald: vervangen door een punt, komma of dubbele punt. Paginatitels gebruiken nu "Pagina | Oravio".

## 1.0.0 (27 november 2026)

Nieuw: het Kompas op `/kompas`, je eigen cockpit (vervangt `/overzicht`).

- Inloggen met `OVERZICHT_SLEUTEL`, 30 dagen onthouden per apparaat, met beveiligde cookie en een limiet op foute pogingen.
- Vandaag: kerncijfers, "Nu bellen" met de warmste leads, funnel van link tot klant, pijplijn, taken en bijna verlopen links, live activiteit en snel delen.
- Voorstellen: zoeken en filteren, warmte en status per klant, link kopiëren, WhatsApp met kant-en-klaar bericht en verlengen met één tik.
- Per voorstel: leadstatus (Nieuw tot Klant), contactgegevens, volgende actie met datum, notities met snelknoppen en logboek; alle teksten en prijzen aanpassen; geldigheid zetten; demovideo uploaden of vervangen; verbergen of verwijderen; alle bezoeken.
- Nieuw voorstel in een minuut: sjablonen voor salon, vakman en zorg, u- of je-vorm, video uploaden, direct delen via WhatsApp.
- Intakes: alle aangeleverde gegevens, logo en foto's op één plek, kopiëren en afvinken.
- Instellingen: status van Blob, Resend en wachtwoord, prijzen en handige links.
- Voorstellen komen nu uit de code plus alles uit het Kompas (opgeslagen in Vercel Blob); video's uit het Kompas worden via de bestaande beveiligde videolink afgespeeld.
- Op het Kompas staan de gewone kop en voet van de site niet; het apparaat telt als eigenaar, dus eigen bezoeken tellen niet mee.

## 0.9.0 (27 november 2026)

- Kijkstatistieken per voorstel: aantal keer geopend, video gestart, hoe ver gekeken (25, 50, 75, 100%) en afgekeken, per bezoek en apparaat. Opgeslagen in Vercel Blob.
- Meldingsmails tonen nu de stand tot nu toe, bijvoorbeeld "3× geopend · video 2× gestart · 1× afgekeken".
- Nieuw overzicht op `/overzicht?sleutel=...` met per voorstel een warmtelabel (Bekeken, Warm, Heet, Akkoord) en alle bezoeken. Vereist `OVERZICHT_SLEUTEL`.
- Wie het overzicht opent, wordt op dat apparaat als eigenaar gemarkeerd: eigen bezoeken tellen niet mee.

## 0.8.0 (27 november 2026)

- Nieuw blok "Dit zit er allemaal in": wat wel en niet in de actie zit, met vaste prijzen voor extra werk. Op de prijzenpagina en in elk actievoorstel. Inhoud staat in `ACTIE_SCOPE` in `lib/pricing.ts`.
- Nieuwe intakepagina `/intake` en `/intake/<voorstelcode>`: zes stappen voor gegevens, domein, openingstijden, prijzen, logo, foto's (tot 10), teksten en kleuren. Met live voorproefje, automatisch bewaren op het apparaat en een feestelijke bevestiging.
- Foto's gaan rechtstreeks naar Vercel Blob en worden in de browser verkleind. Vereist `BLOB_READ_WRITE_TOKEN`.
- Na het versturen krijgt Oravio een mail met alle gegevens en foto's, en de klant een bevestiging.
- Na "Ja, ik wil dit" in een voorstel staat direct de knop "Materialen aanleveren".
- Afspraken uitgebreid: materialen binnen 14 dagen, anders stockfoto's.

## 0.7.0 (26 november 2026)

- Tijdelijke actie: Website Start voor €199 in plaats van €399, met verplicht Beheer Zorgeloos (€35 per maand via automatische incasso, eerste 12 maanden). Aan en uit te zetten via `ACTIE` in `lib/pricing.ts`.
- Prijzenpagina: actiebanner in de hero, bouwen en beheer staan nu samen in elke pakketkaart, en het beheer staat direct onder de pakketten in een lichte stijl.
- Rekenhulp kent de actie: bij Start staat Zorgeloos vast en zie je de actieprijs.
- Voorwaarden en veelgestelde vragen uitgebreid met de actie.
- Alle voorstellen behalve de vriendenprijs: Zakelijk voor €199 plus Beheer Zorgeloos €35 per maand.

## 0.6.7 (26 november 2026)

- Elk voorstel toont onder de video een blok "Straks met uw eigen foto's en video's": de demo gebruikt voorbeeldbeelden, bij de bouw verwerken we de eigen beelden van de klant, op maat en geoptimaliseerd, inbegrepen in de prijs.

## 0.6.6 (26 november 2026)

- Zeven nieuwe voorstellen met demovideo, geldig tot en met 3 december 2026: Sluijter & van Gemert, Magnifiek Kappers, Fysio073, Janet Loeffen Fysiotherapie, Van Lith Schilders, Salon Lux en BY WENDYS (de laatste twee in de je-vorm).

## 0.6.5 (25 november 2026)

- Voorstel Gebr. de Graaf: speciale prijs €499 voor pakket Zakelijk.

## 0.6.4 (25 november 2026)

- Voorstelpagina: nieuwe prijsonthulling "Wat u in de video ziet, is pakket Zakelijk", met de normale prijs die wordt doorgestreept en een teller die afloopt naar de aanbiedingsprijs, plus besparing en kortingspercentage.
- "Wat u krijgt" toont nu eerst de onderdelen uit Zakelijk, daarna de basis.
- Vriendenprijs naar €499. Per voorstel instelbaar of de klant met "u" of "je" wordt aangesproken.

## 0.6.3 (25 november 2026)

- Na versturen van het contactformulier of een voorstelreactie scrolt de pagina vanzelf naar de bevestiging, zodat die op mobiel bovenaan in beeld staat.

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
