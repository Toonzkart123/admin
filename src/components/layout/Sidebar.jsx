// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, ShoppingCart, Users, DollarSign, Tag, 
  Star, BarChart2, Search, Shield, Settings, 
  ChevronDown, Home, Menu, X, Store 
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', icon: <Home />, path: '/' },
  { title: 'Inventory', icon: <BookOpen />, path: '/inventory' },
  { title: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { title: 'Users', icon: <Users />, path: '/users' },
  { title: 'Stores', icon: <Store />, path: '/stores' },
  { title: 'Financials', icon: <DollarSign />, path: '/financials' },
  { title: 'Promotions', icon: <Tag />, path: '/promotions' },
  { title: 'Reviews', icon: <Star />, path: '/reviews' },
  { title: 'Analytics', icon: <BarChart2 />, path: '/analytics' },
  { title: 'Marketing', icon: <Search />, path: '/marketing' },
  { title: 'Security', icon: <Shield />, path: '/security' },
  { title: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = ({ onToggle }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-blue-600 text-white"
        onClick={toggleMobileSidebar}
      >
        {mobileOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay for mobile */}
      {mobileOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleMobileSidebar}
        />
      )}

      {/* Sidebar */}
      <div 
        className={`fixed top-0 left-0 h-screen bg-white shadow-lg z-10 overflow-y-auto transition-all duration-300
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="h-16 border-b flex items-center">
          {collapsed ? (
            <div className="w-full flex justify-center">
              <BookOpen className="text-blue-600" size={28} />
            </div>
          ) : (
            <div className="w-full flex items-center justify-between px-4">
              <div className="flex items-center">
                <BookOpen className="text-blue-600" size={28} />
                <span className="ml-2 text-xl font-bold text-gray-800">BookAdmin</span>
              </div>
              <button 
                onClick={toggleSidebar} 
                className="text-gray-500 hover:text-blue-600 focus:outline-none"
              >
                <ChevronDown className="transform -rotate-90" />
              </button>
            </div>
          )}
        </div>

        {collapsed && (
          <div className="py-2 flex justify-center border-b">
            <button 
              onClick={toggleSidebar} 
              className="text-gray-500 hover:text-blue-600 focus:outline-none"
            >
              <ChevronDown className="transform rotate-90" />
            </button>
          </div>
        )}

        <nav className="py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors
                    ${location.pathname === item.path ? 
                      'bg-blue-50 text-blue-600' : 
                      'text-gray-600 hover:bg-gray-100'
                    }
                    ${collapsed ? 'justify-center' : ''}`}
                >
                  <span className="text-xl">{item.icon}</span>
                  {!collapsed && <span className="ml-3">{item.title}</span>}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;