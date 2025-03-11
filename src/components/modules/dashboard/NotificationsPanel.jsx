// src/components/modules/dashboard/NotificationsPanel.jsx
import React from 'react';
import { Bell, X } from 'lucide-react';

const NotificationsPanel = ({ notifications }) => {
  return (
    <div className="bg-white rounded-lg shadow h-full flex flex-col">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900 flex items-center">
          <Bell size={18} className="mr-2 text-blue-600" />
          Notifications
        </h3>
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150">
          Mark all as read
        </button>
      </div>
      <div className="divide-y divide-gray-200 overflow-y-auto max-h-80 flex-grow">
        {notifications.map((notification) => (
          <div key={notification.id} className="px-6 py-4 hover:bg-gray-50">
            <div className="flex justify-between">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <button className="text-gray-400 hover:text-red-600 transition duration-150">
                <X size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
          </div>
        ))}
      </div>
      <div className="px-6 py-3 border-t mt-auto">
        <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150">
          View all notifications →
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;