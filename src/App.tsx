import { NavLink, Route, Routes } from 'react-router-dom'
import CalculatorPage from './pages/CalculatorPage'
import BasinsCatalogPage from './pages/BasinsCatalogPage'
import FaucetsCatalogPage from './pages/FaucetsCatalogPage'
import BasinDetailPage from './pages/BasinDetailPage'
import FaucetDetailPage from './pages/FaucetDetailPage'

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-2 text-sm font-medium rounded-md transition-colors ${
    isActive
      ? 'bg-slate-900 text-white'
      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
  }`

function App() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <NavLink to="/" className="text-lg font-semibold tracking-tight">
            SanMeyster
          </NavLink>
          <nav className="flex gap-1">
            <NavLink to="/" end className={navLinkClass}>
              Калькулятор
            </NavLink>
            <NavLink to="/basins" className={navLinkClass}>
              Раковини
            </NavLink>
            <NavLink to="/faucets" className={navLinkClass}>
              Змішувачі
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Routes>
          <Route path="/" element={<CalculatorPage />} />
          <Route path="/basins" element={<BasinsCatalogPage />} />
          <Route path="/basins/:brand/:model" element={<BasinDetailPage />} />
          <Route path="/faucets" element={<FaucetsCatalogPage />} />
          <Route
            path="/faucets/:brand/:model"
            element={<FaucetDetailPage />}
          />
        </Routes>
      </main>

      <footer className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-400">
        SanMeyster — інженерний інструмент для перевірки сумісності раковини
        та змішувача. Не є заміною проєктної документації.
      </footer>
    </div>
  )
}

export default App
