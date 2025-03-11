import React from 'react';
import { DollarSign, BookOpen, ShoppingCart, Users } from 'lucide-react';
import StatCard from '../components/modules/dashboard/StatCard';
import RecentOrdersTable from '../components/modules/dashboard/RecentOrdersTable';
import NotificationsPanel from '../components/modules/dashboard/NotificationsPanel';

// Mock data
const mockOrders = [
  { id: '1001', customer: 'John Doe', date: '2025-03-09', amount: 129.99, status: 'Completed' },
  { id: '1002', customer: 'Jane Smith', date: '2025-03-09', amount: 89.95, status: 'Processing' },
  { id: '1003', customer: 'Robert Johnson', date: '2025-03-08', amount: 59.99, status: 'Pending' },
  { id: '1004', customer: 'Emily Brown', date: '2025-03-08', amount: 149.95, status: 'Cancelled' },
  { id: '1005', customer: 'Michael Wilson', date: '2025-03-07', amount: 39.99, status: 'Completed' },
];

const mockNotifications = [
  { 
    id: 1, 
    title: 'New order received', 
    message: 'Order #1006 has been placed and is awaiting processing.', 
    time: '10 minutes ago' 
  },
  { 
    id: 2, 
    title: 'Inventory alert', 
    message: '"The Great Gatsby" is running low on stock (3 remaining).', 
    time: '1 hour ago' 
  },
  { 
    id: 3, 
    title: 'New review', 
    message: 'A customer left a 5-star review for "To Kill a Mockingbird".', 
    time: '3 hours ago' 
  },
  { 
    id: 4, 
    title: 'Payment processed', 
    message: 'Payment for order #995 has been successfully processed.', 
    time: '5 hours ago' 
  },
];

const Dashboard = () => {
  return (
    <div className="w-full p-6 overflow-hidden">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back, Admin. Here's what's happening today.</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard 
          title="Total Sales" 
          value="$24,589.32" 
          icon={<DollarSign size={24} />} 
          change="12.5%" 
          changeType="increase" 
        />
        <StatCard 
          title="Active Listings" 
          value="1,248" 
          icon={<BookOpen size={24} />} 
          change="3.2%" 
          changeType="increase" 
        />
        <StatCard 
          title="Pending Orders" 
          value="42" 
          icon={<ShoppingCart size={24} />} 
          change="5.1%" 
          changeType="decrease" 
        />
        <StatCard 
          title="Total Customers" 
          value="5,783" 
          icon={<Users size={24} />} 
          change="8.7%" 
          changeType="increase" 
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentOrdersTable orders={mockOrders} />
        </div>
        <div>
          <NotificationsPanel notifications={mockNotifications} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;