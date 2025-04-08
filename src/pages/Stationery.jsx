import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Filter, Download, Upload, 
  Search, ChevronDown, CheckCircle, Pencil, PenTool,
  Info, Package, DollarSign, Tag, AlertCircle, Image as ImageIcon,
  Layers, Hash, Palette, Box
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
    originalPrice: '',
    discount: '0',
    stock: '',
    description: '',
    material: '',
    color: '',
    code: '',
    image: null,
    imagePreview: ''
  });

  // File input reference
  const fileInputRef = useRef(null);
  
  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Category options
  const categoryOptions = [
    "Pens", "Pencils", "Notebooks", "Erasers", "Markers", "Files & Folders", "Other"
  ];

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
  }, [refreshTrigger]); 

  // Handle search and filtering
  const filteredItems = stationeryItems.filter(item => {
    // Search query filter
    const matchesSearch = searchQuery === '' || (
      (item.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
      (item.brand?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.description?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (item.code?.toString() || '').includes(searchQuery)
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
    if (sortBy === 'code-asc') return (a.code || 0) - (b.code || 0);
    if (sortBy === 'code-desc') return (b.code || 0) - (a.code || 0);
    return 0;
  });

  // Get unique categories for filter
  const categories = ['All', ...new Set(stationeryItems.map(item => item.category).filter(Boolean))];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedItems.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);

  // Handle file change
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Preview image
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle adding new item
  const handleAddItem = () => {
    setCurrentItem(null);
    setFormData({
      name: '',
      category: '',
      brand: '',
      price: '',
      originalPrice: '',
      discount: '0',
      stock: '',
      description: '',
      material: '',
      color: '',
      code: '',
      image: null,
      imagePreview: ''
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
      originalPrice: item.originalPrice?.toString() || '',
      discount: item.discount?.toString() || '0',
      stock: item.stock?.toString() || '',
      description: item.description || '',
      material: item.material || '',
      color: item.color || '',
      code: item.code?.toString() || '',
      image: null,
      imagePreview: item.image || ''
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

  // Handle form submission with multipart/form-data
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form - required fields as per model: name, category, price, stock, code
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill all required fields: Name, Category, Price, Stock, and Code');
      return;
    }

    try {
      setIsUploading(true);
      setUploadProgress(0);
      
      // Get authentication token
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setError('Authentication required. Please log in again.');
        setIsUploading(false);
        return;
      }

      // Create FormData object for multipart/form-data
      const multipartFormData = new FormData();
      multipartFormData.append('name', formData.name);
      multipartFormData.append('category', formData.category);
      
      if (formData.brand) {
        multipartFormData.append('brand', formData.brand);
      }
      
      multipartFormData.append('price', parseFloat(formData.price));
      
      if (formData.originalPrice) {
        multipartFormData.append('originalPrice', parseFloat(formData.originalPrice));
      }
      
      if (formData.discount) {
        multipartFormData.append('discount', parseFloat(formData.discount));
      }
      
      multipartFormData.append('stock', parseInt(formData.stock));
      multipartFormData.append('code', parseInt(formData.code));
      
      if (formData.description) {
        multipartFormData.append('description', formData.description);
      }
      
      if (formData.material) {
        multipartFormData.append('material', formData.material);
      }
      
      if (formData.color) {
        multipartFormData.append('color', formData.color);
      }
      
      // Add status based on stock
      const status = parseInt(formData.stock) <= 0 ? 'Out of Stock' : 'In Stock';
      multipartFormData.append('status', status);
      
      // If there's a new image file, append it
      if (formData.image instanceof File) {
        multipartFormData.append('image', formData.image);
      } else if (formData.imagePreview && formData.imagePreview.startsWith('http')) {
        // If using existing image URL from server
        multipartFormData.append('imageUrl', formData.imagePreview);
      }

      // Configure axios with progress tracking
      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(percentCompleted);
        }
      };

      if (currentItem) {
        // Update existing item
        const response = await axios.put(
          `${API_BASE_URL}/api/admin/stationery/${currentItem._id}`, 
          multipartFormData,
          axiosConfig
        );
        
        // Update local state
        setStationeryItems(prev => 
          prev.map(item => item._id === currentItem._id ? response.data : item)
        );
      } else {
        // Add new item
        const response = await axios.post(
          `${API_BASE_URL}/api/admin/stationery`, 
          multipartFormData,
          axiosConfig
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
    } finally {
      setIsUploading(false);
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

  // Pagination navigation
  const goToPage = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Create pagination array with ellipsis for large page counts
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + 4, totalPages);
    
    if (end - start < 4) {
      start = Math.max(end - 4, 1);
    }
    
    let pages = [];
    
    // Add first page and ellipsis if needed
    if (start > 1) {
      pages.push(1);
      if (start > 2) pages.push('...');
    }
    
    // Add middle pages
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    
    // Add ellipsis and last page if needed
    if (end < totalPages) {
      if (end < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="p-4 md:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 flex items-center">
            <PenTool className="mr-2" />
            Stationery Inventory
          </h1>
          <p className="text-sm md:text-base text-gray-600">Manage your stationery products inventory</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors text-sm md:text-base w-full md:w-auto justify-center"
        >
          <Plus size={16} className="mr-1" />
          Add New Item
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 md:mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="w-full md:w-64">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name, code, brand..."
                className="border rounded-lg pl-9 pr-3 py-2 w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center">
              <select
                className="border rounded-lg px-2 py-2 text-sm"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categoryOptions.map((category, index) => (
                  <option key={index} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div className="flex items-center">
              <select
                className="border rounded-lg px-2 py-2 text-sm"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="name-asc">Name (A-Z)</option>
                <option value="name-desc">Name (Z-A)</option>
                <option value="price-asc">Price (Low to High)</option>
                <option value="price-desc">Price (High to Low)</option>
                <option value="stock-asc">Stock (Low to High)</option>
                <option value="stock-desc">Stock (High to Low)</option>
                <option value="code-asc">Code (Low to High)</option>
                <option value="code-desc">Code (High to Low)</option>
              </select>
            </div>

            <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-lg flex items-center hover:bg-gray-200 text-sm">
              <Download size={14} className="mr-1" />
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
            <table className="min-w-full divide-y divide-gray-200 table-fixed">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40 md:w-60">
                    Product
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Category
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Code
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Price
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                    Stock
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Status
                  </th>
                  <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
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
                      <td className="px-3 py-3 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-9 w-9 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-2 overflow-hidden flex-shrink-0">
                            {item.image ? (
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="h-full w-full object-cover" 
                                onError={(e) => {
                                  e.target.onError = null;
                                  e.target.src = "";
                                  e.target.parentNode.innerHTML = '<span class="text-gray-400"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></span>';
                                }}
                              />
                            ) : (
                              <Pencil size={16} />
                            )}
                          </div>
                          <div className="truncate max-w-xs">
                            <div className="font-medium text-gray-900 text-sm truncate">{item.name}</div>
                            <div className="text-xs text-gray-500 truncate">{item.brand || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        {item.category ? (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {item.category}
                          </span>
                        ) : (
                          <span className="text-gray-400 text-xs">-</span>
                        )}
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-700 text-sm">
                        <span className="flex items-center">
                          <Hash size={14} className="text-gray-400 mr-1" />
                          {item.code || '-'}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-sm">
                        <div>
                          <div className="font-medium flex items-center">
                            <span className="text-gray-400 mr-1">₹</span>
                            {item.price?.toFixed(2)}
                          </div>
                          {item.originalPrice && item.originalPrice > item.price && (
                            <div className="text-xs text-gray-500 line-through">₹{item.originalPrice.toFixed(2)}</div>
                          )}
                          {item.discount > 0 && (
                            <span className="text-xs text-green-600">-{item.discount}%</span>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-gray-700 text-sm">
                        {item.stock} units
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                          item.status === 'In Stock' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="px-3 py-3 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-center space-x-1">
                          <button 
                            onClick={() => handleEditItem(item)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="Edit"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={() => handleDeleteItem(item._id)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="Delete"
                          >
                            <Trash2 size={16} />
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

        {/* Pagination - Improved for mobile and better navigation */}
        {!loading && !error && sortedItems.length > 0 && (
          <div className="bg-white px-3 py-3 flex items-center justify-between border-t border-gray-200 sm:px-4">
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-xs text-gray-700">
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
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === 1 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Previous</span>
                    <ChevronDown className="h-4 w-4 transform rotate-90" />
                  </button>
                  
                  {/* Page numbers with ellipsis for large page counts */}
                  {getPaginationGroup().map((page, index) => {
                    if (page === '...') {
                      return (
                        <span 
                          key={index} 
                          className="relative inline-flex items-center px-3 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-3 py-2 border ${
                          currentPage === page
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                        } text-sm font-medium`}
                      >
                        {page}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === totalPages 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-500 hover:bg-gray-50'
                    }`}
                  >
                    <span className="sr-only">Next</span>
                    <ChevronDown className="h-4 w-4 transform -rotate-90" />
                  </button>
                </nav>
              </div>
            </div>
            
            {/* Mobile pagination */}
            <div className="flex justify-between items-center w-full sm:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Previous
              </button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 border rounded text-sm ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Item */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 border-b">
              <h2 className="text-lg font-bold text-gray-800">
                {currentItem ? 'Edit Stationery Item' : 'Add New Stationery Item'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left Column */}
                <div className="space-y-4">
                  {/* Basic Information */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Basic Information</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="border rounded-lg px-3 py-2 w-full text-sm"
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
                        className="border rounded-lg px-3 py-2 w-full text-sm"
                        required
                      >
                        <option value="">Select a category</option>
                        {categoryOptions.map((category, index) => (
                          <option key={index} value={category}>{category}</option>
                        ))}
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
                        className="border rounded-lg px-3 py-2 w-full text-sm"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Code <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <Hash size={14} className="text-gray-400" />
                        </div>
                        <input
                          type="number"
                          name="code"
                          min="0"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="border rounded-lg pl-8 px-3 py-2 w-full text-sm"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Product Details</h3>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border rounded-lg px-3 py-2 w-full text-sm"
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Material
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Layers size={14} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleInputChange}
                            className="border rounded-lg pl-8 px-3 py-2 w-full text-sm"
                            placeholder="e.g., Plastic, Metal"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Color
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Palette size={14} className="text-gray-400" />
                          </div>
                          <input
                            type="text"
                            name="color"
                            value={formData.color}
                            onChange={handleInputChange}
                            className="border rounded-lg pl-8 px-3 py-2 w-full text-sm"
                            placeholder="e.g., Blue, Red"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Right Column */}
                <div className="space-y-4">
                  {/* Pricing and Inventory */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Pricing & Inventory</h3>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Selling Price (₹) <span className="text-red-500">*</span>
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
                            className="border rounded-lg pl-7 pr-3 py-2 w-full text-sm"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          MRP (₹)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">₹</span>
                          </div>
                          <input
                            type="number"
                            name="originalPrice"
                            min="0"
                            step="0.01"
                            value={formData.originalPrice}
                            onChange={handleInputChange}
                            className="border rounded-lg pl-7 pr-3 py-2 w-full text-sm"
                            placeholder="Original price"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Discount (%)
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">%</span>
                          </div>
                          <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="border rounded-lg pl-7 pr-3 py-2 w-full text-sm"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Stock Quantity <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Box size={14} className="text-gray-400" />
                          </div>
                          <input
                            type="number"
                            name="stock"
                            min="0"
                            value={formData.stock}
                            onChange={handleInputChange}
                            className="border rounded-lg pl-8 px-3 py-2 w-full text-sm"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Image */}
                  <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                    <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Product Image</h3>
                    
                    <div 
                      onClick={() => fileInputRef.current.click()}
                      className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      {formData.imagePreview ? (
                        <>
                          <img 
                            src={formData.imagePreview} 
                            alt="Product preview" 
                            className="h-32 w-32 object-contain mb-2"
                          />
                          <p className="text-xs text-blue-600">Click to change</p>
                        </>
                      ) : (
                        <>
                          <ImageIcon size={36} className="text-gray-400 mb-2" />
                          <p className="text-sm text-gray-500">Upload image</p>
                          <p className="text-xs text-gray-400 mt-1">Click to browse</p>
                        </>
                      )}
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </div>
                    
                    {/* Upload Progress */}
                    {isUploading && (
                      <div>
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Upload Progress</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-blue-600 h-1.5 rounded-full" 
                            style={{ width: `${uploadProgress}%` }}
                          ></div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Info Alert */}
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="flex">
                      <Info size={14} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                      <div className="text-xs text-blue-800">
                        <p className="font-medium">Important Information:</p>
                        <ul className="list-disc pl-4 mt-1 space-y-1">
                          <li>Fields marked with <span className="text-red-500">*</span> are required</li>
                          <li>Product code must be unique across all items</li>
                          <li>Items with zero stock will be marked as "Out of Stock"</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end space-x-3 border-t pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center text-sm ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading && (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  )}
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