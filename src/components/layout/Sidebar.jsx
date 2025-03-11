// src/components/layout/Sidebar.jsx
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BookOpen, ShoppingCart, Users, DollarSign, Tag, 
  Star, BarChart2, Search, Shield, Settings, 
  ChevronDown, Home, Menu, X 
} from 'lucide-react';

const navItems = [
  { title: 'Dashboard', icon: <Home />, path: '/' },
  { title: 'Inventory', icon: <BookOpen />, path: '/inventory' },
  { title: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { title: 'Users', icon: <Users />, path: '/users' },
  { title: 'Financials', icon: <DollarSign />, path: '/financials' },
  { title: 'Promotions', icon: <Tag />, path: '/promotions' },
  { title: 'Reviews', icon: <Star />, path: '/reviews' },
  { title: 'Analytics', icon: <BarChart2 />, path: '/analytics' },
  { title: 'Marketing', icon: <Search />, path: '/marketing' },
  { title: 'Security', icon: <Shield />, path: '/security' },
  { title: 'Settings', icon: <Settings />, path: '/settings' },
];

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const toggleMobileSidebar = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <>
      {/* Mobile menu button */}
      <button 
        className="lg:hidden fixed z-20 top-4 left-4 p-2 rounded-md bg-primary-600 text-white"
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
      <aside 
        className={`fixed top-0 left-0 z-10 h-full bg-white shadow-lg transition-all duration-300 
          ${collapsed ? 'w-20' : 'w-64'} 
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b">
          <div className={`flex items-center ${collapsed ? 'justify-center w-full' : ''}`}>
            <BookOpen className="text-primary-600" size={28} />
            {!collapsed && <span className="ml-2 text-xl font-bold text-gray-800">BookAdmin</span>}
          </div>
          <button 
            onClick={toggleSidebar} 
            className="hidden lg:block text-gray-500 hover:text-primary-600"
          >
            <ChevronDown 
              className={`transform transition-transform ${collapsed ? 'rotate-90' : '-rotate-90'}`} 
            />
          </button>
        </div>

        <nav className="mt-6">
          <ul className="space-y-2 px-2">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center p-3 rounded-lg transition-colors
                    ${location.pathname === item.path ? 
                      'bg-primary-50 text-primary-600' : 
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
      </aside>
    </>
  );
};

export default Sidebar;