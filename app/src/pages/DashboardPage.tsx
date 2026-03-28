import { useNavigate } from 'react-router-dom';
import { useGameStore, TURN_ORDER } from '../store/gameStore';
import { AXIS_NATIONS, ALLIED_NATIONS } from '../data/nations';
import { getVictoryCities } from '../data/territories';
import type { Nation } from '../store/types';

function IPCBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, Math.round((value / Math.max(1, max)) * 100));
  return (
    <div className="mt-1 h-1.5 bg-[#1a2210] rounded-full overflow-hidden">
      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: color }} />
    </div>
  );
}

function NationRow({ nation }: { nation: Nation }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#1e2a10] last:border-0">
      <div className="flex items-center gap-2">
        <span className="w-5">{nation.emoji}</span>
        <span className="text-xs font-display uppercase tracking-wide" style={{ color: nation.textColor }}>
          {nation.name}
        </span>
        {nation.isEliminated && (
          <span className="tag bg-red-950 text-red-500">Eliminert</span>
        )}
        {!nation.isActive && !nation.isEliminated && (
          <span className="tag bg-[#1a2210] text-mil-muted">Nøytral</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <span className="ipc-value text-sm">{nation.ipc}</span>
        <span className="text-mil-muted text-xs">IPC</span>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { nations, territories, round, activeNationIndex, activePhase, gameStarted, nextPhase, nextNation } = useGameStore();
  const navigate = useNavigate();

  const axisNations   = nations.filter(n => AXIS_NATIONS.includes(n.id));
  const alliedNations = nations.filter(n => ALLIED_NATIONS.includes(n.id));

  const axisIPC   = axisNations.reduce((s, n) => s + n.ipc, 0);
  const alliedIPC = alliedNations.reduce((s, n) => s + n.ipc, 0);
  const totalIPC  = axisIPC + alliedIPC;

  const victoryCities = getVictoryCities(territories);
  const axisVC    = victoryCities.filter(t => AXIS_NATIONS.includes(t.controller as never)).length;
  const alliedVC  = victoryCities.filter(t => ALLIED_NATIONS.includes(t.controller as never)).length;
  const totalVC   = victoryCities.length;

  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  if (!gameStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6">
        <div className="text-6xl">🎖</div>
        <h1 className="font-display text-3xl text-mil-gold tracking-widest uppercase">
          Axis &amp; Allies Global 1940
        </h1>
        <p className="text-mil-muted text-sm">Ingen aktiv spilløkt. Start et nytt spill for å begynne.</p>
        <button className="btn-primary text-base px-8 py-3" onClick={() => navigate('/oppsett')}>
          ▶ Start nytt spill
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Active turn banner */}
      <div
        className="card flex items-center justify-between"
        style={{ borderColor: activeNation?.color, borderLeftWidth: 4 }}
      >
        <div className="flex items-center gap-4">
          <span className="text-3xl">{activeNation?.emoji}</span>
          <div>
            <div className="text-xs text-mil-muted font-mono uppercase tracking-widest">Aktiv nasjon</div>
            <div className="font-display text-xl font-bold" style={{ color: activeNation?.textColor }}>
              {activeNation?.name}
            </div>
          </div>
          <div className="pl-4 border-l border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Fase</div>
            <div className="font-display text-base text-mil-gold capitalize">
              {activePhase.replace(/_/g, ' ')}
            </div>
          </div>
          <div className="pl-4 border-l border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider">Runde</div>
            <div className="font-display text-2xl font-bold text-mil-gold">{round}</div>
          </div>
        </div>
        <div className="flex gap-2">
          <button className="btn-secondary text-xs" onClick={nextPhase}>
            Neste fase →
          </button>
          <button className="btn-secondary text-xs" onClick={nextNation}>
            Neste nasjon ⏭
          </button>
        </div>
      </div>

      {/* IPC panels + Victory cities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Axis IPC */}
        <div className="card">
          <div className="card-header" style={{ color: '#c8a030' }}>⚔ Aksemakter</div>
          <div className="space-y-0.5">
            {axisNations.map(n => <NationRow key={n.id} nation={n} />)}
          </div>
          <div className="mt-3 pt-3 border-t border-[#2a3818] flex justify-between items-center">
            <span className="text-mil-muted text-xs uppercase tracking-wider">Totalt</span>
            <div>
              <span className="ipc-value text-xl">{axisIPC}</span>
              <span className="text-mil-muted text-xs ml-1">IPC</span>
            </div>
          </div>
          <IPCBar value={axisIPC} max={totalIPC} color="#c8a030" />
        </div>

        {/* Allied IPC */}
        <div className="card">
          <div className="card-header" style={{ color: '#4a8fe8' }}>🛡 Allierte</div>
          <div className="space-y-0.5">
            {alliedNations.map(n => <NationRow key={n.id} nation={n} />)}
          </div>
          <div className="mt-3 pt-3 border-t border-[#2a3818] flex justify-between items-center">
            <span className="text-mil-muted text-xs uppercase tracking-wider">Totalt</span>
            <div>
              <span className="ipc-value text-xl">{alliedIPC}</span>
              <span className="text-mil-muted text-xs ml-1">IPC</span>
            </div>
          </div>
          <IPCBar value={alliedIPC} max={totalIPC} color="#4a8fe8" />
        </div>

        {/* Victory cities */}
        <div className="card">
          <div className="card-header">🏆 Seiersbyer</div>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#c8a030]">⚔ Akse</span>
                <span className="ipc-value">{axisVC} / {totalVC}</span>
              </div>
              <div className="h-3 bg-[#0b0f07] rounded-sm overflow-hidden flex">
                <div className="h-full bg-[#8a7020] transition-all" style={{ width: `${(axisVC / totalVC) * 100}%` }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#4a8fe8]">🛡 Allierte</span>
                <span className="ipc-value">{alliedVC} / {totalVC}</span>
              </div>
              <div className="h-3 bg-[#0b0f07] rounded-sm overflow-hidden flex">
                <div className="h-full bg-[#285898] transition-all" style={{ width: `${(alliedVC / totalVC) * 100}%` }} />
              </div>
            </div>
            <div className="pt-2 border-t border-[#2a3818] text-xs text-mil-muted space-y-1">
              <div>Seiersbetingelse: <span className="text-mil-text">kontroller 8 for Akse / 8 for Allierte</span></div>
              <div>Akse mangler: <span className="text-mil-gold font-bold">{Math.max(0, 8 - axisVC)} byer</span></div>
              <div>Allierte mangler: <span className="text-[#4a8fe8] font-bold">{Math.max(0, 8 - alliedVC)} byer</span></div>
            </div>
          </div>

          {/* Victory cities list */}
          <div className="mt-3 pt-3 border-t border-[#2a3818]">
            <div className="text-xs text-mil-muted uppercase tracking-wider mb-2">Byer</div>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {victoryCities.map(t => {
                const ctrl = nations.find(n => n.id === t.controller);
                return (
                  <div key={t.id} className="flex items-center justify-between text-xs">
                    <span className="text-mil-text">{t.name}</span>
                    <span
                      className="tag"
                      style={{ backgroundColor: ctrl?.colorDim ?? '#1a2210', color: ctrl?.textColor ?? '#5a6a40' }}
                    >
                      {ctrl?.shortName ?? t.controller}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* IPC quick edit */}
      <div className="card">
        <div className="card-header">💰 Hurtig IPC-justering</div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {nations.filter(n => !n.isEliminated).map(nation => (
            <IPCEditor key={nation.id} nation={nation} />
          ))}
        </div>
      </div>
    </div>
  );
}

function IPCEditor({ nation }: { nation: Nation }) {
  const { adjustIPC, setIPC } = useGameStore();

  return (
    <div
      className="rounded-sm p-3 border"
      style={{ borderColor: nation.color, backgroundColor: nation.colorDim + '40' }}
    >
      <div className="text-xs font-display uppercase tracking-wider mb-2" style={{ color: nation.textColor }}>
        {nation.emoji} {nation.shortName}
      </div>
      <div className="ipc-value text-2xl mb-2">{nation.ipc}</div>
      <div className="flex gap-1">
        <button
          className="flex-1 bg-[#0b0f07] border border-[#2a3818] text-red-400 text-sm py-1 rounded-sm hover:bg-red-950 transition-colors"
          onClick={() => adjustIPC(nation.id, -1)}
        >−</button>
        <input
          type="number"
          className="w-14 bg-[#0b0f07] border border-[#2a3818] text-center text-mil-gold text-sm py-1 rounded-sm"
          value={nation.ipc}
          onChange={e => setIPC(nation.id, parseInt(e.target.value) || 0)}
        />
        <button
          className="flex-1 bg-[#0b0f07] border border-[#2a3818] text-green-400 text-sm py-1 rounded-sm hover:bg-green-950 transition-colors"
          onClick={() => adjustIPC(nation.id, 1)}
        >+</button>
      </div>
    </div>
  );
}
