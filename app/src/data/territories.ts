import type { Territory } from '../store/types';

/**
 * Full territory list built from Territories.csv + GamePlaySetup.csv.
 * IPC values from Territories.csv, buildings from GamePlaySetup.csv.
 * originalOwner reflects the nation that owned the territory at game start
 * (used for USSR objective calculations and similar rules).
 */
export const initialTerritories: Territory[] = [

  // ── GERMANY ─────────────────────────────────────────────────────────────
  { id: 'berlin',         name: 'Germany (Berlin)',          type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 5,  isCapital: true,  capitalOf: 'germany', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'w_germany',      name: 'Western Germany',           type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 5,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 's_germany',      name: 'Greater Southern Germany',  type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 4,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'holland_belgium',name: 'Holland-Belgium',           type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'denmark',        name: 'Denmark',                   type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'norway',         name: 'Norway',                    type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'poland',         name: 'Poland (Warsaw)',            type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'slovakia_hungary',name: 'Slovakia-Hungary',         type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'romania',        name: 'Romania',                   type: 'land', controller: 'germany', originalOwner: 'germany', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'bulgaria',       name: 'Bulgaria',                  type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_axis' },
  { id: 'yugoslavia',     name: 'Yugoslavia',                type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },
  { id: 'greece',         name: 'Greece',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },
  { id: 'france',         name: 'France (Paris)',             type: 'land', controller: 'france', originalOwner: 'france',  ipc: 4,  isCapital: true,  capitalOf: 'france', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'normandy',       name: 'Normandy-Bordeaux',         type: 'land', controller: 'france', originalOwner: 'france',  ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 's_france',       name: 'Southern France',           type: 'land', controller: 'france', originalOwner: 'france',  ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },

  // ── ITALY ────────────────────────────────────────────────────────────────
  { id: 'rome',           name: 'Southern Italy (Rome)',     type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 4,  isCapital: true,  capitalOf: 'italy', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'n_italy',        name: 'Northern Italy',            type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 4,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'albania',        name: 'Albania',                   type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'libya',          name: 'Libya',                     type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'tobruk',         name: 'Tobruk',                    type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'it_somaliland',  name: 'Italian Somaliland',        type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'ethiopia',       name: 'Ethiopia',                  type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'sardinia',       name: 'Sardinia',                  type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'sicily',         name: 'Sicily',                    type: 'land', controller: 'italy', originalOwner: 'italy', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },

  // ── FRANCE (game-start territories still held by Free France) ────────────
  // Note: France (Paris) and Normandy are Germany-controlled above.
  // The following are Free France / unoccupied at start:
  { id: 'fr_morocco',     name: 'Morocco',                   type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_algeria',     name: 'Algeria',                   type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_tunisia',     name: 'Tunisia',                   type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_w_africa',    name: 'French West Africa',        type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_c_africa',    name: 'French Central Africa',     type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_eq_africa',   name: 'French Equatorial Africa',  type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_syria',       name: 'Syria',                     type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_indo',        name: 'French Indo-China',         type: 'land', controller: 'france', originalOwner: 'france', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'fr_madagascar',  name: 'French Madagascar',         type: 'land', controller: 'france', originalOwner: 'france', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'fr_guiana',      name: 'French Guiana',             type: 'land', controller: 'france', originalOwner: 'france', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },

  // ── JAPAN ────────────────────────────────────────────────────────────────
  { id: 'tokyo',          name: 'Japan (Tokyo)',              type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 8,  isCapital: true,  capitalOf: 'japan', isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'okinawa',        name: 'Okinawa',                   type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'iwo_jima',       name: 'Iwo Jima',                  type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'formosa',        name: 'Formosa',                   type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'korea',          name: 'Korea',                     type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'manchuria',      name: 'Manchuria',                 type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'jehol',          name: 'Jehol',                     type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'shantung',       name: 'Shantung',                  type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kiangsu',        name: 'Kiangsu',                   type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kiangsi',        name: 'Kiangsi',                   type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kwangsi',        name: 'Kwangsi',                   type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kwangtung',      name: 'Kwangtung (Hong Kong)',     type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 3, isCapital: false, isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'siam',           name: 'Siam',                      type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'palau',          name: 'Palau Island',              type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'carolines',      name: 'Caroline Islands',          type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'minor_factory', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'marianas',       name: 'Marianas',                  type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'marshall_is',    name: 'Marshall Islands',          type: 'land', controller: 'japan', originalOwner: 'japan', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── USSR ─────────────────────────────────────────────────────────────────
  { id: 'moscow',         name: 'Russia (Moscow)',            type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 3,  isCapital: true,  capitalOf: 'ussr', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'leningrad',      name: 'Novgorod (Leningrad)',       type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'stalingrad',     name: 'Volgograd (Stalingrad)',     type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'caucasus',       name: 'Caucasus',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'ukraine',        name: 'Ukraine',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'karelia',        name: 'Karelia',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'vyborg',         name: 'Vyborg',                    type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'baltic_states',  name: 'Baltic States',             type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'e_poland',       name: 'Eastern Poland',            type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'belarus',        name: 'Belarus',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'w_ukraine',      name: 'Western Ukraine',           type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'bessarabia',     name: 'Bessarabia',                type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'novgorod',       name: 'Novgorod',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'arkhangelsk',    name: 'Arkhangelsk',               type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'vologda',        name: 'Vologda',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'urals',          name: 'Urals',                     type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'smolensk',       name: 'Smolensk',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'bryansk',        name: 'Bryansk',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'rostov',         name: 'Rostov',                    type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'novosibirsk',    name: 'Novosibirsk',               type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'amur',           name: 'Amur',                      type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'buryatia',       name: 'Buryatia',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'sakha',          name: 'Sakha',                     type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'tambov',         name: 'Tambov',                    type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'turkmenistan',   name: 'Turkmenistan',              type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'kazakhstan',     name: 'Kazakhstan',                type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'samara',         name: 'Samara',                    type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'nenetsia',       name: 'Nenetsia',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'evenkiyskiy',    name: 'Evenkiyskiy',               type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'tunguska',       name: 'Tunguska',                  type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'yenisey',        name: 'Yenisey',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'yakut',          name: 'Yakut S.S.R.',              type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'siberia',        name: 'Siberia',                   type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'soviet_far_east',name: 'Soviet Far East',           type: 'land', controller: 'ussr', originalOwner: 'ussr', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── UK EUROPE ────────────────────────────────────────────────────────────
  { id: 'london',         name: 'United Kingdom (London)',    type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 6,  isCapital: true,  capitalOf: 'uk_europe', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'scotland',       name: 'Scotland',                  type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'iceland',        name: 'Iceland',                   type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'gibraltar',      name: 'Gibraltar',                 type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'malta',          name: 'Malta',                     type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'egypt',          name: 'Egypt (El Alamein)',        type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 2,  isCapital: false, isVictoryCity: true,  map: 'Europe',  buildings: [] },
  { id: 'alexandria',     name: 'Alexandria',                type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'anglo_egypt_sudan', name: 'Anglo-Egyptian Sudan',  type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 's_africa',       name: 'Union of South Africa',    type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'trans_jordan',   name: 'Trans-Jordan',              type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'gold_coast',     name: 'Gold Coast',                type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'nigeria',        name: 'Nigeria',                   type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'e_africa',       name: 'Tanganyika Territory',      type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'rhodesia',       name: 'Rhodesia',                  type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'quebec',         name: 'Quebec',                    type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'ontario',        name: 'Ontario',                   type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'w_canada_uk',    name: 'Western Canada',            type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'alberta',        name: 'Alberta/Saskatchewan/Manitoba', type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'newfoundland',   name: 'Newfoundland & Labrador',   type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'new_brunswick',  name: 'New Brunswick Nova Scotia', type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'naval_base', damage: 0 }] },
  { id: 'br_guiana',      name: 'British Guiana',            type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'belgian_congo',  name: 'Belgian Congo',             type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'sw_africa',      name: 'South West Africa',         type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'br_somaliland',  name: 'British Somaliland',        type: 'land', controller: 'uk_europe', originalOwner: 'uk_europe', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'w_india_uk',     name: 'West India',                type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },

  // ── UK PACIFIC ───────────────────────────────────────────────────────────
  { id: 'india',          name: 'India (Calcutta)',           type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 3,  isCapital: true,  capitalOf: 'uk_pacific', isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'burma',          name: 'Burma',                     type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'malaya',         name: 'Malaya',                    type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'minor_factory', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'borneo',         name: 'Borneo',                    type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 4,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'shan_state',     name: 'Shan State',                type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'ceylon',         name: 'Ceylon',                    type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'gilbert_is',     name: 'Gilbert Islands',           type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'fiji',           name: 'Fiji',                      type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'samoa',          name: 'Samoa',                     type: 'land', controller: 'uk_pacific', originalOwner: 'uk_pacific', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── USA ──────────────────────────────────────────────────────────────────
  { id: 'eastern_usa',    name: 'Eastern United States',     type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 20, isCapital: true,  capitalOf: 'usa', isVictoryCity: true,  map: 'Europe',  buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'central_usa',    name: 'Central United States',     type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 12, isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [{ type: 'minor_factory', damage: 0 }] },
  { id: 'western_usa',    name: 'Western United States',     type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 10, isCapital: false, isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'alaska',         name: 'Alaska',                    type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'hawaii',         name: 'Hawaiian Islands',          type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 3,  isCapital: false, isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'midway',         name: 'Midway',                    type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }] },
  { id: 'wake',           name: 'Wake Island',               type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }] },
  { id: 'guam',           name: 'Guam',                      type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }] },
  { id: 'philippines',    name: 'Philippine Islands',        type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 2,  isCapital: false, isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'aleutian_is',    name: 'Aleutian Islands',          type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'mexico',         name: 'Mexico',                    type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'johnston_is',    name: 'Johnston Island',           type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'line_is',        name: 'Line Islands',              type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'se_mexico',      name: 'Southeastern Mexico',       type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'c_america',      name: 'Central America',           type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },
  { id: 'greenland',      name: 'Greenland',                 type: 'land', controller: 'usa', originalOwner: 'usa', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [] },

  // ── CHINA ────────────────────────────────────────────────────────────────
  { id: 'szechwan',       name: 'Szechwan',                  type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'yunnan',         name: 'Yunnan',                    type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'hunan',          name: 'Hunan',                     type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kweichow',       name: 'Kweichow',                  type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'shensi',         name: 'Shensi',                    type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'suiyuan',        name: 'Suiyuan',                   type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'kansu',          name: 'Kansu',                     type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'tsinghai',       name: 'Tsinghai',                  type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'sikang',         name: 'Sikang',                    type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'chahar',         name: 'Chahar',                    type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'hopei',          name: 'Hopei',                     type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'anhwe',          name: 'Anhwe',                     type: 'land', controller: 'china', originalOwner: 'china', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── ANZAC ─────────────────────────────────────────────────────────────────
  { id: 'sydney',         name: 'New South Wales (Sydney)',   type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 2,  isCapital: true,  capitalOf: 'anzac', isVictoryCity: true,  map: 'Pacific', buildings: [{ type: 'major_factory', damage: 0 }, { type: 'naval_base', damage: 0 }] },
  { id: 'queensland',     name: 'Queensland',                type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'air_base', damage: 0 }, { type: 'minor_factory', damage: 0 }] },
  { id: 'new_zealand',    name: 'New Zealand',               type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [{ type: 'naval_base', damage: 0 }, { type: 'air_base', damage: 0 }] },
  { id: 'n_territory',    name: 'Northern Territory',        type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'w_australia',    name: 'Western Australia',         type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'new_guinea',     name: 'New Guinea',                type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'new_britain',    name: 'New Britain',               type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 'solomon_is',     name: 'Solomon Islands',           type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },
  { id: 's_australia',    name: 'South Australia',           type: 'land', controller: 'anzac', originalOwner: 'anzac', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [] },

  // ── NEUTRAL (Strict) ─────────────────────────────────────────────────────
  { id: 'switzerland',    name: 'Switzerland',               type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'strict' },
  { id: 'sweden',         name: 'Sweden',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 3,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'strict' },
  { id: 'turkey',         name: 'Turkey',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'strict' },

  // ── NEUTRAL (Pro Allies) ──────────────────────────────────────────────────
  { id: 'eire',           name: 'Eire',                      type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },
  { id: 'nw_persia',      name: 'Northwest Persia',          type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },
  { id: 'persia',         name: 'Persia',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },
  { id: 'e_persia',       name: 'Eastern Persia',            type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_allies' },

  // ── NEUTRAL (Pro Axis) ────────────────────────────────────────────────────
  { id: 'finland',        name: 'Finland',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_axis' },
  { id: 'iraq',           name: 'Iraq',                      type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'pro_axis' },

  // ── NEUTRAL (general) ────────────────────────────────────────────────────
  { id: 'portugal',       name: 'Portugal',                  type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'spain',          name: 'Spain',                     type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'saudi_arabia',   name: 'Saudi Arabia',              type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'afghanistan',    name: 'Afghanistan',               type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'rio_de_oro',     name: 'Rio de Oro',                type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'port_guinea',    name: 'Portuguese Guinea',         type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'sierra_leone',   name: 'Sierra Leone',              type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'liberia',        name: 'Liberia',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'angola',         name: 'Angola',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'mozambique',     name: 'Mozambique',                type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'colombia',       name: 'Colombia',                  type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'venezuela',      name: 'Venezuela',                 type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'ecuador',        name: 'Ecuador',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'peru',           name: 'Peru',                      type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'brazil',         name: 'Brazil',                    type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'bolivia',        name: 'Bolivia',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'paraguay',       name: 'Paraguay',                  type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'chile',          name: 'Chile',                     type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'argentina',      name: 'Argentina',                 type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },
  { id: 'uruguay',        name: 'Uruguay',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Europe',  buildings: [], neutralType: 'general' },

  // ── NEUTRAL (Mongolia) ────────────────────────────────────────────────────
  { id: 'olgiy',          name: 'Olgiy',                     type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
  { id: 'dzavhan',        name: 'Dzavhan',                   type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
  { id: 'ulaanbaatar',    name: 'Ulaanbaatar',               type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 1,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
  { id: 'tsagaan_olom',   name: 'Tsagaan-Olom',              type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
  { id: 'c_mongolia',     name: 'Central Mongolia',          type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 0,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
  { id: 'buyant_uhaa',    name: 'Buyant-Uhaa',               type: 'land', controller: 'neutral', originalOwner: 'neutral', ipc: 2,  isCapital: false, isVictoryCity: false, map: 'Pacific', buildings: [], neutralType: 'mongolia' },
];

export function getTerritoryIPC(territories: Territory[], controllerId: string): number {
  return territories
    .filter(t => t.controller === controllerId && t.type === 'land')
    .reduce((sum, t) => sum + t.ipc, 0);
}

export function getVictoryCities(territories: Territory[]): Territory[] {
  return territories.filter(t => t.isVictoryCity);
}

