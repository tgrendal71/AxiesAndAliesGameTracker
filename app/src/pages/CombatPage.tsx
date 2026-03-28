import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { NationId, CombatUnit } from '../store/types';

const UNIT_STATS: Record<string, { attack: number; defense: number; cost: number }> = {
  Infantry:           { attack: 1, defense: 2, cost: 3 },
  Artillery:          { attack: 2, defense: 2, cost: 4 },
  'Mech. Infantry':   { attack: 1, defense: 2, cost: 4 },
  Tank:               { attack: 3, defense: 3, cost: 6 },
  Fighter:            { attack: 3, defense: 4, cost: 10 },
  'Tactical Bomber':  { attack: 3, defense: 3, cost: 11 },
  'Strategic Bomber': { attack: 4, defense: 1, cost: 12 },
  Destroyer:          { attack: 2, defense: 2, cost: 8 },
  Submarine:          { attack: 2, defense: 1, cost: 6 },
  Cruiser:            { attack: 3, defense: 3, cost: 12 },
  'Aircraft Carrier': { attack: 0, defense: 2, cost: 16 },
  Battleship:         { attack: 4, defense: 4, cost: 20 },
};

function rollDice(count: number, hitValue: number): number {
  let hits = 0;
  for (let i = 0; i < count; i++) {
    if (Math.ceil(Math.random() * 6) <= hitValue) hits++;
  }
  return hits;
}

function calcHits(units: CombatUnit[], isAttack: boolean): { totalDice: number; hits: number; rolls: number[] } {
  const rolls: number[] = [];
  let hits = 0;
  for (const u of units) {
    const val = isAttack ? u.attackValue : u.defenseValue;
    for (let i = 0; i < u.quantity; i++) {
      const roll = Math.ceil(Math.random() * 6);
      rolls.push(roll);
      if (roll <= val) hits++;
    }
  }
  return { totalDice: rolls.length, hits, rolls };
}

export default function CombatPage() {
  const { nations } = useGameStore();
  const [attNation, setAttNation] = useState<NationId>('germany');
  const [defNation, setDefNation] = useState<NationId>('ussr');
  const [territory, setTerritory] = useState('');
  const [attUnits, setAttUnits] = useState<CombatUnit[]>([]);
  const [defUnits, setDefUnits] = useState<CombatUnit[]>([]);
  const [rounds, setRounds] = useState<{ attRolls: number[]; defRolls: number[]; attHits: number; defHits: number }[]>([]);

  const addUnit = (side: 'att' | 'def', type: string) => {
    const stats = UNIT_STATS[type];
    const unit: CombatUnit = { unitType: type, quantity: 1, attackValue: stats.attack, defenseValue: stats.defense };
    if (side === 'att') setAttUnits(u => [...u, unit]);
    else                setDefUnits(u => [...u, unit]);
  };

  const doRound = () => {
    const att = calcHits(attUnits, true);
    const def = calcHits(defUnits, false);
    setRounds(r => [...r, { attRolls: att.rolls, defRolls: def.rolls, attHits: att.hits, defHits: def.hits }]);
  };

  const attNat = nations.find(n => n.id === attNation)!;
  const defNat = nations.find(n => n.id === defNation)!;

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">⚔️ Slagoppsett</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {/* Attacker */}
          <div className="space-y-2">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Angriper</div>
            <select
              className="w-full bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1.5 rounded-sm"
              value={attNation}
              onChange={e => setAttNation(e.target.value as NationId)}
            >
              {nations.map(n => <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>)}
            </select>
            <div
              className="p-3 rounded-sm border"
              style={{ borderColor: attNat.color, backgroundColor: attNat.colorDim + '60' }}
            >
              <div className="text-xs font-display mb-2" style={{ color: attNat.textColor }}>Enheter</div>
              {attUnits.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-xs mb-1">
                  <span className="text-mil-text">{u.quantity}× {u.unitType}</span>
                  <button className="text-red-400 hover:text-red-300" onClick={() => setAttUnits(a => a.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.keys(UNIT_STATS).slice(0, 6).map(t => (
                  <button key={t} className="tag bg-[#0b0f07] text-mil-muted hover:text-mil-text border border-[#2a3818] cursor-pointer" onClick={() => addUnit('att', t)}>+{t}</button>
                ))}
              </div>
            </div>
          </div>

          {/* Territory */}
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="text-3xl">⚔️</div>
            <input
              type="text"
              placeholder="Territorium..."
              value={territory}
              onChange={e => setTerritory(e.target.value)}
              className="w-full bg-[#0b0f07] border border-[#2a3818] text-center text-mil-text text-sm px-2 py-1.5 rounded-sm"
            />
            <button className="btn-primary w-full" onClick={doRound} disabled={attUnits.length === 0 && defUnits.length === 0}>
              🎲 Kast terning — Runde {rounds.length + 1}
            </button>
            <button className="btn-secondary w-full text-xs" onClick={() => setRounds([])}>
              Nullstill
            </button>
          </div>

          {/* Defender */}
          <div className="space-y-2">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Forsvarer</div>
            <select
              className="w-full bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1.5 rounded-sm"
              value={defNation}
              onChange={e => setDefNation(e.target.value as NationId)}
            >
              {nations.map(n => <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>)}
            </select>
            <div
              className="p-3 rounded-sm border"
              style={{ borderColor: defNat.color, backgroundColor: defNat.colorDim + '60' }}
            >
              <div className="text-xs font-display mb-2" style={{ color: defNat.textColor }}>Enheter</div>
              {defUnits.map((u, i) => (
                <div key={i} className="flex items-center justify-between text-xs mb-1">
                  <span className="text-mil-text">{u.quantity}× {u.unitType}</span>
                  <button className="text-red-400 hover:text-red-300" onClick={() => setDefUnits(a => a.filter((_, j) => j !== i))}>✕</button>
                </div>
              ))}
              <div className="flex flex-wrap gap-1 mt-2">
                {Object.keys(UNIT_STATS).slice(0, 6).map(t => (
                  <button key={t} className="tag bg-[#0b0f07] text-mil-muted hover:text-mil-text border border-[#2a3818] cursor-pointer" onClick={() => addUnit('def', t)}>+{t}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Combat rounds */}
      {rounds.length > 0 && (
        <div className="card">
          <div className="card-header">📊 Kamp resultater</div>
          <div className="space-y-3">
            {rounds.map((r, i) => (
              <div key={i} className="grid grid-cols-2 gap-4 p-3 bg-[#0f1509] rounded-sm border border-[#2a3818]">
                <div>
                  <div className="text-xs mb-1" style={{ color: attNat.textColor }}>
                    {attNat.emoji} Angriper — Runde {i + 1}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {r.attRolls.map((roll, j) => (
                      <span
                        key={j}
                        className={`w-7 h-7 flex items-center justify-center rounded-sm text-sm font-bold border ${
                          roll <= (attUnits[0]?.attackValue ?? 0) ? 'border-green-600 text-green-400 bg-green-950' : 'border-[#2a3818] text-mil-muted'
                        }`}
                      >
                        {roll}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-green-400">{r.attHits} treff</div>
                </div>
                <div>
                  <div className="text-xs mb-1" style={{ color: defNat.textColor }}>
                    {defNat.emoji} Forsvarer — Runde {i + 1}
                  </div>
                  <div className="flex flex-wrap gap-1 mb-1">
                    {r.defRolls.map((roll, j) => (
                      <span
                        key={j}
                        className={`w-7 h-7 flex items-center justify-center rounded-sm text-sm font-bold border ${
                          roll <= (defUnits[0]?.defenseValue ?? 0) ? 'border-green-600 text-green-400 bg-green-950' : 'border-[#2a3818] text-mil-muted'
                        }`}
                      >
                        {roll}
                      </span>
                    ))}
                  </div>
                  <div className="text-sm font-bold text-green-400">{r.defHits} treff</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
