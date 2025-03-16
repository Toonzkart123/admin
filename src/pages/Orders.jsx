// src/pages/Orders.jsx
import React, { useState, useEffect } from 'react';
import { Filter, Download, RefreshCw, ShoppingCart, AlertCircle } from 'lucide-react';
import OrderDetailsModal from '../components/OrderDetailsModal';

const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Fetch orders from API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch('https://backend-lzb7.onrender.com/api/admin/orders', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Orders fetched:', data.length);
      setOrders(data);
      handleTabChange(activeTab, data);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to fetch detailed order data when selectedOrderId changes
  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    } else {
      setSelectedOrder(null);
    }
  }, [selectedOrderId]);

  // Function to fetch detailed order data
  const fetchOrderDetails = async (orderId) => {
    setModalLoading(true);
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      console.log('Fetching detailed order data for:', orderId);
      
      const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const orderData = await response.json();
      console.log('Order details received:', orderData);
      setSelectedOrder(orderData);
      
    } catch (err) {
      console.error('Failed to fetch order details:', err);
      setError(err.message);
      setSelectedOrderId(null); // Clear selected order on error
    } finally {
      setModalLoading(false);
    }
  };

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);
  
  const handleTabChange = (tab, orderData = orders) => {
    setActiveTab(tab);
    
    if (tab === 'all') {
      setFilteredOrders(orderData);
    } else {
      setFilteredOrders(orderData.filter(order => 
        order.status && order.status.toLowerCase() === tab.toLowerCase()
      ));
    }
  };

  const handleViewOrder = (orderId) => {
    console.log('View/Edit order clicked:', orderId);
    setSelectedOrderId(orderId);
  };

  // Function to refresh the selected order data
  const refreshSelectedOrder = () => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
      
      // Also refresh the main orders list to keep everything in sync
      fetchOrders();
    }
  };

  const getStatusBadgeClass = (status) => {
    if (!status) return 'bg-gray-100 text-gray-800';
    
    switch(status.toLowerCase()) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    
    try {
      return new Date(dateString).toLocaleDateString(undefined, options);
    } catch (e) {
      return 'Invalid Date';
    }
  };

  const getTotalItems = (order) => {
    if (!order.books || !Array.isArray(order.books)) return 0;
    return order.books.reduce((total, item) => total + (item.quantity || 0), 0);
  };

  const getCustomerName = (order) => {
    if (order.user && order.user.name) return order.user.name;
    if (order.customerId) return order.customerId;
    return 'Unknown Customer';
  };

  const getCustomerEmail = (order) => {
    if (order.user && order.user.email) return order.user.email;
    return '';
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div className="flex items-center">
            <ShoppingCart className="mr-2 text-blue-600" size={28} />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
              <p className="text-gray-500 mt-2">View and manage customer orders</p>
            </div>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
              <Filter size={16} className="mr-2" />
              Advanced Filters
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
              <Download size={16} className="mr-2" />
              Export
            </button>
            <button 
              onClick={fetchOrders}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
        {/* Error message */}
        {error && (
          <div className="mb-4 p-4 bg-red-50 rounded-md border border-red-200 flex items-start">
            <AlertCircle className="text-red-500 mr-3 mt-0.5 flex-shrink-0" size={20} />
            <div>
              <h3 className="text-sm font-medium text-red-800">Error loading orders</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
              <button 
                onClick={fetchOrders}
                className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        )}
        
        {/* Order status tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px overflow-x-auto">
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'all' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('all')}
              >
                All Orders
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'pending' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('pending')}
              >
                Pending
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'processing' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('processing')}
              >
                Processing
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'shipped' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('shipped')}
              >
                Shipped
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'completed' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('completed')}
              >
                Completed
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'cancelled' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('cancelled')}
              >
                Cancelled
              </button>
              <button 
                className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                  activeTab === 'returned' 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
                onClick={() => handleTabChange('returned')}
              >
                Returned
              </button>
            </nav>
          </div>
          
          {/* Loading state */}
          {loading ? (
            <div className="p-12 flex justify-center">
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-500">Loading orders...</p>
              </div>
            </div>
          ) : (
            <>
              {/* Orders table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredOrders.map((order) => (
                      <tr key={order._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {order.orderId || `ID-${order._id.slice(-6)}`}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div>{getCustomerName(order)}</div>
                          <div className="text-xs text-gray-400 mt-1">{getCustomerEmail(order)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(order.orderDate || order.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {order.paymentMethod || 'Not specified'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                            {order.status || 'Unknown'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {getTotalItems(order)} {getTotalItems(order) === 1 ? 'item' : 'items'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            onClick={() => handleViewOrder(order._id)}
                            className="text-blue-600 hover:text-blue-800 transition duration-150 mr-4"
                          >
                            View
                          </button>
                          <button 
                            onClick={() => handleViewOrder(order._id)}
                            className="text-indigo-600 hover:text-indigo-800 transition duration-150"
                          >
                            Edit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {filteredOrders.length === 0 && !loading && (
                <div className="p-6 text-center">
                  <p className="text-gray-500">No orders found for the selected status.</p>
                </div>
              )}
              
              <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  Showing {filteredOrders.length} of {orders.length} orders
                </div>
                <div className="flex-1 flex justify-end">
                  <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
                    <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Previous
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      1
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                      2
                    </button>
                    <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                      3
                    </button>
                    <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
      
      {/* Modal Loading indicator */}
      {modalLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Order Details Modal - Only show when we have all required data and not loading */}
      {selectedOrderId && selectedOrder && !modalLoading && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrderId(null)}
          onOrderUpdate={refreshSelectedOrder} 
          getStatusBadgeClass={getStatusBadgeClass}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default Orders;