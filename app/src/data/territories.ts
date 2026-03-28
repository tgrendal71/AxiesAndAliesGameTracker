import type { Territory } from '../store/types';

/**
 * Key territories for the initial game state.
 * Full territory list should eventually be imported from /Territories.csv.
 * Includes all capitals, victory cities and major territories.
 */
export const initialTerritories: Territory[] = [
  // ── GERMANY ──────────────────────────────────────────────────────────────
  { id: 'berlin', name: 'Germany (Berlin)', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 10, isCapital: true, capitalOf: 'germany', isVictoryCity: true, map: 'Europe', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'w_germany', name: 'Western Germany', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 6, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'norway', name: 'Norway', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'denmark', name: 'Denmark', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'poland', name: 'Poland (Warsaw)', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'romania', name: 'Romania', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 3, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'holland_belgium', name: 'Holland-Belgium', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 's_germany', name: 'Greater Southern Germany', type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 4, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },

  // ── ITALY ─────────────────────────────────────────────────────────────────
  { id: 'rome', name: 'Southern Italy (Rome)', type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 6, isCapital: true, capitalOf: 'italy', isVictoryCity: true, map: 'Europe', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'n_italy', name: 'Northern Italy', type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 4, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'libya', name: 'Libya', type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'ethiopia', name: 'Ethiopia', type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },

  // ── JAPAN ─────────────────────────────────────────────────────────────────
  { id: 'tokyo', name: 'Japan (Tokyo)', type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 8, isCapital: true, capitalOf: 'japan', isVictoryCity: true, map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'manchuria', name: 'Manchuria', type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 3, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'kwangtung', name: 'Kwangtung', type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'french_indo', name: 'French Indo-China Thailand', type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'philippines', name: 'Philippine Islands', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 2, isCapital: false, isVictoryCity: true, map: 'Pacific', buildings: [] },
  { id: 'formosa', name: 'Formosa', type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── USSR ──────────────────────────────────────────────────────────────────
  { id: 'moscow', name: 'Moscow', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 8, isCapital: true, capitalOf: 'ussr', isVictoryCity: true, map: 'Europe', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'leningrad', name: 'Leningrad', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 4, isCapital: false, isVictoryCity: true, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'stalingrad', name: 'Stalingrad', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 3, isCapital: false, isVictoryCity: true, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'caucasus', name: 'Caucasus', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 4, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'ukraine', name: 'Ukraine', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 3, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'novgorod', name: 'Novgorod', type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },

  // ── UK EUROPE ─────────────────────────────────────────────────────────────
  { id: 'london', name: 'United Kingdom (London)', type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 8, isCapital: true, capitalOf: 'uk_europe', isVictoryCity: true, map: 'Europe', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'france', name: 'France', type: 'land', controller: 'germany', originalOwner: 'france', ipc: 6, isCapital: false, isVictoryCity: true, map: 'Europe', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'egypt', name: 'Egypt (El Alamein)', type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 4, isCapital: false, isVictoryCity: true, map: 'Europe', buildings: [] },
  { id: 'gibraltar', name: 'Gibraltar', type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [{ type: 'naval_base', damage: 0 }, { type: 'air_base', damage: 0 }] },

  // ── UK PACIFIC ────────────────────────────────────────────────────────────
  { id: 'india', name: 'India (Calcutta)', type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 8, isCapital: true, capitalOf: 'uk_pacific', isVictoryCity: true, map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0}] },
  { id: 'burma', name: 'Burma', type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'malaya', name: 'Malaya', type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'hong_kong', name: 'Hong Kong', type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 1, isCapital: false, isVictoryCity: true, map: 'Pacific', buildings: [] },

  // ── USA ───────────────────────────────────────────────────────────────────
  { id: 'eastern_usa', name: 'Eastern United States', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 20, isCapital: true, capitalOf: 'usa', isVictoryCity: true, map: 'Europe', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'central_usa', name: 'Central United States', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 12, isCapital: false, isVictoryCity: false, map: 'Europe', buildings: [] },
  { id: 'western_usa', name: 'Western United States', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 10, isCapital: false, isVictoryCity: true, map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'hawaii', name: 'Hawaiian Islands', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 3, isCapital: false, isVictoryCity: true, map: 'Pacific', buildings: [{ type: 'naval_base', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'alaska', name: 'Alaska', type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── CHINA ─────────────────────────────────────────────────────────────────
  { id: 'szechwan', name: 'Szechwan', type: 'land', controller: 'china', originalOwner: 'china', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'yunnan', name: 'Yunnan', type: 'land', controller: 'china', originalOwner: 'china', ipc: 1, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── ANZAC ─────────────────────────────────────────────────────────────────
  { id: 'sydney', name: 'New South Wales (Sydney)', type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 8, isCapital: true, capitalOf: 'anzac', isVictoryCity: true, map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'new_zealand', name: 'New Zealand', type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 2, isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'naval_base', damage: 0 }] },
];

export function getTerritoryIPC(territories: Territory[], controllerId: string): number {
  return territories
    .filter(t => t.controller === controllerId && t.type === 'land')
    .reduce((sum, t) => sum + t.ipc, 0);
}

export function getVictoryCities(territories: Territory[]): Territory[] {
  return territories.filter(t => t.isVictoryCity);
}
