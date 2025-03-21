import React, { useState, useEffect } from 'react';
import OrderDetailsModal from '../../../components/OrderDetailsModal';

const RecentOrdersTable = ({ orders, onViewAllOrders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // This effect ensures orderDetails is properly updated when an order is selected
  useEffect(() => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    } else {
      // Clear orderDetails when no order is selected
      setOrderDetails(null);
    }
  }, [selectedOrderId]);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the token from localStorage - check multiple possible storage locations
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const adminToken = localStorage.getItem('adminToken');
      const token = adminToken || adminInfo.token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      setOrderDetails(data);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleEditOrder = (orderId) => {
    setSelectedOrderId(orderId);
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
  
  // Function to handle price formatting consistently
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      // Some prices are stored in cents, others in dollars
      return price > 100 ? (price / 100).toFixed(2) : price.toFixed(2);
    }
    return '0.00';
  };

  // Calculate order total better handling different data structures
  const getOrderTotal = (order) => {
    if (typeof order.totalAmount === 'number') {
      return formatPrice(order.totalAmount);
    }
    
    if (order.amount) {
      return formatPrice(order.amount);
    }
    
    return '0.00';
  };

  // Get customer name with better fallback handling
  const getCustomerName = (order) => {
    if (order.user?.name) return order.user.name;
    if (order.customer) return order.customer;
    return order.customerId || 'N/A';
  };

  // Get order ID with better formatting
  const getOrderId = (order) => {
    console.log("asdfasdf",order);
    if (order.orderId) return order.orderId;
    if (order.id) return order.id;
    if (order._id) return `#${order._id.substring(Math.max(0, order._id.length - 10))}`;
    return 'N/A';
  };

  const closeModal = () => {
    setSelectedOrderId(null);
  };

  const refreshOrderDetails = () => {
    if (selectedOrderId) {
      fetchOrderDetails(selectedOrderId);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">Recent Orders</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders.map((order, index) => (
              <tr key={order.orderId} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {getOrderId(order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {getCustomerName(order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(order.orderDate || order.createdAt || order.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${getOrderTotal(order)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                    {order.status || 'Unknown'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewOrder(order._id || order.id)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEditOrder(order._id || order.id)}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-3 border-t">
        <button 
          onClick={onViewAllOrders}
          className="text-sm text-primary-600 hover:text-primary-900 font-medium"
        >
          View all orders →
        </button>
      </div>

      {/* Loading indicator while fetching order details */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl">
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
              <p>Loading order details...</p>
            </div>
          </div>
        </div>
      )}

      {/* Error message */}
      {error && !loading && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-md">
            <h3 className="text-lg font-medium text-red-600 mb-2">Error Loading Order</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex justify-end">
              <button 
                onClick={closeModal}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Details Modal - Only render when we have order details */}
      {selectedOrderId && orderDetails && !loading && !error && (
        <OrderDetailsModal 
          order={orderDetails}
          onClose={closeModal}
          onOrderUpdate={refreshOrderDetails}
          getStatusBadgeClass={getStatusBadgeClass}
          formatDate={formatDate}
        />
      )}
    </div>
  );
};

export default RecentOrdersTable;