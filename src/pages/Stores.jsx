// src/pages/Stores.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, MapPin, Phone, Mail, Store, ChevronRight } from 'lucide-react';
import { mockStores } from '../data/storeMockData';
import { getStatusBadgeClass } from './StoreDetails';

const Stores = () => {
  const navigate = useNavigate();
  const [stores, setStores] = useState([]);
  const [filteredStores, setFilteredStores] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Load stores
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setStores(mockStores);
      setFilteredStores(mockStores);
      setIsLoading(false);
    }, 500);
  }, []);

  // Handle search and filtering
  useEffect(() => {
    let results = [...stores];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      results = results.filter(store => 
        store.name.toLowerCase().includes(query) || 
        store.address.toLowerCase().includes(query) ||
        store.manager.toLowerCase().includes(query)
      );
    }
    
    // Apply status filter
    if (statusFilter !== 'all') {
      results = results.filter(store => store.status.toLowerCase() === statusFilter);
    }
    
    setFilteredStores(results);
  }, [searchQuery, statusFilter, stores]);

  const handleStoreClick = (storeId) => {
    navigate(`/stores/${storeId}`);
  };

  return (
    <div className="w-full p-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Stores</h1>
          <p className="text-gray-500 mt-1">Manage affiliated bookstores and their inventory</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <button
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            onClick={() => navigate('/stores/new')}
          >
            <PlusCircle size={16} className="mr-2" />
            Add New Store
          </button>
        </div>
      </div>
      
      {/* Filters */}
      <StoreFilters 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      
      {/* Stores Grid */}
      {isLoading ? (
        <div className="text-center p-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-2"></div>
          <p className="text-gray-500">Loading stores...</p>
        </div>
      ) : (
        <StoreGrid 
          stores={filteredStores} 
          handleStoreClick={handleStoreClick} 
        />
      )}
    </div>
  );
};

const StoreFilters = ({ searchQuery, setSearchQuery, statusFilter, setStatusFilter }) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="col-span-2">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stores by name, address, or manager..."
              className="pl-10 pr-4 py-2 border rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

const StoreGrid = ({ stores, handleStoreClick }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stores.length > 0 ? (
        stores.map((store) => (
          <StoreCard 
            key={store.id} 
            store={store} 
            onClick={() => handleStoreClick(store.id)} 
          />
        ))
      ) : (
        <div className="col-span-full bg-white p-6 rounded-lg shadow text-center">
          <Store size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No stores match your search criteria</p>
        </div>
      )}
    </div>
  );
};

const StoreCard = ({ store, onClick }) => {
  return (
    <div 
      className="bg-white rounded-lg shadow overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
      onClick={onClick}
    >
      <div className="h-40 bg-gray-200">
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
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-900">{store.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(store.status)}`}>
            {store.status}
          </span>
        </div>
        <p className="text-sm text-gray-500 mt-2 flex items-center">
          <MapPin size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{store.address}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Phone size={14} className="mr-1 flex-shrink-0" />
          {store.phone}
        </p>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Mail size={14} className="mr-1 flex-shrink-0" />
          <span className="truncate">{store.email}</span>
        </p>
        <div className="mt-4 flex justify-between text-sm">
          <div>
            <p className="font-medium text-gray-900">{store.activeListings}</p>
            <p className="text-gray-500">Active Items</p>
          </div>
          <div>
            <p className="font-medium text-gray-900">{store.totalInventory}</p>
            <p className="text-gray-500">Total Inventory</p>
          </div>
          <div className="flex items-center text-blue-600">
            <span className="font-medium">Details</span>
            <ChevronRight size={16} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stores;