// src/pages/StoreDetails.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Package, BarChart2 } from 'lucide-react';
import axios from 'axios';

// Components
import Loader from '../components/common/Loader';
import StoreHeader from '../components/stores/StoreHeader';
import StoreTabs from '../components/stores/StoreTabs';
import StoreEditForm from '../components/stores/StoreEditForm';
import StoreOverview from '../components/stores/overview/StoreOverview';
import StoreInventory from '../components/stores/inventory/StoreInventory';
import FeaturePlaceholder from '../components/stores/FeaturePlaceholder';

const API_BASE_URL = 'https://backend-lzb7.onrender.com';

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
  const [error, setError] = useState(null);
  
  const getToken = () => localStorage.getItem('adminToken');

  // Fetch store data
  useEffect(() => {
    const fetchStoreData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (id === 'new') {
          setStore({
            id: 'new',
            storeName: "",
            address: "",
            phoneNumber: "",
            email: "",
            managerName: "",
            status: "Pending",
            description: "",
            website: "",
            storeHours: "",
            commissionRate: 10,
            paymentTerms: "Net 30",
            image: ""
          });
          setIsEditing(true);
          setIsLoading(false);
          return;
        }

        // Fetch existing store
        const token = getToken();
        const response = await axios.get(`${API_BASE_URL}/api/admin/stores/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        setStore(response.data);
        
        // If store has inventory, set it
        if (response.data.inventory) {
          setInventory(response.data.inventory);
        }
      } catch (err) {
        console.error('Error fetching store:', err);
        setError('Failed to load store details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreData();
  }, [id]);
  
  useEffect(() => {
    if (store && store.id !== 'new') {
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
  
  const handleSave = async () => {
    try {
      setIsLoading(true);
      const token = getToken();
      
      // Create FormData for multipart/form-data
      const formDataToSend = new FormData();
      
      // Map UI field names to API field names and add to FormData
      const fieldMappings = {
        storeName: formData.storeName || '',
        address: formData.address || '',
        phoneNumber: formData.phoneNumber || '',
        email: formData.email || '',
        managerName: formData.managerName || '',
        status: formData.status || 'Pending',
        website: formData.website || '',
        storeHours: formData.storeHours || '',
        description: formData.description || '',
        commissionRate: formData.commissionRate || 10,
        paymentTerms: formData.paymentTerms || 'Net 30'
      };
      
      // Append each field to the FormData
      Object.keys(fieldMappings).forEach(key => {
        formDataToSend.append(key, fieldMappings[key]);
      });
  
      // Handle image separately if it's a File object
      if (formData.image instanceof File) {
        formDataToSend.append('image', formData.image);
      }
  
      let response;
      
      if (id === 'new') {
        // Create new store
        response = await axios.post(`${API_BASE_URL}/api/admin/stores`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        // Navigate back to stores page after successful creation
        navigate('/stores');
      } else {
        // Update existing store
        response = await axios.put(`${API_BASE_URL}/api/admin/stores/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        
        setStore(response.data);
        setIsEditing(false);
      }
    } catch (err) {
      console.error('Error saving store:', err);
      alert(`Failed to save store: ${err.response?.data?.message || err.message}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this store? This action cannot be undone.")) {
      try {
        setIsLoading(true);
        const token = getToken();
        
        await axios.delete(`${API_BASE_URL}/api/admin/stores/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        navigate('/stores');
      } catch (err) {
        console.error('Error deleting store:', err);
        alert('Failed to delete store. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  if (isLoading) {
    return <Loader message="Loading store details..." />;
  }

  if (error) {
    return <div className="w-full p-6 text-center text-red-500">{error}</div>;
  }

  if (!store && id !== 'new') {
    return <div className="w-full p-6 text-center text-gray-500">Store not found</div>;
  }

  // Adapt field names for the UI components
  const adaptedStore = {
    id: store._id || 'new',
    name: store.storeName,
    address: store.address,
    phone: store.phoneNumber,
    email: store.email,
    manager: store.managerName,
    status: store.status,
    website: store.website,
    storeHours: store.storeHours,
    description: store.description,
    commissionRate: store.commissionRate,
    paymentTerms: store.paymentTerms,
    image: store.image ? `${API_BASE_URL}/${store.image}` : null,
    createdAt: store.createdAt,
    joinDate: store.createdAt,
    lastUpdate: store.updatedAt || store.createdAt,
    activeListings: inventory.length,
    totalInventory: inventory.length,
    topCategories: []
  };

  return (
    <div className="w-full p-6">
      {/* Header */}
      <StoreHeader 
        id={id}
        store={adaptedStore}
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
          apiBaseUrl={API_BASE_URL}
        />
      ) : (
        <>
          {activeTab === 'overview' && <StoreOverview store={adaptedStore} />}
          
          {activeTab === 'inventory' && <StoreInventory inventory={inventory} storeId={id} apiBaseUrl={API_BASE_URL} />}
          
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