// src/pages/StoreDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, BarChart2 } from 'lucide-react';

// Utilities and data
import { mockStores, mockInventory } from '../data/storeMockData';

// Components
import Loader from '../components/common/Loader';
import StoreHeader from '../components/stores/StoreHeader';
import StoreTabs from '../components/stores/StoreTabs';
import StoreEditForm from '../components/stores/StoreEditForm';
import StoreOverview from '../components/stores/overview/StoreOverview';
import StoreInventory from '../components/stores/inventory/StoreInventory';
import FeaturePlaceholder from '../components/stores/FeaturePlaceholder';

// Utility functions
export const getStatusBadgeClass = (status) => {
  switch(status?.toLowerCase()) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-red-100 text-red-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const getInventoryStatusClass = (status) => {
  switch(status) {
    case 'In Stock':
      return 'bg-green-100 text-green-800';
    case 'Low Stock':
      return 'bg-yellow-100 text-yellow-800';
    case 'Out of Stock':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const StoreDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [store, setStore] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  
  // Fetch store data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      if (id === 'new') {
        setStore({
          id: 'new',
          name: "",
          address: "",
          phone: "",
          email: "",
          manager: "",
          status: "Pending",
          description: "",
          website: "",
          storeHours: "",
          commissionRate: 10,
          image: ""
        });
        setIsEditing(true);
      } else {
        // In a real app, this would be an API call
        const foundStore = mockStores.find(s => s.id.toString() === id);
        if (foundStore) {
          setStore(foundStore);
          // Fetch store inventory
          const storeInventory = mockInventory.filter(item => item.storeId.toString() === id);
          setInventory(storeInventory);
        }
      }
      setIsLoading(false);
    }, 500);
  }, [id]);
  
  useEffect(() => {
    if (store) {
      setFormData({...store});
    }
  }, [store]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleSave = () => {
    // In a real app, this would be an API call
    console.log("Saving store data:", formData);
    setStore(formData);
    setIsEditing(false);
  };
  
  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this store? This action cannot be undone.")) {
      // In a real app, this would be an API call
      console.log("Deleting store:", store.id);
      navigate('/stores');
    }
  };
  
  if (isLoading) {
    return <Loader message="Loading store details..." />;
  }

  if (!store) {
    return <div className="w-full p-6 text-center text-gray-500">Store not found</div>;
  }

  return (
    <div className="w-full p-6">
      {/* Header */}
      <StoreHeader 
        id={id}
        store={store}
        isEditing={isEditing}
        setIsEditing={setIsEditing}
        handleSave={handleSave}
        handleDelete={handleDelete}
        setFormData={setFormData}
      />
      
      {/* Tabs */}
      <StoreTabs
        id={id}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />
      
      {/* Content */}
      {isEditing ? (
        <StoreEditForm 
          formData={formData} 
          setFormData={setFormData} 
          handleChange={handleChange} 
        />
      ) : (
        <>
          {activeTab === 'overview' && <StoreOverview store={store} />}
          
          {activeTab === 'inventory' && <StoreInventory inventory={inventory} />}
          
          {activeTab === 'orders' && (
            <FeaturePlaceholder icon={<Package />} title="Store Orders" />
          )}
          
          {activeTab === 'analytics' && (
            <FeaturePlaceholder icon={<BarChart2 />} title="Store Analytics" />
          )}
        </>
      )}
    </div>
  );
};

export default StoreDetails;