// src/pages/Schools.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Search, GraduationCap, Edit, Trash2, MapPin } from 'lucide-react';
import SchoolModal from '../components/modules/schools/SchoolModal';

const Schools = () => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSchool, setCurrentSchool] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch schools data from API
  useEffect(() => {
    const fetchSchools = async () => {
      try {
        setLoading(true);
        
        // Get the token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication token is required');
        }
        
        const response = await fetch('https://backend-lzb7.onrender.com/api/admin/schools', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to fetch schools: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        setSchools(data);
        setFilteredSchools(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching schools:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredSchools(schools);
    } else {
      const lowerSearchTerm = searchTerm.toLowerCase();
  
      const filtered = schools.filter(school => 
        (school.name?.toLowerCase() ?? '').includes(lowerSearchTerm) ||
        (school.address?.toLowerCase() ?? '').includes(lowerSearchTerm)
      );
  
      setFilteredSchools(filtered);
    }
  }, [searchTerm, schools]);

  const handleAddSchool = () => {
    setCurrentSchool(null);
    setIsModalOpen(true);
  };

  const handleEditSchool = (id) => {
    const schoolToEdit = schools.find(school => school._id === id);
    setCurrentSchool(schoolToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteSchool = async (id) => {
    if (window.confirm('Are you sure you want to delete this school?')) {
      try {
        // Get the token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          throw new Error('Authentication token is required');
        }
        
        const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/schools/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to delete school: ${response.status} ${response.statusText}`);
        }
        
        // Update state after successful deletion
        const updatedSchools = schools.filter(school => school._id !== id);
        setSchools(updatedSchools);
        setFilteredSchools(updatedSchools);
        
        // Show success message
        alert('School deleted successfully');
      } catch (err) {
        console.error('Error deleting school:', err);
        alert(`Failed to delete school: ${err.message}`);
      }
    }
  };

  const handleSaveSchool = async (schoolData) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      // Create a FormData object for multipart/form-data
      const formData = new FormData();
      
      // Add all text fields to the FormData
      Object.keys(schoolData).forEach(key => {
        if (key !== 'image' || (key === 'image' && schoolData[key] instanceof File)) {
          formData.append(key, schoolData[key]);
        }
      });
      
      let response;
      
      if (schoolData._id) {
        // Update existing school
        response = await fetch(`https://backend-lzb7.onrender.com/api/admin/schools/${schoolData._id}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData
          },
          body: formData
        });
      } else {
        // Add new school
        response = await fetch('https://backend-lzb7.onrender.com/api/admin/schools', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
            // Don't set Content-Type for FormData
          },
          body: formData
        });
      }
      
      if (!response.ok) {
        throw new Error(`Failed to save school: ${response.status} ${response.statusText}`);
      }
      
      // Refresh school list after successful save
      const refreshResponse = await fetch('https://backend-lzb7.onrender.com/api/admin/schools', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!refreshResponse.ok) {
        throw new Error(`Failed to refresh schools: ${refreshResponse.status} ${refreshResponse.statusText}`);
      }
      
      const updatedSchools = await refreshResponse.json();
      setSchools(updatedSchools);
      setFilteredSchools(updatedSchools);
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving school:', err);
      alert(`Failed to save school: ${err.message}`);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Schools Management</h1>
            <p className="text-gray-500 mt-1">Manage schools and their book requirements</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button 
              onClick={handleAddSchool}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              <PlusCircle size={16} className="mr-2" />
              Add School
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search schools by name or address..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
      
      {/* Schools list */}
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading schools...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : filteredSchools.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <GraduationCap size={48} className="mx-auto text-gray-400 mb-2" />
          <p className="text-gray-500">No schools found. Add your first school to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchools.map((school) => (
            <SchoolCard
              key={school._id}
              school={school}
              onEdit={handleEditSchool}
              onDelete={handleDeleteSchool}
            />
          ))}
        </div>
      )}
      
      {isModalOpen && (
        <SchoolModal 
          school={currentSchool} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveSchool} 
        />
      )}
    </div>
  );
};

// School Card Component
const SchoolCard = ({ school, onEdit, onDelete }) => {
  // Handle image URL from API
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's already a full URL
    if (imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // If it's a path from the API
    return `https://backend-lzb7.onrender.com${imagePath}`;
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="h-40 bg-gray-200 relative">
        {school.image ? (
          <img 
            src={getImageUrl(school.image)} 
            alt={school.name} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-50 text-blue-500">
            <GraduationCap size={64} />
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="font-medium text-lg text-gray-900">{school.name}</h3>
        <p className="text-sm text-gray-600 mt-1">{school.city}</p>
        <p className="text-sm text-gray-600 mt-1 flex items-start">
          <MapPin size={14} className="mr-1 mt-0.5 flex-shrink-0" />
          {school.address}
        </p>
        
        <div className="mt-auto pt-4 flex justify-between border-t border-gray-100">
          <button 
            onClick={() => onEdit(school._id)} 
            className="text-blue-600 hover:text-blue-800 flex items-center transition duration-150"
          >
            <Edit size={16} className="mr-1" />
            <span className="text-sm">Edit</span>
          </button>
          
          <button 
            onClick={() => {
              if (window.confirm(`Are you sure you want to delete "${school.name}"?`)) {
                onDelete(school._id);
              }
            }} 
            className="text-red-500 hover:text-red-700 flex items-center transition duration-150"
          >
            <Trash2 size={16} className="mr-1" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Schools;