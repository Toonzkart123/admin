// src/components/stores/StoreBasicInfo.jsx
import React from 'react';
import { MapPin, Phone, Mail, User, Store } from 'lucide-react';
import { getStatusBadgeClass } from '../../pages/StoreDetails';

const StoreBasicInfo = ({ store }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {/* Store Image and Basic Info */}
      <div className="relative h-48 bg-gray-200">
        {store.image ? (
          <img 
            src={store.image} 
            alt={store.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store size={48} className="text-gray-400" />
          </div>
        )}
        <div className="absolute bottom-4 right-4">
          <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(store.status)}`}>
            {store.status}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">{store.name}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-sm text-gray-500 flex items-start mb-2">
              <MapPin size={16} className="mr-2 flex-shrink-0 mt-0.5" />
              <span>{store.address}</span>
            </p>
            <p className="text-sm text-gray-500 flex items-center mb-2">
              <Phone size={16} className="mr-2 flex-shrink-0" />
              {store.phone}
            </p>
            <p className="text-sm text-gray-500 flex items-center mb-2">
              <Mail size={16} className="mr-2 flex-shrink-0" />
              {store.email}
            </p>
            <p className="text-sm text-gray-500 flex items-center">
              <User size={16} className="mr-2 flex-shrink-0" />
              Manager: {store.manager}
            </p>
          </div>
          
          <div>
            {store.website && (
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Website:</span> <a href={store.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{store.website}</a>
              </p>
            )}
            {store.storeHours && (
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Hours:</span> {store.storeHours}
              </p>
            )}
            <p className="text-sm text-gray-500 mb-2">
              <span className="font-medium">Commission Rate:</span> {store.commissionRate}%
            </p>
            {store.paymentTerms && (
              <p className="text-sm text-gray-500 mb-2">
                <span className="font-medium">Payment Terms:</span> {store.paymentTerms}
              </p>
            )}
          </div>
        </div>
        
        {store.description && (
          <div className="mb-6">
            <h3 className="text-md font-medium text-gray-900 mb-2">Description</h3>
            <p className="text-sm text-gray-500">{store.description}</p>
          </div>
        )}
        
        <StoreActivityStats store={store} />
      </div>
    </div>
  );
};

const StoreActivityStats = ({ store }) => {
  const joinDate = new Date(store.joinDate || Date.now());
  const formattedJoinDate = joinDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div>
      <h3 className="text-md font-medium text-gray-900 mb-2">Store Activity</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{store.activeListings || 0}</p>
          <p className="text-sm text-gray-500">Active Listings</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{store.totalInventory || 0}</p>
          <p className="text-sm text-gray-500">Total Inventory</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <p className="text-2xl font-bold text-gray-900">{formattedJoinDate}</p>
          <p className="text-sm text-gray-500">Joined Date</p>
        </div>
        {store.topCategories && store.topCategories.length > 0 && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex flex-wrap gap-1">
              {store.topCategories.map((category, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {category}
                </span>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-1">Top Categories</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreBasicInfo;