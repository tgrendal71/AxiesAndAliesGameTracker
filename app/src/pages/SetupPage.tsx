import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGameStore } from '../store/gameStore';
import { TURN_ORDER } from '../data/nations';
import type { GameSettings, NationId } from '../store/types';

export default function SetupPage() {
  const { startGame, resetGame, gameStarted } = useGameStore();
  const navigate = useNavigate();

  const [settings, setSettings] = useState<GameSettings>({
    useRnD: true,
    useNationalObjectives: true,
    maxRounds: null,
    playerNames: {},
  });

  const handleStart = () => {
    startGame(settings);
    navigate('/');
  };

  const updatePlayer = (id: NationId, name: string) => {
    setSettings(s => ({ ...s, playerNames: { ...s.playerNames, [id]: name } }));
  };

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="card">
        <div className="card-header">⚙️ Spilloppsett</div>
        <div className="space-y-4">
          {/* Rules */}
          <div>
            <div className="text-xs text-mil-muted uppercase tracking-wider mb-3">Regelvarianter</div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.useNationalObjectives}
                  onChange={e => setSettings(s => ({ ...s, useNationalObjectives: e.target.checked }))}
                  className="accent-[#c8a030]"
                />
                <div>
                  <div className="text-sm text-mil-text">Nasjonale mål (National Objectives)</div>
                  <div className="text-xs text-mil-muted">Nasjoner får ekstra IPC for å oppnå strategiske mål</div>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.useRnD}
                  onChange={e => setSettings(s => ({ ...s, useRnD: e.target.checked }))}
                  className="accent-[#c8a030]"
                />
                <div>
                  <div className="text-sm text-mil-text">Research &amp; Development</div>
                  <div className="text-xs text-mil-muted">Nasjoner kan investere IPC i teknologisk utvikling</div>
                </div>
              </label>
            </div>
          </div>

          {/* Max rounds */}
          <div>
            <div className="text-xs text-mil-muted uppercase tracking-wider mb-2">Maks runder</div>
            <div className="flex items-center gap-3">
              <input
                type="number"
                min={1}
                placeholder="Ubegrenset"
                className="w-32 bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1.5 rounded-sm focus:outline-none focus:border-mil-gold"
                value={settings.maxRounds ?? ''}
                onChange={e => setSettings(s => ({
                  ...s,
                  maxRounds: e.target.value ? parseInt(e.target.value) : null,
                }))}
              />
              <span className="text-xs text-mil-muted">La feltet være tomt for ubegrenset antall runder</span>
            </div>
          </div>
        </div>
      </div>

      {/* Player names */}
      <div className="card">
        <div className="card-header">👤 Spillernavn</div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {TURN_ORDER.map(id => {
            const nation = useGameStore.getState().nations.find(n => n.id === id)!;
            return (
              <div key={id} className="flex items-center gap-2">
                <span
                  className="tag shrink-0 w-14 text-center"
                  style={{ backgroundColor: nation.colorDim, color: nation.textColor }}
                >
                  {nation.emoji} {nation.shortName}
                </span>
                <input
                  type="text"
                  placeholder={`Spiller for ${nation.shortName}`}
                  value={settings.playerNames[id] ?? ''}
                  onChange={e => updatePlayer(id, e.target.value)}
                  className="flex-1 bg-[#0b0f07] border border-[#2a3818] text-mil-text text-sm px-2 py-1 rounded-sm focus:outline-none focus:border-mil-gold"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button className="btn-primary flex-1 py-3 text-base" onClick={handleStart}>
          ▶ Start spill
        </button>
        {gameStarted && (
          <button
            className="btn-secondary px-6 text-red-400 border-red-900 hover:border-red-600"
            onClick={() => { resetGame(); navigate('/'); }}
          >
            ✕ Nullstill spill
          </button>
        )}
      </div>
    </div>
  );
}
