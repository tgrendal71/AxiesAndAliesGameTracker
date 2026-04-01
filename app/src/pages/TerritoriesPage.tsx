import { useState } from 'react';
import { useGameStore, TURN_ORDER } from '../store/gameStore';
import { AXIS_NATIONS, ALLIED_NATIONS } from '../data/nations';
import type { Territory, NationId, NeutralType } from '../store/types';

const NEUTRAL_TYPE_LABELS: Record<NeutralType, string> = {
  strict:     'Streng nøytral',
  pro_allies: 'Pro Allierte',
  pro_axis:   'Pro Akse',
  mongolia:   'Mongolia',
  general:    'Nøytral',
};

const BUILDING_ICONS: Record<string, string> = {
  major_factory: '🏭★',
  minor_factory: '🏭',
  air_base:      '✈️',
  naval_base:    '⚓',
};

type Filter = 'all' | 'axis' | 'allied' | 'neutral' | 'capital' | 'victory' | 'nation';

export default function TerritoriesPage() {
  const { territories, nations, updateTerritory, activeNationIndex } = useGameStore();
  const activeNationId = TURN_ORDER[activeNationIndex] ?? '';
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('nation');
  const [nationFilter, setNationFilter] = useState<NationId | ''>(activeNationId as NationId);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = territories
    .filter(t => t.type === 'land')
    .filter(t => {
      if (search) return t.name.toLowerCase().includes(search.toLowerCase());
      return true;
    })
    .filter(t => {
      if (filter === 'axis')    return AXIS_NATIONS.includes(t.controller as NationId);
      if (filter === 'allied')  return ALLIED_NATIONS.includes(t.controller as NationId);
      if (filter === 'neutral') return t.controller === 'neutral';
      if (filter === 'capital') return t.isCapital;
      if (filter === 'victory') return t.isVictoryCity;
      if (filter === 'nation')  return nationFilter ? t.controller === nationFilter : true;
      return true;
    });

  const axisIPC   = territories.filter(t => t.type === 'land' && AXIS_NATIONS.includes(t.controller as NationId)).reduce((s, t) => s + t.ipc, 0);
  const alliedIPC = territories.filter(t => t.type === 'land' && ALLIED_NATIONS.includes(t.controller as NationId)).reduce((s, t) => s + t.ipc, 0);

  const FILTER_BTNS: { key: Filter; label: string }[] = [
    { key: 'all',     label: 'Alle' },
    { key: 'axis',    label: '⚔ Akse' },
    { key: 'allied',  label: '🛡 Allierte' },
    { key: 'neutral', label: 'Nøytral' },
    { key: 'capital', label: '★ Kapital' },
    { key: 'victory', label: '🏆 Seiersby' },
  ];

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

          {/* Category buttons */}
          <div className="flex flex-wrap gap-1">
            {FILTER_BTNS.map(({ key, label }) => (
              <button
                key={key}
                onClick={() => { setFilter(key); setNationFilter(''); }}
                className={`tag cursor-pointer transition-colors ${
                  filter === key && filter !== 'nation'
                    ? 'bg-mil-gold text-[#0b0f07]'
                    : 'bg-[#1a2210] text-mil-muted hover:text-mil-text border border-[#2a3818]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Nation dropdown */}
          <div className="flex items-center gap-1.5">
            <select
              value={filter === 'nation' ? nationFilter : ''}
              onChange={e => {
                const val = e.target.value as NationId | '';
                setNationFilter(val);
                setFilter(val ? 'nation' : 'all');
              }}
              className={`bg-[#0b0f07] border rounded-sm px-2 py-1 text-xs text-mil-text focus:outline-none focus:border-mil-gold ${
                filter === 'nation' ? 'border-mil-gold' : 'border-[#2a3818]'
              }`}
            >
              <option value="">Vis nasjon...</option>
              {nations.map(n => (
                <option key={n.id} value={n.id}>{n.emoji} {n.name}</option>
              ))}
            </select>
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
              <th className="text-left px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Oppr. eier</th>
              <th className="text-center px-3 py-2 text-mil-muted uppercase tracking-wider font-display">IPC</th>
              <th className="text-left px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Bygninger</th>
              <th className="text-center px-3 py-2 text-mil-muted uppercase tracking-wider font-display">Flagg</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((t, i) => {
              const ctrl = nations.find(n => n.id === t.controller);
              const orig = t.originalOwner !== 'neutral' ? nations.find(n => n.id === t.originalOwner) : null;
              const isCaptured = orig && t.controller !== t.originalOwner;
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
                      <span className="tag bg-[#1a2210] text-mil-muted">
                        {t.neutralType ? NEUTRAL_TYPE_LABELS[t.neutralType] : 'Nøytral'}
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-2">
                    {isCaptured ? (
                      <span
                        className="tag"
                        style={{ backgroundColor: orig!.colorDim, color: orig!.textColor }}
                      >
                        {orig!.emoji} {orig!.shortName}
                      </span>
                    ) : (
                      <span className="text-mil-muted text-[10px]">—</span>
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
  const { nations, updateTerritory, activeNationIndex } = useGameStore();
  const activeNationId = TURN_ORDER[activeNationIndex] ?? territory.controller;
  const [controller, setController] = useState<NationId | 'neutral'>(activeNationId as NationId);

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
