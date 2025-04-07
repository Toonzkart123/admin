// src/pages/Promotions.jsx
import { useState, useEffect } from 'react';
import { 
  Tag, Plus, Edit, Trash2, Search, 
  X, Check, Percent, DollarSign, Calendar
} from 'lucide-react';
import { format } from 'date-fns';
import axios from 'axios'; // You'll need to install axios if not already installed

const Promotions = () => {
  // State for promotions, search, modal, and editing
  const [promotions, setPromotions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    discountType: 'percentage',
    discountValue: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    isActive: true
  });

  // API base URL
  const API_BASE_URL = 'https://backend-lzb7.onrender.com/api/admin/promocodes';

  // Create a function to get the headers with the current token
  const getHeaders = () => {
    const token = localStorage.getItem('adminToken');
    console.log("Token from localStorage:", token ? "Token exists" : "No token found");
    
    // Check if user is logged in - redirect to login if no token
    if (!token) {
      console.error("No authentication token found");
      // Uncomment this if you want to redirect to login
      // window.location.href = '/login';
      return {};
    }
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  };

  // Fetch all promo codes
  const fetchPromoCodes = async () => {
    setLoading(true);
    try {
      console.log("Fetching promo codes...");
      const headers = getHeaders();
      console.log("Headers being sent:", JSON.stringify(headers));
      
      const response = await axios.get(API_BASE_URL, { headers });
      console.log("API Response:", response.data);
      
      // Transform the API response to match our component's data structure
      const formattedPromotions = response.data.map(promo => ({
        id: promo._id,
        code: promo.code,
        name: promo.name,
        type: promo.discountType,
        value: promo.discountValue,
        startDate: new Date(promo.startDate),
        endDate: new Date(promo.endDate),
        isActive: promo.isActive
      }));
      
      setPromotions(formattedPromotions);
      setError(null);
    } catch (err) {
      console.error('Error fetching promo codes:', err);
      
      // More detailed error logging
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error("Response error data:", err.response.data);
        console.error("Response error status:", err.response.status);
        console.error("Response error headers:", err.response.headers);
        
        if (err.response.status === 401) {
          setError('Authentication failed. Please log in again.');
          // Optionally, redirect to login page
          // window.location.href = '/login';
        } else {
          setError(`Failed to load promotions. Server returned: ${err.response.status}`);
        }
      } else if (err.request) {
        // The request was made but no response was received
        console.error("No response received:", err.request);
        setError('Failed to load promotions. No response from server.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error setting up request:", err.message);
        setError('Failed to load promotions. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Add a function to check if the right token format is being used
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('adminToken');
      console.log("Current auth token status:", token ? "Present" : "Missing");
      
      // This helps debug issues with the token format
      if (token) {
        if (token.startsWith('Bearer ')) {
          console.warn("Warning: Token already contains 'Bearer ' prefix. This might cause issues.");
        }
      }
    };
    
    checkAuth();
  }, []);

  // Fetch all promo codes on component mount
  useEffect(() => {
    fetchPromoCodes();
  }, []);

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promo => 
    promo.code.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (promo.name && promo.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Handle opening the modal for creating or editing
  const handleOpenModal = async (promotion = null) => {
    if (promotion) {
      // Edit existing promotion - fetch full details if needed
      try {
        const response = await axios.get(`${API_BASE_URL}/${promotion.id}`, { headers: getHeaders() });
        const promoDetails = response.data;
        
        setEditingPromotion(promotion);
        setFormData({
          code: promoDetails.code,
          name: promoDetails.name || '',
          discountType: promoDetails.discountType,
          discountValue: promoDetails.discountValue,
          startDate: format(new Date(promoDetails.startDate), 'yyyy-MM-dd'),
          endDate: format(new Date(promoDetails.endDate), 'yyyy-MM-dd'),
          isActive: promoDetails.isActive
        });
      } catch (err) {
        console.error('Error fetching promotion details:', err);
        alert('Could not load promotion details. Please try again.');
        return;
      }
    } else {
      // Create new promotion
      setEditingPromotion(null);
      setFormData({
        code: '',
        name: '',
        discountType: 'percentage',
        discountValue: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Create the promotion object for API
    const promotionData = {
      code: formData.code,
      name: formData.name || formData.code, // Use code as name if not provided
      discountType: formData.discountType,
      discountValue: parseFloat(formData.discountValue),
      startDate: new Date(formData.startDate).toISOString(),
      endDate: new Date(formData.endDate).toISOString(),
      isActive: formData.isActive
    };
    
    try {
      if (editingPromotion) {
        // Update existing promotion
        await axios.put(`${API_BASE_URL}/${editingPromotion.id}`, promotionData, { headers: getHeaders() });
      } else {
        // Add new promotion
        await axios.post(API_BASE_URL, promotionData, { headers: getHeaders() });
      }
      
      // Refresh promotions list
      await fetchPromoCodes();
      
      // Close modal
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error saving promotion:', err);
      alert('Failed to save promotion. Please try again.');
    }
  };

  // Handle promotion deletion
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      try {
        await axios.delete(`${API_BASE_URL}/${id}`, { headers: getHeaders() });
        // Refresh promotions list after successful deletion
        await fetchPromoCodes();
      } catch (err) {
        console.error('Error deleting promotion:', err);
        alert('Failed to delete promotion. Please try again.');
      }
    }
  };

  // Handle toggling promotion active status
  const toggleActiveStatus = async (id) => {
    const promotion = promotions.find(promo => promo.id === id);
    if (!promotion) return;
    
    try {
      await axios.put(`${API_BASE_URL}/${id}`, 
        { isActive: !promotion.isActive }, 
        { headers: getHeaders() }
      );
      // Refresh promotions list
      await fetchPromoCodes();
    } catch (err) {
      console.error('Error updating promotion status:', err);
      alert('Failed to update promotion status. Please try again.');
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Tag className="mr-2 text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Promotion
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search promo codes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="text-center py-10">
          <div className="spinner-border text-blue-500" role="status">
            <span className="sr-only">Loading...</span>
          </div>
          <p className="mt-2 text-gray-600">Loading promotions...</p>
        </div>
      ) : (
        /* Promotions Table */
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPromotions.length > 0 ? (
                filteredPromotions.map((promotion) => (
                  <tr key={promotion.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{promotion.code}</div>
                      {promotion.name && promotion.name !== promotion.code && (
                        <div className="text-sm text-gray-500">{promotion.name}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {promotion.type === 'percentage' ? (
                          <>
                            <Percent size={16} className="mr-1 text-green-600" />
                            <span>{promotion.value}% off</span>
                          </>
                        ) : (
                          <>
                            <DollarSign size={16} className="mr-1 text-green-600" />
                            <span>${promotion.value.toFixed(2)} off</span>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {format(new Date(promotion.startDate), 'MM/dd/yyyy')} - {format(new Date(promotion.endDate), 'MM/dd/yyyy')}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span 
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {promotion.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleOpenModal(promotion)}
                        className="mr-2 p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button 
                        onClick={() => handleDelete(promotion.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                    No promotions found. Try a different search or create a new promotion.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add/Edit Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Promo Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">Promo Code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    required
                  />
                </div>

                {/* Promo Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">Promo Name</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    placeholder="e.g. Summer Campaign"
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label htmlFor="discountType" className="block text-sm font-medium text-gray-700">Discount Type</label>
                  <select
                    id="discountType"
                    name="discountType"
                    value={formData.discountType}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label htmlFor="discountValue" className="block text-sm font-medium text-gray-700">
                    {formData.discountType === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {formData.discountType === 'percentage' ? <Percent size={16} className="text-gray-400" /> : <DollarSign size={16} className="text-gray-400" />}
                    </div>
                    <input
                      type="number"
                      id="discountValue"
                      name="discountValue"
                      value={formData.discountValue}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                      placeholder={formData.discountType === 'percentage' ? "10" : "5.99"}
                      min={formData.discountType === 'percentage' ? "0" : "0.01"}
                      max={formData.discountType === 'percentage' ? "100" : "1000"}
                      step={formData.discountType === 'percentage' ? "1" : "0.01"}
                      required
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingPromotion ? 'Save Changes' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;