# Codex spec: ruumikliima.ee landing page

Build a simple, responsive, modern one-page website for **ruumikliima.ee**.

The website promotes one clear service:

**7-päevane koduõhu uuring**
**Kodu sisekliima ja õhukvaliteedi indikatiivne uuring sensorimõõtmiste põhjal.**

The service is for private homes, apartments, row houses, summer houses, and small residential spaces. Sensors are placed in the home for one week. After the measurement period, the customer receives a clear PDF-style report, visual charts, practical findings, and a CSV dataset.

The website must be simple, credible, and practical. It must not sound like a medical, legal, certified, or official inspection service.

---

# 1. Technical requirements

Build as a simple static website.

Use:

* HTML
* CSS
* vanilla JavaScript only if needed
* no backend
* no framework unless absolutely necessary
* mobile-first responsive design
* fast loading
* accessible semantic HTML
* clean section-based structure
* easy-to-edit text
* suitable for deployment to Netlify, Cloudflare Pages, GitHub Pages, Vercel static hosting, or similar

Create these files:

* `index.html`
* `styles.css`
* `script.js`

Use `script.js` only for:

* mobile menu
* FAQ accordion
* smooth scrolling if needed

Do not use:

* external tracking scripts
* heavy animations
* complex dependencies
* stock-photo dependencies
* fake testimonials
* medical claims
* certification claims

---

# 2. Visual style

The design should feel:

* trustworthy
* calm
* Nordic/Baltic
* practical
* clean
* residential, not corporate
* slightly technical, but easy to understand

Avoid:

* alarmist health visuals
* “smart home gadget” style
* dark cyber/AI look
* hospital/medical look
* overdesigned startup SaaS look

Use clean visual blocks, cards, simple icons, and a CSS-based home/sensor diagram.

## Suggested color palette

```css
:root {
  --color-primary: #0A2540;
  --color-primary-soft: #123A5A;
  --color-accent: #F28C28;
  --color-bg: #F7F9FC;
  --color-white: #FFFFFF;
  --color-text: #172033;
  --color-muted: #5D6B7A;
  --color-border: #E3E8EF;
  --color-card: #FFFFFF;
  --color-soft-blue: #EAF2FA;
  --color-soft-orange: #FFF4E5;
  --color-warning-soft: #FFF4E5;
}
```

## Typography

Use either:

* system font stack, or
* Inter from Google Fonts

Suggested CSS:

```css
body {
  font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}
```

Headings should be clear and strong.
Body text should be readable and not too small.

Suggested base font size:

* body: 16px
* line-height: 1.6
* h1: 42–56px desktop, 34–40px mobile
* h2: 30–40px desktop, 26–32px mobile

---

# 3. Page structure

Single-page landing page with anchor navigation.

Sections:

1. Header / navigation
2. Hero
3. Problem
4. What is measured
5. How the service works
6. What the customer receives
7. Example findings
8. Price / one service package
9. Limitations / disclaimer
10. FAQ
11. Contact / booking CTA
12. Footer

Use semantic sections:

```html
<header>
<main>
  <section id="teenus">
  <section id="moodikud">
  <section id="kuidas-tootab">
  <section id="raport">
  <section id="hind">
  <section id="kkk">
  <section id="kontakt">
</main>
<footer>
```

---

# 4. Header

Create a sticky or semi-sticky header.

Logo text:

**ruumikliima.ee**

Small tagline:

**Sisekliima mõõdistus kodudele**

Navigation links:

* Teenus
* Mõõdikud
* Kuidas töötab
* Raport
* Hind
* KKK
* Kontakt

CTA button:

**Küsi uuringut**

On mobile:

* show logo
* show menu button
* collapse navigation into dropdown or vertical menu
* keep CTA visible inside mobile menu

Header should have a white or slightly translucent background, subtle border bottom, and enough padding.

---

# 5. Hero section

Hero should be the strongest section. Use a two-column layout on desktop and single-column on mobile.

## Hero headline

**Vaata, mis sinu kodu õhus tegelikult toimub**

## Hero subheading

**7-päevane koduõhu uuring aitab näha CO₂, temperatuuri, õhuniiskuse ja peenosakeste mustreid sinu kodus. Paigutame andurid valitud ruumidesse, kogume andmed ja koostame selge raporti koos graafikute, andmestiku ja praktiliste soovitustega.**

## Primary CTA

**Küsi 7-päevast uuringut**

## Secondary CTA

**Vaata, mida mõõdame**

## Hero trust bullets

Display as small checkmark bullets or compact pills:

* 7 päeva mõõtmist
* Kuni 5 mõõtepunkti
* CO₂, temperatuur, niiskus, PM2.5/PM10
* PDF-raport + graafikud + CSV-andmestik
* Praktilised soovitused

## Hero visual

Create a CSS-based visual card showing a simplified home floor plan with sensor dots.

Rooms:

* Magamistuba
* Elutuba
* Köök
* Lastetuba
* Esik / probleemne ruum

Sensor dots should look like small circles or pins.

Next to the floor plan, show a neutral metric label strip, not button-like cards:

* CO₂
* °C
* RH%
* PM2.5
* PM10

Add a small visual summary card inside or next to the mockup:

**Näidisleid:**
Magamistoa CO₂ tõuseb öösel suletud uksega kõrgele.

Keep this visual illustrative. Do not show fake exact numbers unless clearly marked as example.

---

# 6. Problem section

Section id: `teenus`

## Section title

**Kui kodus tundub õhk halb, on raske teada, miks**

## Section intro

Paljud kodused sisekliima probleemid ei ole silmaga nähtavad. Magamistuba võib öösel muutuda umbseks, niiskus võib püsida liiga kõrge, köögis võivad tekkida peenosakeste tipud või ruumide temperatuur võib olla väga ebaühtlane. Ilma mõõtmiseta jääb sageli ebaselgeks, kas põhjus on ventilatsioonis, kasutusharjumustes, kütmises, niiskuses, toiduvalmistamises või välisõhus.

Create three cards.

## Card 1

Title:

**Umbne magamistuba**

Text:

CO₂ tase võib öösel tõusta kõrgele, eriti kui uksed ja aknad on suletud ning õhuvahetus on nõrk.

## Card 2

Title:

**Niiskus ja hallitusrisk**

Text:

Liiga kõrge või kõikuv õhuniiskus võib viidata vajadusele parandada ventilatsiooni, kütmist või külmade pindade olukorda.

## Card 3

Title:

**Peenosakeste tipud**

Text:

Toiduvalmistamine, küünlad, kamin, ahi, koristamine või välisõhk võivad tekitada lühiajalisi PM2.5 ja PM10 tõuse.

Add a small note under cards:

**Mõõtmise eesmärk ei ole hirmutada, vaid teha nähtamatud mustrid nähtavaks.**

---

# 7. What is measured section

Section id: `moodikud`

## Section title

**Mida mõõdame**

## Section intro

Uuring keskendub neljale praktilisele näitajale, mis aitavad mõista kodu õhuvahetust, mugavust, niiskuskoormust ja osakeste mustreid.

Create four metric cards.

## Card 1: CO₂

Title:

**CO₂**

Subtitle:

**Õhuvahetuse ja ventilatsiooni indikaator**

Text:

CO₂ aitab hinnata, kas ruumis on inimeste kohaloleku ajal piisav õhuvahetus. Eriti hästi tuleb see välja magamistubades, lastetubades ja kodukontoris.

Example signal:

**Näide:** magamistoa CO₂ tõuseb öösel järsult, kui uks ja aken on suletud.

## Card 2: Temperatuur

Title:

**Temperatuur**

Subtitle:

**Ruumide mugavus ja stabiilsus**

Text:

Temperatuuri mõõtmine näitab, kas toad on liiga jahedad, ülekuumenevad või erinevad üksteisest märgatavalt.

Example signal:

**Näide:** üks tuba on püsivalt jahedam kui ülejäänud kodu.

## Card 3: Õhuniiskus

Title:

**Õhuniiskus**

Subtitle:

**Kuivuse, niiskuse ja kondensatsiooniriski indikaator**

Text:

Õhuniiskuse mustrid aitavad märgata liiga kuiva õhku, liigset niiskuskoormust ja tingimusi, mis võivad soodustada kondensatsiooni või hallitusriski.

Example signal:

**Näide:** põhjapoolne tuba püsib öösiti kõrgema suhtelise õhuniiskusega.

## Card 4: PM2.5 / PM10

Title:

**PM2.5 / PM10**

Subtitle:

**Peenosakeste mustrid ja tipud**

Text:

Peenosakeste mõõtmine aitab näha, millal ja kus tekivad osakeste tõusud, näiteks toiduvalmistamise, küünalde, ahju, kamina, koristamise või välisõhu mõjul.

Example signal:

**Näide:** köögis tekib praadimise ajal lühiajaline PM2.5 tõus.

## Note under metric cards

**Mõõtmised on indikatiivsed ja mõeldud sisekliima mustrite mõistmiseks. Need ei asenda akrediteeritud laborimõõtmist, ametlikku õhukvaliteedi hindamist, ehitusekspertiisi ega meditsiinilist hinnangut.**

---

# 8. How it works section

Section id: `kuidas-tootab`

## Section title

**Kuidas 7-päevane koduõhu uuring käib**

Create a four-step process.

## Step 1

Title:

**1. Lühike eelküsimustik**

Text:

Täpsustame kodu suuruse, ruumide arvu, peamised mured ja sobiva mõõtmisperioodi.

## Step 2

Title:

**2. Andurite paigaldus**

Text:

Paigutame andurid valitud ruumidesse: näiteks magamistuppa, elutuppa, kööki, lastetuppa ja probleemsemasse ruumi.

## Step 3

Title:

**3. 7 päeva mõõtmist**

Text:

Andurid koguvad andmeid tavapärase koduse elu käigus. Soovi korral saab klient märkida üles akende avamise, toiduvalmistamise, kütmise, koristamise, külalised ja muud sündmused.

## Step 4

Title:

**4. Raport ja selgitus**

Text:

Koostame selge raporti, visuaalsed graafikud, ruumide võrdluse ja CSV-andmestiku. Vajadusel teeme kuni 30-minutilise selgituskõne.

Add a small horizontal timeline if easy:

**Päev 1: paigaldus või isepaigaldus → Päevad 1-7: mõõtmine ligikaudu iga 5 min järel → Päev 8: andmete kogumine → Päev 9: raport**

---

# 9. What customer receives section

Section id: `raport`

## Section title

**Mida saad pärast mõõtmist**

Use a two-column layout.

Left side: visual mock report card.
Right side: bullet list.

## Mock report title

**Koduõhu raport: 7-päevane sisekliima ülevaade**

## Mock report example rows

Use small cards or rows:

* **Magamistuba:** CO₂ tõus öösel
* **Köök:** PM2.5 tipud toiduvalmistamisel
* **Elutuba:** stabiilne temperatuur
* **Põhjapoolne tuba:** kõrgem suhteline õhuniiskus
* **Soovitus:** testida õhuvahetuse parandamist öisel ajal

Make clear that this is an example.

## Right-side bullet list

Title:

**Raport sisaldab:**

Bullets:

* kokkuvõtet peamistest leidudest;
* ruumide võrdlust;
* magamistoa öise CO₂ profiili analüüsi;
* temperatuuri ja õhuniiskuse graafikuid;
* PM2.5/PM10 tõusude ajajoont;
* praktilisi soovitusi;
* mõõtmiste piirangute selgitust;
* CSV-andmestikku edasiseks kasutamiseks.

Add a small callout:

**Raporti eesmärk on anda arusaadav vastus: mis ruumides toimub, millal probleem tekib ja mida oleks mõistlik edasi proovida.**

---

# 10. Example findings section

## Section title

**Näited leidudest, mida uuring võib näidata**

Create four cards.

## Finding 1

Title:

**Magamistoa CO₂ püsib öösel kõrge**

Text:

Võimalik tähendus: õhuvahetus on magamise ajal nõrk, eriti suletud ukse ja aknaga.

Possible action:

**Võimalik tegevus:** testida ukse avatuna hoidmist, akna mikrotuulutust või ventilatsiooni seadistust.

## Finding 2

Title:

**Köögis tekivad toiduvalmistamisel peenosakeste tipud**

Text:

Võimalik tähendus: õhupuhasti või tuulutus ei vii osakesi piisavalt kiiresti välja.

Possible action:

**Võimalik tegevus:** kasutada õhupuhastit pikemalt, tuulutada pärast praadimist või vähendada suitsu- ja põlemisallikaid.

## Finding 3

Title:

**Ühes ruumis püsib niiskus teistest kõrgem**

Text:

Võimalik tähendus: ruumi ventilatsioon, kasutus, pesukuivatus, õhu liikumine või külmad pinnad vajavad tähelepanu.

Possible action:

**Võimalik tegevus:** parandada õhu liikumist, jälgida niiskusallikaid või vajadusel kontrollida külmasildu.

## Finding 4

Title:

**Ruumide temperatuur erineb palju**

Text:

Võimalik tähendus: kütte, õhu liikumise või ruumide kasutuse tasakaal on ebaühtlane.

Possible action:

**Võimalik tegevus:** kontrollida radiaatoreid, termostaate, uste avatust ja õhu liikumist.

---

# 11. Price / one service package section

Section id: `hind`

Use only one service package. Do not show three packages.

## Section title

**7-päevane koduõhu uuring**

## Section intro

Ühe nädala mõõtmine annab hea ülevaate kodu tavapärastest mustritest: tööpäevad, nädalavahetus, magamine, toiduvalmistamine, tuulutamine ja ruumide kasutus. Teenus sobib korterile, eramajale, ridaelamule või suvilale.

Create one large highlighted pricing calculator card.

## Pricing calculator

Label:

**Hinnakalkulaator**

Title:

**7-päevane koduõhu uuring**

Base model:

* 1 mõõtepunkt = 1 mõõteseade
* 1 mõõteseade maksab 50 € / 7 päeva
* isepaigaldus postiga: +0 €
* meie paigaldus ja äravõtmine: +200 €
* meie paigaldus on mandri-Eesti piires, välja arvatud saared

Short description:

Vali, mitu mõõtepunkti kodus korraga vaja on ja kas paigaldad seadmed ise või soovid paigaldust meie poolt.

## Calculator controls

* mõõtepunktide arvu slider ja number input
* paigaldusviisi valik: isepaigaldus postiga või meie paigaldus ja äravõtmine
* automaatne hinnajaotus: mõõteseadmed, paigaldus, kokku
* CTA koostab valitud konfiguratsiooniga hinnapäringu

CTA button:

**Küsi selle valikuga pakkumist**

## Small note under pricing card

Kalkulaator arvestab 7-päevase mõõteperioodiga. Raport, graafikud ja CSV-andmestik koostatakse valitud mõõtepunktide põhjal.

---

# 12. FAQ section

Section id: `kkk`

Use accordion-style FAQ. If JavaScript is not used, display all answers openly.

## Section title

**Korduma kippuvad küsimused**

## FAQ 1

Question:

**Kas see on ametlik mõõtmine?**

Answer:

Ei. Tegemist on indikatiivse uuringuga, mis aitab mõista kodu sisekliima ja õhukvaliteedi mustreid. See ei ole akrediteeritud laborimõõtmine ega ametlik vastavushindamine.

## FAQ 2

Question:

**Kui kaua mõõtmine kestab?**

Answer:

Tavaliselt 7 päeva. Ühe nädala mõõtmine annab parema ülevaate kui mõnetunnine või ühepäevane mõõtmine, sest siis on näha nii tööpäevade kui nädalavahetuse mustrid.

## FAQ 3

Question:

**Kas andurid salvestavad heli või pilti?**

Answer:

Ei. Teenus kasutab keskkonnaandureid, mis mõõdavad näiteks CO₂ taset, temperatuuri, õhuniiskust ja peenosakesi. Heli, pilti ega vestlusi ei salvestata.

## FAQ 4

Question:

**Kas saan teada, kas mul on hallitus?**

Answer:

Teenuse abil saab hinnata niiskuse ja temperatuuri mustreid, mis võivad hallitusriski soodustada. Hallituse olemasolu, liigi või ehitusliku põhjuse kinnitamiseks on vaja eraldi ekspertiisi.

## FAQ 5

Question:

**Kas mõõtmine sobib korterisse?**

Answer:

Jah. Teenus sobib nii korterisse, eramajja, ridaelamusse kui ka suvilasse. Korteris on eriti kasulik vaadata magamistuba, elutuba, kööki ja probleemseid ruume.

## FAQ 6

Question:

**Mida ma raportiga peale hakkan?**

Answer:

Raport aitab otsustada, kas piisab lihtsatest kasutus- ja tuulutamismuutustest, ventilatsiooni seadistuse kontrollist, õhupuhasti kasutamisest või tuleks kaasata spetsialist.

## FAQ 7

Question:

**Kas ma saan ka toorandmed?**

Answer:

Jah. Uuringuga saab kaasa CSV-andmestiku ning lühikese selgituse, mida andmeveerud tähendavad.

## FAQ 8

Question:

**Kas mõõtmine häirib kodust elu?**

Answer:

Üldiselt mitte. Andurid paigutatakse ruumidesse nähtavale ja turvalisele kohale ning need koguvad andmeid automaatselt. Tavapärane elu peaks mõõtmise ajal jätkuma võimalikult loomulikult.

---

# 14. Contact / booking CTA section

Section id: `kontakt`

## Section title

**Soovid teada, mis sinu kodu õhus toimub?**

## Text

Kirjelda lühidalt oma kodu, ruumide arvu ja peamist muret. Vastame ning pakume sobiva mõõtmisplaani.

## Contact form fields

Create a simple contact form UI.

Fields:

1. Nimi
2. E-post
3. Telefon
4. Linn / piirkond
5. Kodu tüüp

   * korter
   * eramaja
   * ridaelamu
   * suvila
   * muu
6. Ligikaudne pindala
7. Ruumide arv
8. Peamine mure
9. Mõõtepunktide ja paigalduse eelistus

   * Soovin sobiva arvu mõõtepunkte koos üle täpsustada
   * Soovin isepaigaldust postiga
   * Soovin meiepoolset paigaldust ja äravõtmist
   * Kodus on rohkem kui 5 mõõtepunkti vaja
   * Soovin lisaks teist PM2.5/PM10 mõõtepunkti
   * Soovin hiljem kordusmõõtmist
   * Ei oska veel öelda
10. Consent checkbox:

**Mõistan, et tegemist on indikatiivse uuringuga, mitte ametliku mõõtmise, sertifikaadi või ekspertiisiga.**

## Backend handling

Since there is no backend, implement the form in one of these ways:

Preferred simple option:

* Use `mailto:info@ruumikliima.ee`
* Generate prefilled email subject and body from form fields if possible with JavaScript

Fallback option:

* Show static form UI
* On submit, show a message:

**Aitäh. Vormi ühendamine e-postiga lisatakse hiljem. Seni kirjuta otse: [info@ruumikliima.ee](mailto:info@ruumikliima.ee)**

## Direct contact info

Show:

**E-post:** [info@ruumikliima.ee](mailto:info@ruumikliima.ee)
**Vastus:** tavaliselt 1 tööpäeva jooksul

CTA button:

**Saada päring**

---

# 15. Footer

Footer content:

## Brand

**ruumikliima.ee**

## Tagline

**Kodu sisekliima ja õhukvaliteedi indikatiivne uuring sensorimõõtmiste põhjal.**

## Footer links

* Teenus
* Mõõdikud
* Kuidas töötab
* Hind
* KKK
* Kontakt

## Footer legal note

Mõõtmised on indikatiivsed ega asenda akrediteeritud laborimõõtmist, ametlikku õhukvaliteedi hindamist, meditsiinilist hinnangut, hallituse ekspertiisi ega ehitusekspertiisi.

## Copyright

**© 2026 ruumikliima.ee**

---

# 16. SEO metadata

Set page title:

**Ruumikliima.ee – 7-päevane kodu sisekliima ja õhukvaliteedi uuring**

Meta description:

**7-päevane kodu sisekliima ja õhukvaliteedi indikatiivne uuring sensoritega. Mõõdame CO₂, temperatuuri, õhuniiskust ja PM2.5/PM10 peenosakesi ning koostame selge raporti.**

Suggested keywords to include naturally in content:

* kodu sisekliima
* kodu õhukvaliteet
* CO₂ mõõtmine kodus
* õhuniiskuse mõõtmine
* peenosakesed kodus
* PM2.5 kodus
* PM10 kodus
* hallitusrisk
* ventilatsiooni kontroll
* koduõhu uuring
* sisekliima mõõdistus

Add Open Graph metadata:

```html
<meta property="og:title" content="Ruumikliima.ee – 7-päevane koduõhu uuring">
<meta property="og:description" content="Indikatiivne sisekliima ja õhukvaliteedi uuring sensoritega: CO₂, temperatuur, õhuniiskus ja PM2.5/PM10.">
<meta property="og:type" content="website">
<meta property="og:url" content="https://ruumikliima.ee">
```

Add Twitter/X card metadata:

```html
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Ruumikliima.ee – 7-päevane koduõhu uuring">
<meta name="twitter:description" content="Selge raport kodu CO₂, temperatuuri, õhuniiskuse ja peenosakeste mustritest.">
```

---

# 17. Copywriting tone rules

Use simple Estonian.

The tone should be:

* calm
* clear
* practical
* trustworthy
* non-alarmist
* transparent about limitations

Use these words:

* indikatiivne uuring
* indikatiivne uuring
* sensorimõõtmised
* mustrid
* võimalik probleemkoht
* praktilised soovitused
* aitab otsustada
* mõõtepunkt
* ruumide võrdlus
* koduõhu uuring

Avoid these words:

* sertifitseeritud
* ametlik
* tõendab
* diagnoosib
* garanteerib
* meditsiiniline diagnoos
* vastavushindamine
* ekspertiis
* laboritase
* juriidiline tõend

Do not say:

* “Me tõendame, et kodu on tervislik.”
* “Me diagnoosime hallituse.”
* “Me kontrollime vastavust seadusele.”
* “Meie mõõtmine sobib vaidluseks.”
* “Meie sensorid annavad ametliku õhukvaliteedi hinnangu.”

Use instead:

* “aitab näha mustreid”
* “võib viidata probleemkohale”
* “annab praktilise ülevaate”
* “vajadusel soovitame pöörduda spetsialisti poole”

---

# 18. Frontend behavior

## Smooth scroll

Anchor links should scroll smoothly.

## FAQ accordion

FAQ questions should expand/collapse.

Requirements:

* accessible buttons
* visible focus states
* keyboard usable
* first FAQ can be open by default or all closed

## Mobile menu

If using a hamburger menu:

* button must be accessible
* menu opens/closes clearly
* clicking a nav link closes menu
* no layout jump

## CTA behavior

All CTA buttons should scroll to the contact section.

Buttons:

* Küsi uuringut
* Küsi 7-päevast uuringut
* Saada päring

---

# 19. Responsive requirements

Desktop:

* max content width around 1120–1200px
* two-column layout for hero and report sections
* card grids for metric cards and example findings
* single large pricing card centered or in split layout

Tablet:

* reduce spacing
* two-column cards where possible

Mobile:

* single-column layout
* large readable buttons
* no tiny text
* no horizontal scrolling
* pricing card must remain clear
* form fields full width
* hero visual stacked below text

---

# 20. Accessibility requirements

Use:

* semantic headings in correct order
* sufficient color contrast
* focus styles for links/buttons/form fields
* alt text for any images
* labels for all form fields
* buttons for FAQ accordions, not clickable divs
* `aria-expanded` for FAQ buttons if using accordion
* `aria-controls` where relevant

Do not rely only on color to communicate meaning.

---

# 21. Suggested HTML skeleton

Use this structure:

```html
<!DOCTYPE html>
<html lang="et">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ruumikliima.ee – 7-päevane kodu sisekliima ja õhukvaliteedi uuring</title>
  <meta name="description" content="7-päevane kodu sisekliima ja õhukvaliteedi indikatiivne uuring sensoritega. Mõõdame CO₂, temperatuuri, õhuniiskust ja PM2.5/PM10 peenosakesi ning koostame selge raporti.">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <header class="site-header">
    <!-- logo, nav, CTA -->
  </header>

  <main>
    <section class="hero">
      <!-- hero text and visual -->
    </section>

    <section id="teenus">
      <!-- problem section -->
    </section>

    <section id="moodikud">
      <!-- what is measured -->
    </section>

    <section id="kuidas-tootab">
      <!-- steps -->
    </section>

    <section id="raport">
      <!-- report output -->
    </section>

    <section id="naited">
      <!-- example findings -->
    </section>

    <section id="hind">
      <!-- one pricing package -->
    </section>

    <section id="piirang">
      <!-- disclaimer -->
    </section>

    <section id="kkk">
      <!-- FAQ -->
    </section>

    <section id="kontakt">
      <!-- contact form -->
    </section>
  </main>

  <footer>
    <!-- footer -->
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

---

# 22. Acceptance criteria

The page is complete when:

* it loads as a static site;
* it looks professional on desktop and mobile;
* it has one clear pricing calculator;
* calculator price updates from measurement point count and installation choice;
* all major sections are present;
* CTA buttons either scroll to contact section or open a relevant email draft;
* FAQ works or is readable without JavaScript;
* contact form is present;
* text is in Estonian;
* page does not claim official, certified, medical, or legal measurement;
* visual style is calm, clean, trustworthy, and practical;
* hero clearly communicates what is measured and what the customer receives;
* page can be deployed without backend.
