import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, Edit, Trash2, Download, 
  Search, ChevronDown, Pencil, PenTool,
  Info, Package, DollarSign, AlertCircle, Image as ImageIcon
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

  // State for mobile view
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  // File input reference
  const fileInputRef = useRef(null);
  
  // Upload status
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Category options
  const categoryOptions = [
    "Pens", "Pencils", "Notebooks", "Erasers", "Markers", "Files & Folders", "Other"
  ];

  // Handle window resize for mobile detection
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    
    // Validate form - only required fields: name, price, stock
    if (!formData.name || !formData.price || !formData.stock) {
      alert('Please fill all required fields: Name, Price, and Stock');
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
      
      if (formData.category) {
        multipartFormData.append('category', formData.category);
      }
      
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
      
      if (formData.code) {
        multipartFormData.append('code', parseInt(formData.code));
      }
      
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

  // Mobile view card component for stationery item
  const StationeryCard = ({ item }) => (
    <div className="bg-white rounded-lg shadow-sm p-3 mb-3">
      <div className="flex items-start">
        <div className="h-12 w-12 bg-gray-100 rounded-md flex items-center justify-center text-gray-500 mr-3 overflow-hidden flex-shrink-0">
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
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-gray-900 text-sm truncate">{item.name}</h3>
          <div className="flex items-center text-xs text-gray-500 mt-0.5">
            {item.category && (
              <span className="px-1.5 py-0.5 text-xs font-medium rounded bg-blue-100 text-blue-800 mr-2">
                {item.category}
              </span>
            )}
            {item.brand && <span className="mr-2">{item.brand}</span>}
          </div>
          
          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <DollarSign size={14} className="text-gray-500 mr-0.5" />
              <span className="font-medium text-sm">{item.price?.toFixed(2)}</span>
              {item.discount > 0 && (
                <span className="ml-1 text-xs text-green-600">-{item.discount}%</span>
              )}
            </div>
            <div className="text-xs">
              <span className={item.stock > 0 ? "text-green-600" : "text-red-500"}>
                {item.stock} in stock
              </span>
            </div>
          </div>
          
          <div className="flex justify-end mt-2 pt-2 border-t border-gray-100">
            <button 
              onClick={() => handleEditItem(item)}
              className="text-blue-600 hover:text-blue-900 mr-4"
              title="Edit"
            >
              <Edit size={16} />
            </button>
            <button 
              onClick={() => handleDeleteItem(item._id)}
              className="text-red-600 hover:text-red-900"
              title="Delete"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Create pagination array with ellipsis for large page counts
  const getPaginationGroup = () => {
    let start = Math.max(currentPage - 1, 1);
    let end = Math.min(start + 2, totalPages);
    
    if (end - start < 2) {
      start = Math.max(end - 2, 1);
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
    <div className="p-3 md:p-6 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-3">
        <div>
          <h1 className="text-lg md:text-2xl font-bold text-gray-800 flex items-center">
            <PenTool className="mr-2" size={isMobile ? 18 : 24} />
            Stationery
          </h1>
          <p className="text-xs md:text-sm text-gray-600">Manage your inventory</p>
        </div>
        <button 
          onClick={handleAddItem}
          className="bg-blue-600 text-white px-3 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors text-sm w-full md:w-auto justify-center"
        >
          <Plus size={16} className="mr-1" />
          Add Item
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-md shadow-sm p-3 mb-4">
        <div className="flex flex-col gap-3">
          <div className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search items..."
                className="border rounded-md pl-9 pr-3 py-2 w-full text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={15} />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="border rounded-md px-2 py-2 text-sm flex-grow md:flex-grow-0"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="All">All Categories</option>
              {categoryOptions.map((category, index) => (
                <option key={index} value={category}>{category}</option>
              ))}
            </select>

            <select
              className="border rounded-md px-2 py-2 text-sm flex-grow md:flex-grow-0"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="price-asc">Price (Low-High)</option>
              <option value="price-desc">Price (High-Low)</option>
              <option value="stock-asc">Stock (Low-High)</option>
              <option value="stock-desc">Stock (High-Low)</option>
            </select>

            <button className="bg-gray-100 text-gray-600 px-3 py-2 rounded-md flex items-center hover:bg-gray-200 text-sm ml-auto">
              <Download size={14} className="mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Stationery Items Display */}
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-600 text-sm">Loading inventory...</p>
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-600">
            <AlertCircle size={40} className="mx-auto mb-3" />
            <p className="text-sm">{error}</p>
          </div>
        ) : currentItems.length === 0 ? (
          <div className="p-6 text-center">
            <Package className="mx-auto mb-3" size={40} />
            <p className="text-base font-medium text-gray-700">No items found</p>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <>
            {/* Mobile View - Card Layout */}
            <div className="md:hidden p-3">
              {currentItems.map(item => (
                <StationeryCard key={item._id} item={item} />
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Stock
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentItems.map(item => (
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
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* Pagination */}
        {!loading && !error && sortedItems.length > 0 && (
          <div className="bg-white px-3 py-3 flex items-center justify-between border-t border-gray-200">
            {/* Mobile pagination */}
            <div className="flex justify-between items-center w-full md:hidden">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-2 py-1 border rounded text-xs ${
                  currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Prev
              </button>
              
              <span className="text-xs text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-2 py-1 border rounded text-xs ${
                  currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700'
                }`}
              >
                Next
              </button>
            </div>
            
            {/* Desktop pagination */}
            <div className="hidden md:flex md:flex-1 md:items-center md:justify-between">
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
                <nav className="relative inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
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
                          className="relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }
                    return (
                      <button
                        key={index}
                        onClick={() => goToPage(page)}
                        className={`relative inline-flex items-center px-2 py-2 border ${
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
          </div>
        )}
      </div>

      {/* Modal for Add/Edit Item - Mobile-Optimized */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-xl max-h-[90vh] overflow-y-auto">
            <div className="p-3 border-b">
              <h2 className="text-base font-bold text-gray-800">
                {currentItem ? 'Edit Item' : 'Add New Item'}
              </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="p-3">
              {/* Simplified form with just required fields prominently displayed */}
              <div className="space-y-4">
                {/* Required Fields Section */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-3 border border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Required Information</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="border rounded-lg px-3 py-2 w-full text-sm"
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
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
                          className="border rounded-lg pl-7 pr-3 py-2 w-full text-sm"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Stock <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="number"
                        name="stock"
                        min="0"
                        value={formData.stock}
                        onChange={handleInputChange}
                        className="border rounded-lg px-3 py-2 w-full text-sm"
                        placeholder="0"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Additional Fields Section - Collapsible on Mobile */}
                <details className="md:hidden">
                  <summary className="text-sm font-medium text-gray-700 cursor-pointer p-2 bg-gray-50 rounded-lg">
                    Additional Details (Optional)
                  </summary>
                  <div className="p-3 border border-gray-200 rounded-lg mt-2 space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Category
                        </label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="border rounded-lg px-2 py-1.5 w-full text-xs"
                        >
                          <option value="">Select</option>
                          {categoryOptions.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Brand
                        </label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="border rounded-lg px-2 py-1.5 w-full text-xs"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        className="border rounded-lg px-2 py-1.5 w-full text-xs"
                        rows={2}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Code
                        </label>
                        <input
                          type="number"
                          name="code"
                          min="0"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="border rounded-lg px-2 py-1.5 w-full text-xs"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Discount (%)
                        </label>
                        <input
                          type="number"
                          name="discount"
                          min="0"
                          max="100"
                          value={formData.discount}
                          onChange={handleInputChange}
                          className="border rounded-lg px-2 py-1.5 w-full text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </details>
                
                {/* Desktop View - Additional Fields */}
                <div className="hidden md:block space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                      <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Product Details</h3>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                        <select
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="border rounded-lg px-3 py-2 w-full text-sm"
                        >
                          <option value="">Select a category</option>
                          {categoryOptions.map((category, index) => (
                            <option key={index} value={category}>{category}</option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Brand</label>
                        <input
                          type="text"
                          name="brand"
                          value={formData.brand}
                          onChange={handleInputChange}
                          className="border rounded-lg px-3 py-2 w-full text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Code</label>
                        <input
                          type="number"
                          name="code"
                          min="0"
                          value={formData.code}
                          onChange={handleInputChange}
                          className="border rounded-lg px-3 py-2 w-full text-sm"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          className="border rounded-lg px-3 py-2 w-full text-sm"
                          rows={3}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                        <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Pricing</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Original Price (₹)</label>
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
                            />
                          </div>
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                          <input
                            type="number"
                            name="discount"
                            min="0"
                            max="100"
                            value={formData.discount}
                            onChange={handleInputChange}
                            className="border rounded-lg px-3 py-2 w-full text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Product Image */}
                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                  <h3 className="text-sm font-medium text-gray-700 border-b pb-2">Product Image</h3>
                  
                  <div 
                    onClick={() => fileInputRef.current.click()}
                    className="cursor-pointer bg-white border-2 border-dashed border-gray-300 rounded-lg p-3 flex flex-col items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    {formData.imagePreview ? (
                      <>
                        <img 
                          src={formData.imagePreview} 
                          alt="Product preview" 
                          className="h-24 w-24 object-contain mb-2"
                        />
                        <p className="text-xs text-blue-600">Tap to change</p>
                      </>
                    ) : (
                      <>
                        <ImageIcon size={30} className="text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Upload image</p>
                        <p className="text-xs text-gray-400 mt-1">Tap to browse</p>
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
                
                {/* Info Alert - Mobile-friendly */}
                <div className="bg-blue-50 p-2 rounded-lg border border-blue-100 text-xs">
                  <div className="flex">
                    <Info size={12} className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-blue-800">
                      <p className="font-medium">Note:</p>
                      <p>Only Name, Price and Stock are required fields.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4 flex justify-end space-x-2 border-t pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 text-sm"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUploading}
                  className={`px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm ${isUploading ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isUploading && (
                    <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin mr-1"></div>
                  )}
                  {currentItem ? 'Update' : 'Add Item'}
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