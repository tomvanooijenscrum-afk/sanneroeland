# Sanne Roeland — fotografie

Een rustige, redactionele fotografiewebsite, geïnspireerd op de beeldpresentatie en typografie van https://www.daniloandsharon.com/. Gebouwd met gewone HTML, CSS en JavaScript.

## Bekijken

Open `index.html` in je browser. Installatie of een server is niet nodig.

## Aanpassen

- `index.html`: teksten, navigatie, afbeeldingen en bijschriften.
- `styles.css`: gedeelde kleuren en lettertypen bovenaan, daarna stijlen per onderdeel. De mobiele aanpassingen staan onderaan.
- `script.js`: mobiel menu, afbeeldingsfallbacks, fotoviewer en automatisch jaartal.
- `images/sanne-portret.jpg`: het aangeleverde originele portret van Sanne. Als een afbeeldingsbestand ontbreekt, toont de website een neutraal monogramvlak. De selectie gebruikt voorlopig hetzelfde portret in verschillende uitsneden.

Vervang de afbeeldingspaden, beschrijvingen en bijschriften in de portfolio zodra er meer eigen foto's zijn. Pas ook de tijdelijke melding in de pagina en `Tijdelijk beeld` in `script.js` aan.

## Online zetten

Upload `index.html`, `styles.css`, `script.js`, `favicon.svg` en `images/` naar je hosting. De website werkt ook in een submap.

Optioneel: `npm run build` kopieert deze bestanden naar `dist/`. De oorspronkelijke React-bestanden in `src/` zijn alleen bewaard als referentie.

Google Fonts worden via internet geladen. Zonder verbinding gebruikt de website de ingebouwde vervangende lettertypen.


## Animaties

Beweging staat standaard aan. De opening speelt één keer bij het laden. Daarna volgt elke onthulling de scrollpositie: omlaag schuiven tekst en beelden in beeld, omhoog draait hetzelfde effect vloeiend terug. Er wordt geen animatie opnieuw gestart bij het passeren van een grens.

De animatiecode staat onderaan `script.js`. `applyProgress` bepaalt de beweging en `updateScrollMotion` bepaalt de voortgang vanuit de viewport. Posities worden eerst samen gelezen, daarna worden de stijlen bijgewerkt in één animation frame. De knop onderaan speelt de opening opnieuw af. Zonder JavaScript blijft de inhoud zichtbaar.
