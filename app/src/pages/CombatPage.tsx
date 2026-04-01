import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { NationId, CombatUnit } from '../store/types';

// ── Unit catalogue ─────────────────────────────────────────────────────────
const UNIT_STATS: Record<string, { attack: number; defense: number }> = {
  Infantry:           { attack: 1, defense: 2 },
  Artillery:          { attack: 2, defense: 2 },
  'Mech. Infantry':   { attack: 1, defense: 2 },
  Tank:               { attack: 3, defense: 3 },
  Fighter:            { attack: 3, defense: 4 },
  'Tactical Bomber':  { attack: 3, defense: 3 },
  'Strategic Bomber': { attack: 4, defense: 1 },
  Destroyer:          { attack: 2, defense: 2 },
  Submarine:          { attack: 2, defense: 1 },
  Cruiser:            { attack: 3, defense: 3 },
  'Aircraft Carrier': { attack: 0, defense: 2 },
  Battleship:         { attack: 4, defense: 4 },
};
const UNIT_KEYS = Object.keys(UNIT_STATS);

// ── Types ──────────────────────────────────────────────────────────────────
type DefPanel  = { id: number; nationId: NationId; units: CombatUnit[] };
type RoundLog  = { attRolls: number[]; defRolls: number[]; attHits: number; defHits: number; attVals: number[]; defVals: number[] };
type Battle    = { id: number; territory: string; attNation: NationId; attUnits: CombatUnit[]; defPanels: DefPanel[]; rounds: RoundLog[] };
type Odds      = { attWin: number; defWin: number; draw: number };

let _id = 100;
const uid = () => ++_id;

// ── Helpers ────────────────────────────────────────────────────────────────
function expandAtt(units: CombatUnit[]) {
  const v: number[] = [];
  for (const u of units) for (let i = 0; i < u.quantity; i++) v.push(u.attackValue);
  return v;
}
function expandDef(units: CombatUnit[]) {
  const v: number[] = [];
  for (const u of units) for (let i = 0; i < u.quantity; i++) v.push(u.defenseValue);
  return v;
}
function rollVals(vals: number[]) {
  const rolls: number[] = [];
  let hits = 0;
  for (const v of vals) {
    const r = Math.ceil(Math.random() * 6);
    rolls.push(r);
    if (r <= v) hits++;
  }
  return { rolls, hits };
}
function expectedHits(units: CombatUnit[], isAtt: boolean) {
  let s = 0;
  for (const u of units) s += u.quantity * (isAtt ? u.attackValue : u.defenseValue) / 6;
  return s.toFixed(2);
}
function simulateOnce(attUnits: CombatUnit[], defUnits: CombatUnit[]): 'att' | 'def' | 'draw' {
  let att = expandAtt(attUnits);
  let def = expandDef(defUnits);
  let max = 50;
  while (att.length > 0 && def.length > 0 && max-- > 0) {
    let aH = 0, dH = 0;
    for (const v of att) if (Math.ceil(Math.random() * 6) <= v) aH++;
    for (const v of def) if (Math.ceil(Math.random() * 6) <= v) dH++;
    att.sort((a, b) => a - b); att.splice(0, Math.min(dH, att.length));
    def.sort((a, b) => a - b); def.splice(0, Math.min(aH, def.length));
  }
  if (att.length > 0 && def.length === 0) return 'att';
  if (def.length > 0 && att.length === 0) return 'def';
  return 'draw';
}
function computeOdds(attUnits: CombatUnit[], defUnits: CombatUnit[], trials = 2000): Odds {
  let a = 0, d = 0, dr = 0;
  for (let i = 0; i < trials; i++) {
    const r = simulateOnce(attUnits, defUnits);
    if (r === 'att') a++; else if (r === 'def') d++; else dr++;
  }
  return { attWin: Math.round(a / trials * 100), defWin: Math.round(d / trials * 100), draw: Math.round(dr / trials * 100) };
}
function makeBattle(id: number, att: NationId, def: NationId): Battle {
  return { id, territory: '', attNation: att, attUnits: [], defPanels: [{ id: uid(), nationId: def, units: [] }], rounds: [] };
}

// ── Component ──────────────────────────────────────────────────────────────
export default function CombatPage() {
  const { nations } = useGameStore();
  const n0 = nations[0]?.id as NationId;
  const n1 = nations[1]?.id as NationId;

  const [battles, setBattles]   = useState<Battle[]>([makeBattle(1, n0, n1)]);
  const [activeId, setActiveId] = useState(1);
  const [oddsMap, setOddsMap]   = useState<Record<number, Odds>>({});

  const battle      = battles.find(b => b.id === activeId)!;
  const allDefUnits = battle?.defPanels.flatMap(p => p.units) ?? [];

  const upd = (fn: (b: Battle) => Battle) =>
    setBattles(bs => bs.map(b => b.id === activeId ? fn(b) : b));

  const addBattle = () => {
    const id = uid();
    setBattles(bs => [...bs, makeBattle(id, n0, n1)]);
    setActiveId(id);
  };
  const removeBattle = (id: number) => {
    setBattles(bs => bs.filter(b => b.id !== id));
    setActiveId(prev => prev === id ? (battles.find(b => b.id !== id)?.id ?? -1) : prev);
  };

  const addAtt = (type: string) => upd(b => {
    const s = UNIT_STATS[type];
    const ex = b.attUnits.find(u => u.unitType === type);
    const attUnits = ex
      ? b.attUnits.map(u => u.unitType === type ? { ...u, quantity: u.quantity + 1 } : u)
      : [...b.attUnits, { unitType: type, quantity: 1, attackValue: s.attack, defenseValue: s.defense }];
    return { ...b, attUnits };
  });
  const rmAtt  = (type: string) => upd(b => ({ ...b, attUnits: b.attUnits.filter(u => u.unitType !== type) }));
  const qtyAtt = (type: string, d: number) => upd(b => ({
    ...b, attUnits: b.attUnits.map(u => u.unitType === type ? { ...u, quantity: Math.max(1, u.quantity + d) } : u),
  }));

  const addDefPanel   = () => {
    const free = nations.find(n => !battle.defPanels.some(p => p.nationId === n.id));
    upd(b => ({ ...b, defPanels: [...b.defPanels, { id: uid(), nationId: (free ?? nations[0]).id as NationId, units: [] }] }));
  };
  const rmDefPanel    = (pid: number) => upd(b => ({ ...b, defPanels: b.defPanels.filter(p => p.id !== pid) }));
  const chgDefNation  = (pid: number, nid: NationId) => upd(b => ({ ...b, defPanels: b.defPanels.map(p => p.id === pid ? { ...p, nationId: nid } : p) }));

  const addDef = (pid: number, type: string) => upd(b => ({
    ...b, defPanels: b.defPanels.map(p => {
      if (p.id !== pid) return p;
      const s = UNIT_STATS[type];
      const ex = p.units.find(u => u.unitType === type);
      const units = ex
        ? p.units.map(u => u.unitType === type ? { ...u, quantity: u.quantity + 1 } : u)
        : [...p.units, { unitType: type, quantity: 1, attackValue: s.attack, defenseValue: s.defense }];
      return { ...p, units };
    }),
  }));
  const rmDef  = (pid: number, type: string) => upd(b => ({ ...b, defPanels: b.defPanels.map(p => p.id !== pid ? p : { ...p, units: p.units.filter(u => u.unitType !== type) }) }));
  const qtyDef = (pid: number, type: string, d: number) => upd(b => ({
    ...b, defPanels: b.defPanels.map(p => p.id !== pid ? p : { ...p, units: p.units.map(u => u.unitType === type ? { ...u, quantity: Math.max(1, u.quantity + d) } : u) }),
  }));

  const doRound = () => {
    const attVals = expandAtt(battle.attUnits);
    const defVals = expandDef(allDefUnits);
    const att = rollVals(attVals);
    const def = rollVals(defVals);
    upd(b => ({ ...b, rounds: [...b.rounds, { attRolls: att.rolls, defRolls: def.rolls, attHits: att.hits, defHits: def.hits, attVals, defVals }] }));
  };
  const resetRounds = () => upd(b => ({ ...b, rounds: [] }));

  const calcOdds = () => {
    const o = computeOdds(battle.attUnits, allDefUnits);
    setOddsMap(m => ({ ...m, [activeId]: o }));
  };

  const attNat = nations.find(n => n.id === battle?.attNation);
  const odds   = oddsMap[activeId];
  const tagCls = 'tag bg-[#0b0f07] text-mil-muted hover:text-mil-text border border-[#2a3818] cursor-pointer text-xs';

  if (!battle) return null;

  return (
    <div className="space-y-4">

      {/* Battle tabs */}
      <div className="flex items-center gap-2 flex-wrap">
        {battles.map((b, idx) => (
          <div key={b.id} className="flex items-center">
            <button
              className={`px-3 py-1.5 text-sm font-display rounded-l-sm border transition-colors ${
                b.id === activeId
                  ? 'bg-[#2a3a10] border-mil-gold text-mil-gold'
                  : 'bg-[#0b0f07] border-[#2a3818] text-mil-muted hover:text-mil-text'
              }`}
              onClick={() => setActiveId(b.id)}
            >
              ⚔️ Slag {idx + 1}{b.territory ? ` — ${b.territory}` : ''}
            </button>
            {battles.length > 1 && (
              <button
                className="px-2 py-1.5 text-xs border border-l-0 border-[#2a3818] text-red-500 hover:text-red-300 bg-[#0b0f07] rounded-r-sm"
                onClick={() => removeBattle(b.id)}
                title="Fjern slag"
              >✕</button>
            )}
          </div>
        ))}
        <button className="btn-secondary text-xs" onClick={addBattle}>+ Legg til slag</button>
      </div>

      {/* Setup card */}
      <div className="card">
        <div className="card-header">⚔️ Slagoppsett</div>
        <div className="grid grid-cols-1 md:grid-cols-[1fr_180px_1fr] gap-4 items-start">

          {/* Attacker */}
          <div className="space-y-2">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Angriper</div>
            <select
              className="w-full bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1.5 rounded-sm"
              value={battle.attNation}
              onChange={e => upd(b => ({ ...b, attNation: e.target.value as NationId, attUnits: [] }))}
            >
              {nations.map(n => <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>)}
            </select>
            {attNat && (
              <div className="p-3 rounded-sm border space-y-1" style={{ borderColor: attNat.color, backgroundColor: attNat.colorDim + '40' }}>
                {battle.attUnits.length === 0 && <div className="text-xs text-mil-muted italic">Ingen enheter lagt til</div>}
                {battle.attUnits.map(u => (
                  <div key={u.unitType} className="flex items-center gap-1 text-xs">
                    <button className="w-5 h-5 flex items-center justify-center border border-[#2a3818] text-mil-muted hover:text-white rounded-sm" onClick={() => qtyAtt(u.unitType, -1)}>−</button>
                    <span className="w-6 text-center text-mil-gold font-bold">{u.quantity}</span>
                    <button className="w-5 h-5 flex items-center justify-center border border-[#2a3818] text-mil-muted hover:text-white rounded-sm" onClick={() => qtyAtt(u.unitType, 1)}>+</button>
                    <span className="flex-1 text-mil-text">{u.unitType}</span>
                    <span className="text-green-400 font-mono text-[10px]">A{u.attackValue}</span>
                    <button className="text-red-500 hover:text-red-300 ml-1" onClick={() => rmAtt(u.unitType)}>✕</button>
                  </div>
                ))}
                <div className="flex flex-wrap gap-1 pt-2 border-t border-[#1e2a10]">
                  {UNIT_KEYS.map(t => <button key={t} className={tagCls} onClick={() => addAtt(t)}>+{t}</button>)}
                </div>
              </div>
            )}
            {battle.attUnits.length > 0 && (
              <div className="text-xs text-mil-muted">
                Forventet treff/runde: <span className="text-mil-gold font-bold">{expectedHits(battle.attUnits, true)}</span>
              </div>
            )}
          </div>

          {/* Middle */}
          <div className="flex flex-col items-center gap-3 pt-6">
            <div className="text-3xl">⚔️</div>
            <input
              type="text"
              placeholder="Territorium..."
              value={battle.territory}
              onChange={e => upd(b => ({ ...b, territory: e.target.value }))}
              className="w-full bg-[#0b0f07] border border-[#2a3818] text-center text-mil-text text-sm px-2 py-1.5 rounded-sm"
            />
            <button
              className="btn-primary w-full text-sm"
              onClick={doRound}
              disabled={battle.attUnits.length === 0 && allDefUnits.length === 0}
            >
              🎲 Runde {battle.rounds.length + 1}
            </button>
            <button className="btn-secondary w-full text-xs" onClick={resetRounds}>Nullstill runder</button>

            {/* Odds box */}
            <div className="w-full border border-[#2a3818] rounded-sm p-2 space-y-1 bg-[#0b0f07]">
              <div className="text-xs text-mil-muted text-center uppercase tracking-wider mb-1">Sannsynlighet</div>
              {odds ? (
                <>
                  <div className="flex justify-between text-xs">
                    <span style={{ color: attNat?.textColor ?? '#ccc' }}>Angriper vinner</span>
                    <span className="font-bold text-green-400">{odds.attWin}%</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-red-400">Forsvarer vinner</span>
                    <span className="font-bold text-red-400">{odds.defWin}%</span>
                  </div>
                  {odds.draw > 0 && (
                    <div className="flex justify-between text-xs">
                      <span className="text-mil-muted">Uavgjort</span>
                      <span className="text-mil-muted">{odds.draw}%</span>
                    </div>
                  )}
                  <div className="w-full h-2 rounded-full bg-red-900 mt-1 overflow-hidden">
                    <div className="h-full bg-green-600 transition-all" style={{ width: `${odds.attWin}%` }} />
                  </div>
                </>
              ) : (
                <div className="text-xs text-mil-muted text-center italic">Ikke beregnet ennå</div>
              )}
              <button
                className="btn-secondary w-full text-xs mt-1"
                onClick={calcOdds}
                disabled={battle.attUnits.length === 0 && allDefUnits.length === 0}
              >
                📊 Beregn odds (2000 sim.)
              </button>
            </div>
          </div>

          {/* Defenders */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-xs text-mil-muted uppercase tracking-wider">Forsvarere</div>
              <button className={`${tagCls} px-2 py-0.5`} onClick={addDefPanel}>+ Legg til nasjon</button>
            </div>
            {battle.defPanels.map(panel => {
              const defNat = nations.find(n => n.id === panel.nationId);
              if (!defNat) return null;
              return (
                <div key={panel.id} className="rounded-sm border" style={{ borderColor: defNat.color }}>
                  <div className="flex items-center gap-2 px-2 py-1.5" style={{ backgroundColor: defNat.colorDim + '60' }}>
                    <select
                      className="flex-1 bg-transparent text-sm font-display border-0 outline-none cursor-pointer"
                      style={{ color: defNat.textColor }}
                      value={panel.nationId}
                      onChange={e => chgDefNation(panel.id, e.target.value as NationId)}
                    >
                      {nations.map(n => <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>)}
                    </select>
                    {battle.defPanels.length > 1 && (
                      <button className="text-red-500 hover:text-red-300 text-xs" onClick={() => rmDefPanel(panel.id)}>✕</button>
                    )}
                  </div>
                  <div className="p-2 space-y-1">
                    {panel.units.length === 0 && <div className="text-xs text-mil-muted italic">Ingen enheter</div>}
                    {panel.units.map(u => (
                      <div key={u.unitType} className="flex items-center gap-1 text-xs">
                        <button className="w-5 h-5 flex items-center justify-center border border-[#2a3818] text-mil-muted hover:text-white rounded-sm" onClick={() => qtyDef(panel.id, u.unitType, -1)}>−</button>
                        <span className="w-6 text-center text-mil-gold font-bold">{u.quantity}</span>
                        <button className="w-5 h-5 flex items-center justify-center border border-[#2a3818] text-mil-muted hover:text-white rounded-sm" onClick={() => qtyDef(panel.id, u.unitType, 1)}>+</button>
                        <span className="flex-1 text-mil-text">{u.unitType}</span>
                        <span className="text-blue-400 font-mono text-[10px]">D{u.defenseValue}</span>
                        <button className="text-red-500 hover:text-red-300 ml-1" onClick={() => rmDef(panel.id, u.unitType)}>✕</button>
                      </div>
                    ))}
                    <div className="flex flex-wrap gap-1 pt-1 border-t border-[#1e2a10]">
                      {UNIT_KEYS.map(t => <button key={t} className={tagCls} onClick={() => addDef(panel.id, t)}>+{t}</button>)}
                    </div>
                  </div>
                </div>
              );
            })}
            {allDefUnits.length > 0 && (
              <div className="text-xs text-mil-muted">
                Forventet treff/runde: <span className="text-mil-gold font-bold">{expectedHits(allDefUnits, false)}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Combat log */}
      {battle.rounds.length > 0 && (
        <div className="card">
          <div className="card-header">📊 Kamplogg{battle.territory ? ` — ${battle.territory}` : ''}</div>
          <div className="space-y-2">
            {battle.rounds.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-3 p-3 bg-[#0f1509] rounded-sm border border-[#2a3818]">
                <div>
                  <div className="text-xs mb-1" style={{ color: attNat?.textColor ?? '#ccc' }}>
                    {attNat?.emoji} Angriper — Runde {i + 1}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {r.attRolls.map((roll, j) => (
                      <span key={j} className={`w-7 h-7 flex items-center justify-center rounded-sm text-sm font-bold border ${
                        roll <= (r.attVals[j] ?? 0) ? 'border-green-600 text-green-400 bg-green-950' : 'border-[#2a3818] text-mil-muted'
                      }`}>{roll}</span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-green-400">{r.attHits} treff</div>
                </div>
                <div>
                  <div className="text-xs mb-1 text-blue-300">🛡 Forsvarere — Runde {i + 1}</div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {r.defRolls.map((roll, j) => (
                      <span key={j} className={`w-7 h-7 flex items-center justify-center rounded-sm text-sm font-bold border ${
                        roll <= (r.defVals[j] ?? 0) ? 'border-blue-600 text-blue-400 bg-blue-950' : 'border-[#2a3818] text-mil-muted'
                      }`}>{roll}</span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-blue-400">{r.defHits} treff</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
