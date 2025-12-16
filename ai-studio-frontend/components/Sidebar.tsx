import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MessageSquare, Settings, LogOut, Hexagon } from 'lucide-react';

const Sidebar: React.FC = () => {
  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
    { icon: MessageSquare, label: 'Conversations', path: '/conversations' },
    { icon: Settings, label: 'Settings', path: '/settings' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col fixed left-0 top-0 z-50 transition-all duration-300 shadow-xl">
      <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
        <div className="bg-emerald-500 p-2 rounded-lg">
           <Hexagon size={24} className="text-white fill-current" />
        </div>
        <div>
          <h1 className="text-xl font-bold tracking-tight">Iris</h1>
          <p className="text-xs text-slate-400 font-medium">Inbox Intelligence</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-2">
        <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu</p>
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 group ${
                isActive
                  ? 'bg-emerald-600/10 text-emerald-400 font-medium'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon size={20} className={isActive ? 'text-emerald-400' : 'text-slate-400 group-hover:text-white'} />
                <span>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center space-x-3 px-4 py-3 w-full text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
        <div className="mt-4 px-4 flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-sm font-medium truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">jane@iris.ai</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;