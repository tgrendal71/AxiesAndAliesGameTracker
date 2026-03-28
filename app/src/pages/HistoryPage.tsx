import { useGameStore } from '../store/gameStore';

export default function HistoryPage() {
  const { history, nations, round } = useGameStore();

  const byRound = history.reduce<Record<number, typeof history>>((acc, e) => {
    acc[e.round] = [...(acc[e.round] ?? []), e];
    return acc;
  }, {});

  const rounds = Object.keys(byRound).map(Number).sort((a, b) => b - a);

  return (
    <div className="space-y-4">
      <div className="card">
        <div className="card-header">📜 Spillhistorikk — Runde {round}</div>
        {history.length === 0 ? (
          <div className="text-center text-mil-muted py-8">
            Ingen hendelser registrert ennå.
          </div>
        ) : (
          <div className="space-y-4">
            {rounds.map(r => (
              <div key={r}>
                <div className="text-xs text-mil-gold font-display uppercase tracking-widest mb-2">
                  ── Runde {r} ──
                </div>
                <div className="space-y-1.5">
                  {byRound[r].map(e => {
                    const n = nations.find(n => n.id === e.nationId);
                    return (
                      <div key={e.id} className="flex items-start gap-3 text-xs py-1.5 border-b border-[#1a2210]">
                        <span className="shrink-0 text-mil-muted font-mono">
                          {new Date(e.timestamp).toLocaleTimeString('no', { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <span
                          className="shrink-0 tag"
                          style={{ backgroundColor: n?.colorDim, color: n?.textColor }}
                        >
                          {n?.emoji} {n?.shortName}
                        </span>
                        <span className="text-mil-text flex-1">{e.description}</span>
                        {e.ipcChange !== undefined && (
                          <span className={`shrink-0 font-bold ${e.ipcChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {e.ipcChange >= 0 ? '+' : ''}{e.ipcChange} IPC
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
