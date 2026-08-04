import { NavLink } from 'react-router-dom';

const NAV_ITEMS = [
  { to: '/', label: 'Início', icon: '🏠' },
  { to: '/desenvolvimento', label: 'Crescimento', icon: '⭐' },
  { to: '/nutricao', label: 'Nutrição', icon: '🥗' },
  { to: '/vacinas', label: 'Vacinas', icon: '💉' },
  { to: '/materiais', label: 'Materiais', icon: '📎' },
  { to: '/consulta', label: 'Consulta', icon: '📋' },
];

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-rose-100 shadow-lg">
      <div className="flex max-w-lg mx-auto">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex-1 flex flex-col items-center py-2 text-[10px] font-medium transition-colors ${
                isActive ? 'text-rose-500' : 'text-gray-400'
              }`
            }
          >
            <span className="text-lg mb-0.5">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
