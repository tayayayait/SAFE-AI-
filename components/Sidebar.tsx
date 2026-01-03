import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Users, Mail, FileSearch, Bug, Settings, LogOut } from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear auth (simulated)
    localStorage.removeItem('isAuthenticated');
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', label: '대시보드', icon: Home },
    { path: '/recipients', label: '수신자 관리', icon: Users },
    { path: '/send-history', label: '발송 이력', icon: Mail },
    { path: '/cases', label: '재해 사례', icon: FileSearch },
    { path: '/settings', label: '설정', icon: Settings },
  ];

  return (
    <aside className="w-60 bg-primary text-white flex flex-col fixed h-full shadow-xl z-20">
      <div className="h-16 flex items-center px-6 font-bold text-lg border-b border-white/10 tracking-tight">
        KOSHA Siren AI
      </div>

      <nav className="flex-1 py-4 flex flex-col gap-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center px-6 py-3 text-sm font-medium transition-colors
              ${isActive 
                ? 'bg-white/10 border-r-4 border-secondary text-white' 
                : 'text-white/70 hover:bg-white/5 hover:text-white'}
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-2 text-sm font-medium text-white/70 hover:text-white hover:bg-white/5 rounded transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          로그아웃
        </button>
      </div>
    </aside>
  );
};