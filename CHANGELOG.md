# Changelog

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
