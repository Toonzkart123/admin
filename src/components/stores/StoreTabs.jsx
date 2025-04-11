import React from 'react';

const StoreTabs = ({ id, activeTab, setActiveTab }) => {
  if (id === 'new') return null;
  
  return (
    <div className="bg-white rounded-lg shadow mb-6">
      <div className="border-b border-gray-200">
        <nav className="flex -mb-px overflow-x-auto">
          <button 
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'overview' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button 
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'inventory' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('inventory')}
          >
            Inventory
          </button>
          <button 
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'orders' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('orders')}
          >
            Orders
          </button>
          <button 
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'analytics' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('analytics')}
          >
            Analytics
          </button>
          <button 
            className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
              activeTab === 'schools' 
                ? 'border-blue-500 text-blue-600' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
            onClick={() => setActiveTab('schools')}
          >
            Schools
          </button>
        </nav>
      </div>
    </div>
  );
};

export default StoreTabs;