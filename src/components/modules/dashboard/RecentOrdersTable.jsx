
import React, { useState } from 'react';
import OrderDetailsModal from './OrderDetailsModal';

const RecentOrdersTable = ({ orders }) => {
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchOrderDetails = async (orderId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Get the token from localStorage
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
      
      // Log the API response for debugging
      console.log('Order API Response:', data);
      console.log('Books array:', data.books);
      
      // Transform API response to match the format expected by our modal
      const formattedOrder = {
        id: data._id || data.orderId || data.id,
        customer: data.user?.name || data.customerName || 'Unknown Customer',
        date: new Date(data.createdAt).toISOString().split('T')[0],
        amount: data.totalAmount || data.totalPrice || 0,
        status: data.status || 'Processing',
        // Handle the books array from the API response with populated book data
        items: Array.isArray(data.books) 
          ? data.books.map(item => ({
              id: item._id || '',
              bookId: item.book?._id || item.book || '',
              name: item.book?.title || 'Unknown Book',
              quantity: item.quantity || 0,
              price: item.book?.price || (data.totalAmount / (item.quantity || 1)).toFixed(2) || 0
            }))
          : [],
        shippingAddress: data.shippingAddress || {},
        paymentMethod: data.paymentMethod || 'N/A',
        paymentStatus: data.isPaid ? 'Paid' : 'Pending'
      };

      setOrderDetails(formattedOrder);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching order details:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleViewOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsEditing(false);
    fetchOrderDetails(orderId);
  };

  const handleEditOrder = (orderId) => {
    setSelectedOrderId(orderId);
    setIsEditing(true);
    fetchOrderDetails(orderId);
    console.log("Edit mode enabled for order:", orderId);
  };

  const handleSaveOrder = async (updatedOrder) => {
    try {
      // Get the token from localStorage
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const adminToken = localStorage.getItem('adminToken');
      const token = adminToken || adminInfo.token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare the request body
      const updateData = {
        status: updatedOrder.status,
        totalAmount: updatedOrder.amount
      };

      // Only include items if they exist and have been modified
      if (updatedOrder.items && updatedOrder.items.length > 0) {
        updateData.books = updatedOrder.items.map(item => ({
          book: item.id,
          quantity: item.quantity
        }));
      }

      const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/orders/${updatedOrder.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      // Update the local order details with the changes
      setOrderDetails(updatedOrder);
      
      // Update the order in the orders list (for display in the table)
      // Note: This requires the parent component to provide a way to update the orders
      
      // Exit edit mode
      setIsEditing(false);
      
      // Show success message (optional)
      alert("Order updated successfully!");
      
    } catch (err) {
      console.error('Error updating order:', err);
      throw err; // Re-throw to be caught by the modal
    }
  };

  const closeModal = () => {
    setSelectedOrderId(null);
    setOrderDetails(null);
    setIsEditing(false);
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
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  #{order.id.substring(order.id.length - 10)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.customer}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${order.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                    ${order.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                      order.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                      order.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 
                      order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                      'bg-red-100 text-red-800'}`}>
                    {order.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button 
                    onClick={() => handleViewOrder(order.id)}
                    className="text-primary-600 hover:text-primary-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleEditOrder(order.id)}
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
        <button className="text-sm text-primary-600 hover:text-primary-900 font-medium">
          View all orders →
        </button>
      </div>

      {/* Order Details Modal */}
      {selectedOrderId && (
        <OrderDetailsModal 
          order={orderDetails}
          loading={loading}
          error={error}
          isEditing={isEditing}
          onClose={closeModal}
          onSave={handleSaveOrder}
        />
      )}
    </div>
  );
};

export default RecentOrdersTable;