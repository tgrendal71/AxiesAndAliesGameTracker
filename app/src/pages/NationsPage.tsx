import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import { TURN_ORDER } from '../data/nations';
import type { NationId, Nation, Building } from '../store/types';

const BUILDING_ICONS: Record<string, string> = {
  major_factory: '🏭★',
  minor_factory: '🏭',
  air_base:      '✈️',
  naval_base:    '⚓',
};

function BuildingBadge({ b }: { b: Building }) {
  const icon = BUILDING_ICONS[b.type] ?? '❓';
  return (
    <span className={`tag mr-1 ${b.damage >= 3 ? 'bg-red-950 text-red-400' : 'bg-[#0b0f07] text-mil-muted'}`}>
      {icon} {b.damage > 0 && <span className="text-red-400">{Array(b.damage).fill('💥').join('')}</span>}
    </span>
  );
}

function NationCard({ nation }: { nation: Nation }) {
  const { territories, toggleObjective, adjustIPC } = useGameStore();
  const controlled = territories.filter(t => t.controller === nation.id && t.type === 'land');
  const territoryIPC = controlled.reduce((s, t) => s + t.ipc, 0);
  const objectivesIPC = nation.objectives.filter(o => o.achieved).reduce((s, o) => s + o.ipcBonus, 0);
  const totalIncome = territoryIPC + objectivesIPC - nation.convoyLoss;

  const buildings = controlled.flatMap(t => t.buildings.map(b => ({ ...b, territory: t.name })));

  return (
    <div className="card">
      {/* Nation header */}
      <div
        className="flex items-center justify-between -m-4 mb-4 px-4 py-3 rounded-t-sm"
        style={{ backgroundColor: nation.colorDim }}
      >
        <div className="flex items-center gap-3">
          <span className="text-3xl">{nation.emoji}</span>
          <div>
            <div className="font-display text-xl font-bold" style={{ color: nation.textColor }}>
              {nation.name}
            </div>
            <div className="text-xs" style={{ color: nation.textColor + 'aa' }}>
              {nation.side} · {controlled.length} territorier
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="ipc-value text-3xl">{nation.ipc}</div>
          <div className="text-xs text-mil-muted">IPC</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Income card */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3">
          <div className="card-header">💰 Inntekt denne runden</div>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-mil-muted">Territorier</span>
              <span className="text-green-400">+{territoryIPC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mil-muted">Bonuser</span>
              <span className="text-green-400">+{objectivesIPC}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-mil-muted">Konvoi tap</span>
              <span className="text-red-400">−{nation.convoyLoss}</span>
            </div>
            <div className="flex justify-between pt-1 border-t border-[#2a3818] font-bold">
              <span className="text-mil-text">Totalt</span>
              <span className="ipc-value">+{totalIncome}</span>
            </div>
          </div>
          <div className="flex gap-2 mt-3">
            <button
              className="flex-1 btn-secondary text-xs py-1"
              onClick={() => adjustIPC(nation.id, totalIncome)}
            >
              Legg til inntekt
            </button>
          </div>
        </div>

        {/* Buildings */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3">
          <div className="card-header">🏗 Bygninger</div>
          {buildings.length === 0 ? (
            <div className="text-mil-muted text-xs">Ingen bygninger</div>
          ) : (
            <div className="space-y-1.5 text-xs">
              {buildings.map((b, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-mil-text truncate">{b.territory}</span>
                  <BuildingBadge b={b} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* National Objectives */}
        <div className="bg-[#0f1509] border border-[#2a3818] rounded-sm p-3 md:col-span-2">
          <div className="card-header">🎯 Nasjonale mål</div>
          <div className="space-y-2">
            {nation.objectives.map(obj => (
              <label key={obj.id} className="flex items-start gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={obj.achieved}
                  onChange={e => toggleObjective(nation.id, obj.id, e.target.checked)}
                  className="mt-0.5 accent-[#c8a030]"
                />
                <span className={`text-xs flex-1 ${obj.achieved ? 'text-mil-text' : 'text-mil-muted'}`}>
                  {obj.description}
                </span>
                {obj.ipcBonus > 0 && (
                  <span className={`tag shrink-0 ${obj.achieved ? 'bg-[#3a5018] text-green-400' : 'bg-[#0b0f07] text-mil-muted'}`}>
                    +{obj.ipcBonus} IPC
                  </span>
                )}
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function NationsPage() {
  const { nations } = useGameStore();
  const [activeTab, setActiveTab] = useState<NationId>(TURN_ORDER[0]);

  const nation = nations.find(n => n.id === activeTab);

  return (
    <div className="space-y-4">
      {/* Nation tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {TURN_ORDER.map(id => {
          const n = nations.find(n => n.id === id)!;
          return (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-display uppercase tracking-wider whitespace-nowrap border transition-colors ${
                activeTab === id
                  ? 'border-transparent'
                  : 'border-[#2a3818] text-mil-muted hover:text-mil-text'
              }`}
              style={activeTab === id ? { backgroundColor: n.colorDim, color: n.textColor, borderColor: n.color } : {}}
            >
              {n.emoji} {n.shortName}
              {n.isEliminated && ' ✗'}
            </button>
          );
        })}
      </div>

      {nation && <NationCard nation={nation} />}
    </div>
  );
}
