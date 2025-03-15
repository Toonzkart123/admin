// src/components/stores/StoreHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Save, Trash2, Edit, X } from 'lucide-react';

const StoreHeader = ({ 
  id, 
  store, 
  isEditing, 
  setIsEditing, 
  handleSave, 
  handleDelete, 
  setFormData 
}) => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
      <div className="flex items-center">
        <button
          className="mr-4 text-gray-500 hover:text-blue-600 transition duration-150"
          onClick={() => navigate('/stores')}
        >
          <ChevronLeft size={24} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id === 'new' ? 'Add New Store' : store.name}
          </h1>
          {id !== 'new' && (
            <p className="text-gray-500 mt-1">Manage store details and inventory</p>
          )}
        </div>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-2">
        {isEditing ? (
          <>
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              onClick={handleSave}
            >
              <Save size={16} className="mr-2" />
              Save Changes
            </button>
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              onClick={() => {
                setFormData({...store});
                setIsEditing(false);
              }}
            >
              <X size={16} className="mr-2" />
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              onClick={() => setIsEditing(true)}
            >
              <Edit size={16} className="mr-2" />
              Edit Store
            </button>
            {id !== 'new' && (
              <button
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150"
                onClick={handleDelete}
              >
                <Trash2 size={16} className="mr-2" />
                Delete
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoreHeader;