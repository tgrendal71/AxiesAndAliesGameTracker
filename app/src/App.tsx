import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import DashboardPage     from './pages/DashboardPage';
import NationsPage       from './pages/NationsPage';
import TerritoriesPage   from './pages/TerritoriesPage';
import VictoryCitiesPage from './pages/VictoryCitiesPage';
import HistoryPage       from './pages/HistoryPage';
import CombatPage        from './pages/CombatPage';
import TurnTrackerPage   from './pages/TurnTrackerPage';
import SetupPage         from './pages/SetupPage';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"            element={<DashboardPage />} />
        <Route path="/nasjoner"    element={<NationsPage />} />
        <Route path="/territorier" element={<TerritoriesPage />} />
        <Route path="/seiersbyer"  element={<VictoryCitiesPage />} />
        <Route path="/historikk"   element={<HistoryPage />} />
        <Route path="/slag"        element={<CombatPage />} />
        <Route path="/tur"         element={<TurnTrackerPage />} />
        <Route path="/oppsett"     element={<SetupPage />} />
      </Routes>
    </Layout>
  );
}
