import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { Home } from './pages/Home';
import { Development } from './pages/Development';
import { Nutrition } from './pages/Nutrition';
import { Vaccines } from './pages/Vaccines';
import { Materials } from './pages/Materials';

export function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/desenvolvimento" element={<Development />} />
          <Route path="/nutricao" element={<Nutrition />} />
          <Route path="/vacinas" element={<Vaccines />} />
          <Route path="/materiais" element={<Materials />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
