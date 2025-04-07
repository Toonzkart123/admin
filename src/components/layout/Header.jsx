// src/components/layout/Header.jsx
import { useState } from 'react';
import { Bell, MessageSquare, User, Search } from 'lucide-react';

const Header = () => {
  const [notifications, setNotifications] = useState(3);
  const [messages, setMessages] = useState(5);

  return (
    <header className="bg-white shadow-sm h-16 flex items-center px-6">
      <div className="flex-1 mx-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search size={18} className="text-gray-400" />
          </span>
          <input
            type="text"
            placeholder="Search..."
            className="w-full sm:w-64 pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        
        
        <div className="flex items-center cursor-pointer">
          <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white">
            <User size={20} />
          </div>
          <div className="ml-3 hidden md:block">
            <p className="text-sm font-medium text-gray-800">Admin User</p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;