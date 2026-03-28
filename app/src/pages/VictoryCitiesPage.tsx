import { useGameStore } from '../store/gameStore';
import { getVictoryCities } from '../data/territories';
import type { NationId } from '../store/types';

export default function VictoryCitiesPage() {
  const { territories, nations, updateTerritory } = useGameStore();
  const vcs = getVictoryCities(territories);

  const AXIS_IDS:   NationId[] = ['germany', 'italy', 'japan'];
  const ALLIED_IDS: NationId[] = ['ussr', 'uk_europe', 'uk_pacific', 'usa', 'china', 'anzac', 'france'];

  const axisVC   = vcs.filter(t => AXIS_IDS.includes(t.controller as NationId));
  const alliedVC = vcs.filter(t => ALLIED_IDS.includes(t.controller as NationId));

  return (
    <div className="space-y-4">
      {/* Counter */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card text-center">
          <div className="text-mil-muted text-xs uppercase tracking-wider mb-1">⚔ Akse</div>
          <div className="ipc-value text-5xl">{axisVC.length}</div>
          <div className="text-mil-muted text-xs mt-1">av {vcs.length}</div>
          <div className="mt-2 text-xs text-mil-text">Trenger 8 for seier</div>
          <div
            className="mt-2 h-2 bg-[#0b0f07] rounded-full overflow-hidden"
          >
            <div className="h-full bg-[#c8a030] rounded-full transition-all" style={{ width: `${(axisVC.length / 8) * 100}%` }} />
          </div>
        </div>
        <div className="card text-center flex flex-col items-center justify-center">
          <div className="text-6xl">🏆</div>
          <div className="mt-2 text-mil-muted text-sm">Totalt: {vcs.length} byer</div>
        </div>
        <div className="card text-center">
          <div className="text-mil-muted text-xs uppercase tracking-wider mb-1">🛡 Allierte</div>
          <div className="ipc-value text-5xl">{alliedVC.length}</div>
          <div className="text-mil-muted text-xs mt-1">av {vcs.length}</div>
          <div className="mt-2 text-xs text-mil-text">Trenger 8 for seier</div>
          <div className="mt-2 h-2 bg-[#0b0f07] rounded-full overflow-hidden">
            <div className="h-full bg-[#4a8fe8] rounded-full transition-all" style={{ width: `${(alliedVC.length / 8) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* City grid */}
      <div className="card">
        <div className="card-header">🏙 Alle seiersbyer</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {vcs.map(t => {
            const ctrl = nations.find(n => n.id === t.controller);
            return (
              <div
                key={t.id}
                className="flex items-center justify-between p-2 rounded-sm border transition-colors"
                style={{
                  borderColor: ctrl?.color ?? '#2a3818',
                  backgroundColor: ctrl?.colorDim ?? '#141a0c',
                }}
              >
                <div>
                  <div className="text-sm font-display" style={{ color: ctrl?.textColor ?? '#c0b880' }}>
                    {t.isCapital && '★ '}{t.name}
                  </div>
                  <div className="text-xs text-mil-muted">{t.ipc} IPC · {t.map}</div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span
                    className="tag text-[10px]"
                    style={{ backgroundColor: '#0b0f07', color: ctrl?.textColor ?? '#5a6a40' }}
                  >
                    {ctrl ? `${ctrl.emoji} ${ctrl.shortName}` : 'Nøytral'}
                  </span>
                  <select
                    className="bg-[#0b0f07] border border-[#2a3818] text-[10px] text-mil-muted px-1 rounded-sm"
                    value={t.controller}
                    onChange={e => updateTerritory(t.id, { controller: e.target.value as NationId })}
                  >
                    <option value="neutral">Nøytral</option>
                    {nations.map(n => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
