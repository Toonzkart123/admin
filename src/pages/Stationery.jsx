import React, { useState, useEffect } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Download, Upload, 
  Search, ChevronDown, CheckCircle, Pencil, PenTool,
  Info, Package, DollarSign, Tag, AlertCircle
} from 'lucide-react';
import axios from 'axios';

const Stationery = () => {
  // API base URL
  const API_BASE_URL = "https://backend-lzb7.onrender.com";
  
  // State for stationery products
  const [stationeryItems, setStationeryItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // State for filters
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [sortBy, setSortBy] = useState('name-asc');
  
  // State for refresh trigger
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // State for modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    brand: '',
    price: '',
    stock: '',
    description: '',
    image: ''
  });

  // Load stationery items
  useEffect(() => {
    const fetchStationeryItems = async () => {
      setLoading(true);
      try {
        // Get authentication token from localStorage
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setError('Authentication required. Please log in again.');
          setLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_BASE_URL}/api/admin/stationery`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (response.data) {
          setStationeryItems(response.data);
        } else {
          setError('No data received from server');
        }
      } catch (err) {
        console.error('Error fetching stationery items:', err);
        setError(
          err.response?.data?.message || 
          'Failed to load stationery items. Please check your connection and try again.'
        );
      } finally {
        setLoading(false);
      }
    };
    
    fetchStationeryItems();
  }, [refreshTrigger]); // Add refreshTrigger as a dependency

  // Handle search and filtering
  const filteredItems = stationeryItems.filter(item => {
    // Search query filter
    const matchesSearch = searchQuery === '' || (
      (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (item.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
    
    // Category filter
    const matchesCategory = categoryFilter === 'All' || item.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // Sort items
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (sortBy === 'name-asc') return (a.name || '').localeCompare(b.name || '');
    if (sortBy === 'name-desc') return (b.name || '').localeCompare(a.name || '');
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'stock-asc') return (a.stock || 0) - (b.stock || 0);
    if (sortBy === 'stock-desc') return (b.stock || 0) - (a.stock || 0);
    return 0;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(stationeryItems.map(item => item.category).filter(Boolean))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Handle adding new item
  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      stock: '',
      description: '',
      image: ''
    });
    setIsModalOpen(true);
  };

  // Handle editing item
  const handleEditItem = (item) => {
    setCurrentItem(item);
    setFormData({
      name: item.name || '',
      category: item.category || '',
      brand: item.brand || '',
      price: item.price?.toString() || '',
      stock: item.stock?.toString() || '',
      description: item.description || '',
      image: item.image || ''
    });
    setIsModalOpen(true);
  };

  // Handle input change in form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.category || !formData.price || !formData.stock) {
      alert('Please fill all required fields');
      return;
    }

    try {
      // Get authentication token
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        return;
      }

      // Create item data
      const itemData = {
        name: formData.name,
        category: formData.category,
        brand: formData.brand || undefined,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        description: formData.description || undefined,
        image: formData.image || undefined,
        // Determine status based on stock
        status: parseInt(formData.stock) <= 0 ? 'Out of Stock' : 
                parseInt(formData.stock) >= 1 ? 'In Stock' : 'Out of Stock'
      };

      if (currentItem) {
        // Update existing item
        await axios.put(
          `${API_BASE_URL}/api/admin/stationery/${currentItem._id}`, 
          itemData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Update local state
        setStationeryItems(prev => 
          prev.map(item => item._id === currentItem._id ? 
            { ...item, ...itemData } : item
          )
        );
      } else {
        // Add new item
        const response = await axios.post(
          `${API_BASE_URL}/api/admin/stationery`, 
          itemData,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          }
        );
        
        // Add to local state
        setStationeryItems(prev => [...prev, response.data]);
      }

      // Close modal and refresh data
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1);
      
    } catch (err) {
      console.error('Error saving stationery item:', err);
      alert(err.response?.data?.message || 'Failed to save item. Please try again.');
    }
  };

  // Handle delete item
  const handleDeleteItem = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        // Get authentication token
        const token = localStorage.getItem('adminToken');
        
        if (!token) {
          setError('Authentication required. Please log in again.');
          return;
        }

        // Call delete API
        await axios.delete(
          `${API_BASE_URL}/api/admin/stationery/${id}`,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
        
        // Update local state and refresh data
        setStationeryItems(prev => prev.filter(item => item._id !== id));
        setRefreshTrigger(prev => prev + 1);
        
      } catch (err) {
        console.error('Error deleting stationery item:', err);
        alert(err.response?.data?.message || 'Failed to delete item. Please try again.');
      }
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <PenTool className="mr-2" />
            Stationery Inventory
          </h1>
          <p className="text-gray-600">Manage your stationery products inventory</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          Add New Item
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <input
                type="text"
                placeholder="Search stationery items..."
                className="border rounded-lg pl-10 pr-4 py-2 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center">
              <label className="mr-2 text-gray-600 whitespace-nowrap">Category:</label>
              <select
                className="border rounded-lg px-3 py-2"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <label className="mr-2 text-gray-600 whitespace-nowrap">Sort By:</label>
              <select
                className="border rounded-lg px-3 py-2"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="stock-asc">Stock (Low to High)</option>
                <option value="stock-desc">Stock (High to Low)</option>
              </select>
            </div>

            <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg flex items-center hover:bg-gray-200">
              <Filter size={16} className="mr-1" />
              More Filters
            </button>

            <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg flex items-center hover:bg-gray-200">
              <Download size={16} className="mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stationery Items Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
              <p className="text-gray-600">Loading stationery inventory...</p>
            </div>
          ) : error ? (
            <div className="p-8 text-center text-red-600">
              <AlertCircle size={48} className="mx-auto mb-4" />
              <p>{error}</p>
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Brand
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {currentItems.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      <Package className="mx-auto mb-3" size={48} />
                      <p className="text-lg font-medium">No stationery items found</p>
                      <p className="text-sm mt-1">Try adjusting your search or filters</p>
                    </td>
                  </tr>
                ) : (
                  currentItems.map(item => (
                    <tr key={item._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded-md flex items-center justify-center text-gray-500 mr-3">
                            <Pencil size={18} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{item.name}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {item.category ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {item.brand || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap font-medium">
                        <div className="flex items-center">
                          <DollarSign size={16} className="text-gray-400 mr-1" />
                          {item.price?.toFixed(2)}
                          {item.discount > 0 && (
                            <span className="ml-2 text-xs text-green-600">-{item.discount}%</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                        {item.stock} units
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : item.status === 'Low Stock'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-center space-x-2">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {!loading && !error && sortedItems.length > 0 && (
          <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">{indexOfFirstItem + 1}</span> to{' '}
                  <span className="font-medium">
                    {Math.min(indexOfLastItem, sortedItems.length)}
                  </span>{' '}
                  of <span className="font-medium">{sortedItems.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-5 w-5 transform rotate-90" />
                  </button>
                  
                  {/* Page numbers */}
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPage(index + 1)}
                      className={`relative inline-flex items-center px-4 py-2 border ${
                        currentPage === index + 1
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      } text-sm font-medium`}
                    >
                      {index + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-5 w-5 transform -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold text-gray-800">
                {currentItem ? 'Edit Stationery Item' : 'Add New Stationery Item'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Item Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Category <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    >
                      <option value="">Select a category</option>
                      <option value="Pens">Pens</option>
                      <option value="Pencils">Pencils</option>
                      <option value="Notebooks">Notebooks</option>
                      <option value="Erasers">Erasers</option>
                      <option value="Markers">Markers</option>
                      <option value="Files & Folders">Files & Folders</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Brand
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                      rows={3}
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price (₹) <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">₹</span>
                      </div>
                      <input
                        type="number"
                        name="price"
                        min="0"
                        step="0.01"
                        value={formData.price}
                        onChange={handleInputChange}
                        className="border rounded-lg pl-8 pr-3 py-2 w-full"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Stock Quantity <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      name="stock"
                      min="0"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Image URL
                    </label>
                    <input
                      type="text"
                      name="image"
                      value={formData.image}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full"
                      placeholder="image.jpg"
                    />
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mt-4">
                    <div className="flex items-start">
                      <Info size={16} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-sm text-blue-800">
                        <p className="font-medium">Inventory Note:</p>
                        <p>Items with stock below 20 will be marked as "Low Stock".</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {currentItem ? 'Update Item' : 'Add Item'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Stationery;