# Axis & Allies Global 1940 — Game Tracker (ide1_alfa)

Digital spilleassistent som kjøres ved siden av det fysiske brettet.

## Kom i gang

```bash
cd app
npm install
npm run dev
```

Åpne [http://localhost:5173](http://localhost:5173)

## Struktur

```
/ (rot — datfiler og dokumentasjon)
  Territories.csv      — alle territorier og sjøsoner
  Units.csv            — alle enheter med statistikk
  GamePlaySetup.csv    — startoppsett per nasjon
  Ide1.md              — design og konsept for versjon 1
  README.md
  ToDo.md
  Prompts.log

app/ (React-applikasjon)
  src/
    store/
      types.ts         — TypeScript-typer
      gameStore.ts     — Zustand state management
    data/
      nations.ts       — nasjondata og turrekkefølge
      territories.ts   — nøkkelterritoria (kapital, seiersbyer m.fl.)
    components/
      layout/          — NavBar, Layout
    pages/
      DashboardPage    — oversikt, IPC, seiersbyer
      NationsPage      — nasjonkort med inntekt, bygninger, mål
      TerritoriesPage  — søkbar/filtrerbar territorieliste
      VictoryCitiesPage— seiersby-oversikt
      TurnTrackerPage  — fasetracker per tur
      CombatPage       — slagkalkulator med terningkasting
      HistoryPage      — hendelseslogg per runde
      SetupPage        — nytt spill / oppsett
```

## Tech-stack

- **React 18** + TypeScript
- **Vite** (bygg og dev-server)
- **Tailwind CSS** (mørk militær-tema)
- **Zustand** (state med localStorage-persistens)
- **React Router v6** (navigasjon)
- **PWA-klar** (offline support via localStorage)
