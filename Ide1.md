# Ide – Axis & Allies Global 1940 Tracker App

> Tenkt fra perspektiv til en spillutvikler. Målet er en digital "hjelper" på nettbrett/PC
> som kjøres ved siden av brettet – ikke en digital kopi av spillet.

---

## Konsept

Appen er en **digital spilleassistent** for Axis & Allies Global 1940. Den erstatter alle
papirlapper, kalkulasjoner og løse markører. Brettet og brikkene er fortsatt fysisk –
appen tar seg av tall, regler, historikk og fremdrift.

**Tre grunntanker:**
1. Alltid vite hvem sin tur det er og hvilken fase
2. Alltid vite nøyaktig IPC-balanse for alle nasjoner
3. Rask og enkel oppdatering uten å forstyrre spillet

---

## Teknologistack (anbefalt)

| Lag           | Valg                        | Begrunnelse                                 |
|---------------|-----------------------------|---------------------------------------------|
| Frontend      | React + TypeScript          | God komponentstruktur, stort community      |
| Styling       | Tailwind CSS                | Rask og konsistent styling                  |
| State         | Zustand                     | Enkel global state uten mye boilerplate     |
| Lagring       | localStorage / IndexedDB    | Offline, ingen server nødvendig             |
| Kart          | SVG (statisk eller D3.js)   | Klikbart kart over territorier              |
| Build         | Vite                        | Rask utvikling og bygg                      |
| Deploy        | GitHub Pages / Vercel       | Gratis, fungerer fra repo                   |
| App-form      | PWA (Progressive Web App)   | Kan installeres på nettbrett, offline       |

---

## Nasjoner og farger

| Nasjon           | Side   | Farge (HEX)  | Emoji |
|------------------|--------|--------------|-------|
| Germany          | Akse   | `#4a4a2a`    | 🔘    |
| Italy            | Akse   | `#7a6a3a`    | 🟤    |
| Japan            | Akse   | `#c8a035`    | 🟡    |
| USSR             | Alliert| `#8b1a1a`    | 🔴    |
| UK (Europa)      | Alliert| `#2a4a8a`    | 🔵    |
| UK (Stillehavet) | Alliert| `#3a6aaa`    | 🔵    |
| USA              | Alliert| `#2a6a2a`    | 🟢    |
| Kina             | Alliert| `#aa3a2a`    | 🟠    |
| ANZAC            | Alliert| `#5a8a3a`    | 🟩    |
| Frankrike        | Alliert| `#6a3a8a`    | 🟣    |

---

## Sidestruktur (navigasjon)

```
┌──────────────────────────────────────────────────────────┐
│  🎖  AXIS & ALLIES GLOBAL 1940 TRACKER                   │
│──────────────────────────────────────────────────────────│
│  📊 Oversikt  🌍 Nasjoner  🗺 Territorier  🏆 Seiersbyer │
│  📜 Historikk  ⚔ Slag  ⚙ Oppsett  📖 Regler             │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 1 – Oversikt (Dashboard)

Vises alltid øverst. Gir rask oversikt over spilltilstand.

```
┌──────────────────────────────────────────────────────────┐
│  RUNDE: 3   |  TUR: 🔘 GERMANY  |  FASE: ✈ Combat Move  │
│──────────────────────────────────────────────────────────│
│                                                          │
│  AKSEMAKTER                  ALLIERTE                    │
│  ┌─────────────────────┐    ┌─────────────────────┐     │
│  │ 🔘 Germany   52 IPC │    │ 🔴 USSR      38 IPC │     │
│  │ 🟤 Italy     18 IPC │    │ 🔵 UK (Eu)   31 IPC │     │
│  │ 🟡 Japan     45 IPC │    │ 🔵 UK (Pac)  12 IPC │     │
│  │                     │    │ 🟢 USA       52 IPC │     │
│  │  TOTALT: 115 IPC    │    │ 🟠 Kina       8 IPC │     │
│  └─────────────────────┘    │ 🟩 ANZAC     14 IPC │     │
│                              │                     │     │
│                              │  TOTALT: 155 IPC   │     │
│                              └─────────────────────┘     │
│                                                          │
│  SEIERSBYER:  Akse 4 / 8    Allierte 12 / 12            │
│  ┌──────────────────────────────────────────────┐        │
│  │  ●●●●○○○○  Akse trenger 3 byer til seier     │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  [ NESTE FASE →]           [ NESTE NASJON ⏭ ]           │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 2 – Nasjoner

Velg nasjon fra faneliste. Hver nasjon har egne kort.

```
┌──────────────────────────────────────────────────────────┐
│  🔘 Germany                                              │
│  ─────────────────────────────────────────────────────   │
│  IPC-balanse: 52        Territorier kontrollert: 14      │
│                                                          │
│  ┌──────────────────────┐  ┌──────────────────────┐     │
│  │ INNTEKT DENNE RUNDEN │  │ BYGNINGER             │     │
│  │ Territorier: +48     │  │ 🏭 Berlin     [ok]   │     │
│  │ Bonuser:     + 5     │  │ 🏭 W. Germany [💥💥] │     │
│  │ Konvoi tap:  - 3     │  │ ✈  Norway     [ok]   │     │
│  │ ─────────────────    │  │ ⚓ Kiel        [ok]  │     │
│  │ TOTALT:     +50      │  └──────────────────────┘     │
│  └──────────────────────┘                               │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │ NASJONALE MÅL                                │        │
│  │ ✅ Kontroller Frankrike            (+5 IPC)  │        │
│  │ ✅ Kontroller Benelux              (+3 IPC)  │        │
│  │ ☐  Kontroller Leningrad            (+3 IPC)  │        │
│  │ ☐  Kontroller Stalingrad           (+3 IPC)  │        │
│  └──────────────────────────────────────────────┘        │
│                                                          │
│  ┌──────────────────────────────────────────────┐        │
│  │ KJØPTE ENHETER (Fase 1)                      │        │
│  │ Infantry x3 (9 IPC) | Tank x2 (12 IPC)      │        │
│  │ Totalt brukt: 21 IPC  |  Igjen: 31 IPC       │        │
│  └──────────────────────────────────────────────┘        │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 3 – Territorier

Liste med filter. Klikk på territorium for å endre kontroll eller legge til bygning.

```
┌──────────────────────────────────────────────────────────┐
│  TERRITORIER                                             │
│  Filtrer: [Alle ▼]  [Nasjon: Alle ▼]  [Akse/Alliert ▼]  │
│  Søk: [                    ]                            │
│  ─────────────────────────────────────────────────────   │
│  Navn              Kontroll     IPC  Bygninger           │
│  ─────────────────────────────────────────────────────   │
│  Berlin            🔘 Germany    10  🏭★  ✈             │
│  France (Paris)    🔘 Germany     6  🏭                  │
│  Stalingrad        🔴 USSR        3                      │
│  Eastern USA       🟢 USA        20  🏭★                 │
│  Norway            🔘 Germany     2  ✈                   │
│  ...                                                     │
│                                                          │
│  Totale IPC – Akse: 115  |  Allierte: 155               │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 4 – Slag (Combat Resolver)

Hjelpeverktøy for å gjennomføre kamp. Kast terning digitalt eller manuelt.

```
┌──────────────────────────────────────────────────────────┐
│  ⚔  SLAG  –  Norway                                     │
│  ─────────────────────────────────────────────────────   │
│  ANGRIPER: 🔘 Germany        FORSVARER: 🔵 UK           │
│                                                          │
│  ┌───────────────────┐       ┌───────────────────┐      │
│  │ Infantry     x3   │       │ Infantry     x2   │      │
│  │ Tank         x1   │       │ Fighter      x1   │      │
│  │ Fighter      x2   │       │                   │      │
│  │ ─────────────     │       │ ─────────────     │      │
│  │ Angrepsverdi: 14  │       │ Forsvarsverdi: 6  │      │
│  └───────────────────┘       └───────────────────┘      │
│                                                          │
│  RUNDE 1                                                 │
│  Angriper kaster: [5][3][1][2][6][4] → 3 treff          │
│  Forsvarer kaster: [4][1][2]         → 2 treff           │
│                                                          │
│  [ 🎲 KAST TERNING ]  [ NESTE RUNDE ]  [ RETREAT ]      │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 5 – Tur-tracker (Order of Play)

Visuell fremgang gjennom alle fasene for aktiv nasjon.

```
┌──────────────────────────────────────────────────────────┐
│  TUR-TRACKER  –  🔘 Germany  –  Runde 3                 │
│  ─────────────────────────────────────────────────────   │
│                                                          │
│  ✅ 1️⃣  Purchase & Repair Units                          │
│      Kjøpt: Inf x3, Tank x2  –  Brukt: 21 IPC           │
│                                                          │
│  ▶  2️⃣  Combat Move                          ← AKTIV    │
│      Velg enheter og mål for angrep                      │
│                                                          │
│  ○  🚀  Rockets (valgfri)                               │
│  ○  3️⃣  Conduct Combat                                  │
│  ○  4️⃣  Noncombat Move                                  │
│  ○  5️⃣  Mobilize New Units                              │
│  ○  6️⃣  Collect Income                                  │
│  ○  💵  Conduct Convoy Disruptions                      │
│                                                          │
│  [ ← TILBAKE ]                    [ NESTE FASE → ]      │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 6 – Historikk

Logg over hva som skjedde i hver runde. Nyttig for tvister og for analyse etterpå.

```
┌──────────────────────────────────────────────────────────┐
│  HISTORIKK                                               │
│  ─────────────────────────────────────────────────────   │
│  ▼ Runde 3                                              │
│    🔘 Germany:  Angrep Norway → Seier. IPC: 52 → 54     │
│    🟡 Japan:    Angrep Phillippines → Seier. IPC: 45     │
│    🔴 USSR:     Forsterket Stalingrad. IPC: 38 → 41      │
│    ...                                                   │
│  ▼ Runde 2                                              │
│    ...                                                   │
└──────────────────────────────────────────────────────────┘
```

---

## Skjerm 7 – Oppsett (nytt spill)

Konfigurasjon av nytt spill. Velg hvilke regler som er aktive.

```
┌──────────────────────────────────────────────────────────┐
│  NYTT SPILL – OPPSETT                                    │
│  ─────────────────────────────────────────────────────   │
│  Scenario:   [Global 1940 Second Edition ▼]              │
│  Antall runder maks: [  ∞  ]                             │
│                                                          │
│  Ekstra regler (valgfrie):                               │
│  ☑  Research & Development                               │
│  ☑  Nasjonale mål (National Objectives)                  │
│  ☐  Tobruk-regelen                                       │
│                                                          │
│  Spillere:                                               │
│  🔘 Germany:   [ Spiller 1         ]                     │
│  🟡 Japan:     [ Spiller 2         ]                     │
│  🔴 USSR:      [ Spiller 3         ]                     │
│  ...                                                     │
│                                                          │
│  [ START SPILL ]                                         │
└──────────────────────────────────────────────────────────┘
```

---

## Databaser / State-struktur (forenklet)

```
GameState
├── round: number
├── activeNation: NationId
├── activePhase: Phase
├── nations: Nation[]
│   ├── id, name, color, side (Axis/Allied)
│   ├── ipc: number
│   ├── territories: TerritoryId[]
│   ├── nationalObjectives: Objective[]
│   └── buildings: Building[]
├── territories: Territory[]
│   ├── id, name, ipcValue, controller
│   ├── type: land / sea
│   └── buildings: Building[]
├── purchases: Purchase[]          ← fase 1
├── combats: CombatLog[]           ← fase 3
├── history: RoundSummary[]
└── settings: GameSettings
```

---

## Steg for å komme i gang

1. **Vibe-koding av grunnstruktur** – oppsett, nasjoneroversikt, IPC-tracker
2. **Territorier og kontroll** – liste med filter og klikk for å endre eier
3. **Tur-tracker** – fasene for aktiv nasjon, med knapper for fremgang
4. **Bygninger og skade** – fabrikkskade, air base, naval base
5. **Nasjonale mål** – automatisk beregning av IPC-bonuser
6. **Slag-kalkulator** – terningkasting og tapshåndtering
7. **Historikk-logg** – hva skjedde i runden
8. **R&D (Research & Development)** – valgfri regel

---

> *"Det perfekte er det godes fiende – start med en IPC-kalkulator og et tur-system,
> og bygg videre derfra."*
