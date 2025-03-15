// src/components/stores/overview/StoreTimeline.jsx
import React from 'react';
import { Calendar, Clock, Book } from 'lucide-react';

const StoreTimeline = ({ store }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Store Timeline</h3>
      
      <div className="space-y-6">
        <TimelineItem 
          icon={<Calendar size={20} />}
          iconBgColor="bg-blue-100"
          iconTextColor="text-blue-600"
          title="Store Joined"
          date={store.joinDate}
          isLast={false}
        />
        
        <TimelineItem 
          icon={<Clock size={20} />}
          iconBgColor="bg-green-100"
          iconTextColor="text-green-600"
          title="Last Updated"
          date={store.lastUpdate}
          isLast={false}
        />
        
        <TimelineItem 
          icon={<Book size={20} />}
          iconBgColor="bg-yellow-100"
          iconTextColor="text-yellow-600"
          title="First Inventory Added"
          date="2023-06-02"
          isLast={true}
        />
      </div>
    </div>
  );
};

const TimelineItem = ({ icon, iconBgColor, iconTextColor, title, date, isLast }) => {
  return (
    <div className="flex">
      <div className="flex-shrink-0 flex flex-col items-center">
        <div className={`h-10 w-10 rounded-full ${iconBgColor} flex items-center justify-center ${iconTextColor}`}>
          {icon}
        </div>
        {!isLast && <div className="flex-1 w-0.5 bg-gray-200 mt-2"></div>}
      </div>
      <div className="ml-4">
        <h4 className="text-sm font-medium text-gray-900">{title}</h4>
        <p className="text-sm text-gray-500 mt-1">
          {typeof date === 'string' 
            ? new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
            : date
          }
        </p>
      </div>
    </div>
  );
};

export default StoreTimeline;