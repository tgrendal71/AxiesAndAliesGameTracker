import { useState } from 'react';
import { useGameStore } from '../store/gameStore';
import type { Territory, NationId } from '../store/types';

const BUILDING_ICONS: Record<string, string> = {
  major_factory: '🏭★',
  minor_factory: '🏭',
  air_base:      '✈️',
  naval_base:    '⚓',
};

type Filter = 'all' | 'axis' | 'allied' | 'neutral' | 'capital' | 'victory';

export default function TerritoriesPage() {
  const { territories, nations, updateTerritory } = useGameStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [editingId, setEditingId] = useState<string | null>(null);

  const AXIS_IDS:   NationId[] = ['germany', 'italy', 'japan'];
  const ALLIED_IDS: NationId[] = ['ussr', 'uk_europe', 'uk_pacific', 'usa', 'china', 'anzac', 'france'];

  const filtered = territories
    .filter(t => t.type === 'land')
    .filter(t => {
      if (search) return t.name.toLowerCase().includes(search.toLowerCase());
      return true;
    })
    .filter(t => {
      if (filter === 'axis')    return AXIS_IDS.includes(t.controller as NationId);
      if (filter === 'allied')  return ALLIED_IDS.includes(t.controller as NationId);
      if (filter === 'neutral') return t.controller === 'neutral';
      if (filter === 'capital') return t.isCapital;
      if (filter === 'victory') return t.isVictoryCity;
      return true;
    });

  const axisIPC   = territories.filter(t => t.type === 'land' && AXIS_IDS.includes(t.controller as NationId)).reduce((s, t) => s + t.ipc, 0);
  const alliedIPC = territories.filter(t => t.type === 'land' && ALLIED_IDS.includes(t.controller as NationId)).reduce((s, t) => s + t.ipc, 0);

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="card">
        <div className="flex flex-wrap gap-3 items-center">
          <input
            type="text"
            placeholder="Søk territorier..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-[#0b0f07] border border-[#2a3818] rounded-sm px-3 py-1.5 text-sm text-mil-text placeholder-mil-muted focus:outline-none focus:border-mil-gold"
          />
          <div className="flex gap-1">
            {(['all', 'axis', 'allied', 'neutral', 'capital', 'victory'] as Filter[]).map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`tag cursor-pointer transition-colors ${
                  filter === f
                    ? 'bg-mil-gold text-[#0b0f07]'
                    : 'bg-[#1a2210] text-mil-muted hover:text-mil-text border border-[#2a3818]'
                }`}
              >
                {f === 'all'     ? 'Alle' :
                 f === 'axis'    ? '⚔ Akse' :
                 f === 'allied'  ? '🛡 Allierte' :
                 f === 'neutral' ? 'Nøytral' :
                 f === 'capital' ? '★ Kapital' : '🏆 Seiersby'}
              </button>
            ))}
          </div>
          <div className="ml-auto text-xs text-mil-muted">
            {filtered.length} territorier vist
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card p-0 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-[#0f1509] border-b border-[#2a3818]">
              <th className="text-left px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Territorium</th>
              <th className="text-left px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Kontrolles av</th>
              <th className="text-center px-3 py-2 text-mil-muted uppercase tracking-wider font-display">IPC</th>
              <th className="text-left px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Bygninger</th>
              <th className="text-center px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Flagg</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const ctrl = nations.find(n => n.id === t.controller);
              return (
                <tr
                  key={t.id}
                  className={`border-b border-[#1a2210] hover:bg-[#1a2210] transition-colors cursor-pointer ${i % 2 === 0 ? '' : 'bg-[#141a0c]'}`}
                  onClick={() => setEditingId(editingId === t.id ? null : t.id)}
                >
                  <td className="px-3 py-2">
                    <span className="text-mil-text">{t.name}</span>
                    {t.isCapital && <span className="ml-2 tag bg-[#3a5018] text-green-400">Kapital</span>}
                  </td>
                  <td className="px-3 py-2">
                    {ctrl ? (
                      <span
                        className="tag"
                        style={{ backgroundColor: ctrl.colorDim, color: ctrl.textColor }}
                      >
                        {ctrl.emoji} {ctrl.shortName}
                      </span>
                    ) : (
                      <span className="tag bg-[#1a2210] text-mil-muted">Nøytral</span>
                    )}
                  </td>
                  <td className="px-3 py-2 text-center">
                    <span className="ipc-value">{t.ipc}</span>
                  </td>
                  <td className="px-3 py-2">
                    {t.buildings.map((b, j) => (
                      <span key={j} className="mr-1 text-base" title={b.type}>
                        {BUILDING_ICONS[b.type]}
                        {b.damage > 0 && <span className="text-red-500 text-[10px]">{b.damage}</span>}
                      </span>
                    ))}
                  </td>
                  <td className="px-3 py-2 text-center">
                    {t.isVictoryCity && <span title="Seiersby">🏆</span>}
                    {t.map === 'Pacific' && <span title="Pacific map" className="ml-1">🌏</span>}
                    {t.map === 'Europe' && <span title="Europe map" className="ml-1">🌍</span>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="text-center text-mil-muted py-8">Ingen territorier funnet</div>
        )}
      </div>

      {/* Edit panel */}
      {editingId && <TerritoryEditor territory={territories.find(t => t.id === editingId)!} onClose={() => setEditingId(null)} />}

      {/* Footer totals */}
      <div className="card">
        <div className="flex justify-around text-center">
          <div>
            <div className="text-mil-muted text-xs uppercase tracking-wider mb-1">⚔ Akse IPC</div>
            <div className="ipc-value text-2xl">{axisIPC}</div>
          </div>
          <div className="border-l border-[#2a3818]" />
          <div>
            <div className="text-mil-muted text-xs uppercase tracking-wider mb-1">🛡 Allierte IPC</div>
            <div className="ipc-value text-2xl">{alliedIPC}</div>
          </div>
          <div className="border-l border-[#2a3818]" />
          <div>
            <div className="text-mil-muted text-xs uppercase tracking-wider mb-1">Totalt</div>
            <div className="ipc-value text-2xl">{axisIPC + alliedIPC}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TerritoryEditor({ territory, onClose }: { territory: Territory; onClose: () => void }) {
  const { nations, updateTerritory } = useGameStore();
  const [controller, setController] = useState(territory.controller);

  const save = () => {
    updateTerritory(territory.id, { controller: controller as NationId });
    onClose();
  };

  return (
    <div className="card border-mil-gold">
      <div className="card-header">✏️ Rediger: {territory.name}</div>
      <div className="flex items-center gap-4 flex-wrap">
        <div>
          <label className="text-xs text-mil-muted uppercase tracking-wider block mb-1">Kontrollert av</label>
          <select
            value={controller}
            onChange={e => setController(e.target.value as NationId | 'neutral')}
            className="bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1 rounded-sm focus:outline-none focus:border-mil-gold"
          >
            <option value="neutral">Nøytral</option>
            {nations.map(n => (
              <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>
            ))}
          </select>
        </div>
        <button className="btn-primary" onClick={save}>Lagre</button>
        <button className="btn-secondary" onClick={onClose}>Avbryt</button>
      </div>
    </div>
  );
}
