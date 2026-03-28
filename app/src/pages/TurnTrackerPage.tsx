import { useGameStore, TURN_ORDER, PHASES } from '../store/gameStore';
import { PHASES_INFO } from '../data/nations';
import type { Phase } from '../store/types';

export default function TurnTrackerPage() {
  const {
    nations, round, activeNationIndex, activePhase,
    phasesDone, nextPhase, nextNation, completePhase,
  } = useGameStore();

  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  const getPhaseStatus = (phase: Phase) => {
    if (phasesDone.includes(phase)) return 'done';
    if (phase === activePhase)      return 'active';
    return 'pending';
  };

  return (
    <div className="space-y-4">
      {/* Turn header */}
      <div
        className="card flex items-center gap-4"
        style={{ borderLeftWidth: 4, borderLeftColor: activeNation?.color }}
      >
        <span className="text-4xl">{activeNation?.emoji}</span>
        <div>
          <div className="text-xs text-mil-muted uppercase tracking-widest">Runde {round} — Aktiv tur</div>
          <div className="font-display text-2xl font-bold" style={{ color: activeNation?.textColor }}>
            {activeNation?.name}
          </div>
          <div className="text-xs text-mil-muted mt-1">
            IPC-balanse: <span className="ipc-value">{activeNation?.ipc}</span>
          </div>
        </div>
        <div className="ml-auto flex gap-2">
          <button className="btn-secondary text-xs" onClick={nextPhase}>Neste fase →</button>
          <button className="btn-primary text-xs" onClick={nextNation}>Neste nasjon ⏭</button>
        </div>
      </div>

      {/* Phase steps */}
      <div className="card">
        <div className="card-header">📋 Faser</div>
        <div className="space-y-2">
          {PHASES_INFO.map((info, idx) => {
            const status = getPhaseStatus(info.id);
            return (
              <div
                key={info.id}
                className={`flex items-center gap-3 p-3 rounded-sm border transition-colors ${
                  status === 'active'  ? 'border-mil-gold bg-[#2a3a10]' :
                  status === 'done'    ? 'border-[#2a3818] bg-[#0f1509] opacity-60' :
                  'border-[#1e2a10] bg-[#141a0c]'
                }`}
              >
                {/* Status icon */}
                <div className="w-6 text-center shrink-0">
                  {status === 'done'   && <span className="text-green-400">✅</span>}
                  {status === 'active' && <span className="text-mil-gold animate-pulse">▶</span>}
                  {status === 'pending' && <span className="text-mil-muted">○</span>}
                </div>

                {/* Phase info */}
                <span className="text-lg shrink-0">{info.emoji}</span>
                <div className="flex-1">
                  <div className={`font-display font-semibold text-sm uppercase tracking-wide ${
                    status === 'active' ? 'text-mil-gold' :
                    status === 'done'   ? 'text-mil-muted' : 'text-mil-text'
                  }`}>
                    {info.label}
                  </div>
                  <div className="flex gap-2 mt-0.5">
                    {info.warOnly  && <span className="tag bg-red-950 text-red-400">Kun krig</span>}
                    {info.optional && <span className="tag bg-[#2a3818] text-mil-muted">Valgfri</span>}
                  </div>
                </div>

                {/* Step number */}
                <span className="text-mil-muted text-xs font-mono shrink-0">Steg {idx + 1}</span>

                {/* Mark done button */}
                {status === 'active' && (
                  <button
                    className="btn-secondary text-xs py-1 px-2 shrink-0"
                    onClick={() => completePhase(info.id)}
                  >
                    Merk ferdig
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Turn order overview */}
      <div className="card">
        <div className="card-header">🔄 Turrekkefølge — Runde {round}</div>
        <div className="flex gap-2 flex-wrap">
          {TURN_ORDER.map((id, idx) => {
            const n = nations.find(n => n.id === id)!;
            const isActive  = idx === activeNationIndex;
            const isPast    = idx < activeNationIndex;
            return (
              <div
                key={id}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm border text-xs font-display uppercase ${
                  isActive ? 'border-current' : 'border-transparent opacity-50'
                } transition-opacity`}
                style={isActive
                  ? { backgroundColor: n.colorDim, color: n.textColor, borderColor: n.color }
                  : { backgroundColor: '#141a0c', color: n.textColor + '66' }
                }
              >
                {isPast && <span>✓</span>}
                {isActive && <span>▶</span>}
                {n.emoji} {n.shortName}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
