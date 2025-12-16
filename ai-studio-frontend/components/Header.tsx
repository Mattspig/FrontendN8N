import React from 'react';
import { Bell, Search, HelpCircle } from 'lucide-react';

interface HeaderProps {
  title: string;
}

const Header: React.FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-white border-b border-gray-100 h-16 px-8 flex items-center justify-between sticky top-0 z-40">
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
      
      <div className="flex items-center space-x-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input 
            type="text" 
            placeholder="Search anything..." 
            className="pl-9 pr-4 py-2 bg-gray-50 border-none rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-emerald-100 w-64 transition-all"
          />
        </div>

        <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-gray-600 transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <button className="text-gray-400 hover:text-gray-600 transition-colors">
                <HelpCircle size={20} />
            </button>
        </div>
      </div>
    </header>
  );
};

export default Header;