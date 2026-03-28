import { NavLink } from 'react-router-dom';
import { useGameStore } from '../../store/gameStore';
import { TURN_ORDER } from '../../data/nations';
import NationIcon from '../NationIcon';

const NAV_ITEMS = [
  { to: '/',            label: 'Oversikt',    emoji: '📊' },
  { to: '/nasjoner',    label: 'Nasjoner',    emoji: '🌍' },
  { to: '/territorier', label: 'Territorier', emoji: '📋' },
  { to: '/seiersbyer',  label: 'Seiersbyer',  emoji: '🏆' },
  { to: '/historikk',   label: 'Historikk',   emoji: '📜' },
  { to: '/slag',        label: 'Slag',        emoji: '⚔️' },
  { to: '/tur',         label: 'Tur-tracker', emoji: '🎯' },
  { to: '/oppsett',     label: 'Oppsett',     emoji: '⚙️' },
];

export default function NavBar() {
  const { round, activeNationIndex, activePhase, nations, gameStarted } = useGameStore();
  const activeNation = nations.find(n => n.id === TURN_ORDER[activeNationIndex]);

  return (
    <header className="bg-[#0f1509] border-b border-[#2a3818] sticky top-0 z-50">
      {/* Title bar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[#1e2a10]">
        <div className="flex items-center gap-3">
          <span className="text-mil-gold font-display font-bold text-lg tracking-widest uppercase">
            🎖 Axis &amp; Allies
          </span>
          <span className="text-mil-muted text-xs font-mono">Global 1940</span>
        </div>

        {gameStarted && activeNation && (
          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="text-mil-muted">RUNDE</span>
            <span className="text-mil-gold font-bold text-base">{round}</span>
            <span className="text-mil-muted">TUR</span>
            <span
              className="px-2 py-0.5 rounded-sm font-semibold text-sm"
              style={{ backgroundColor: activeNation.colorDim, color: activeNation.textColor }}
            >
              <NationIcon nation={activeNation} size="sm" /> {activeNation.shortName}
            </span>
            <span className="text-mil-muted">FASE</span>
            <span className="text-mil-text capitalize">{activePhase.replace(/_/g, ' ')}</span>
          </div>
        )}

        {!gameStarted && (
          <span className="text-mil-muted text-xs animate-pulse">— INTET SPILL STARTET —</span>
        )}
      </div>

      {/* Navigation tabs */}
      <nav className="flex overflow-x-auto">
        {NAV_ITEMS.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-1.5 px-4 py-2.5 text-xs font-display uppercase tracking-wider whitespace-nowrap border-b-2 transition-colors ${
                isActive
                  ? 'border-mil-gold text-mil-gold bg-[#1a2210]'
                  : 'border-transparent text-mil-muted hover:text-mil-text hover:border-[#3a4a20]'
              }`
            }
          >
            <span>{item.emoji}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
