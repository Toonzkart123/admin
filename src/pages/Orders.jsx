import React, { useState } from 'react';
import { Filter, Download, RefreshCw, Printer } from 'lucide-react';

// Mock data for orders
const mockOrders = [
  {
    id: 'ORD-1001',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      id: 'CUST-1234'
    },
    date: '2025-03-09T14:30:00',
    items: [
      { id: 1, title: 'The Great Gatsby', price: 12.99, quantity: 1 },
      { id: 3, title: 'Sapiens: A Brief History of Humankind', price: 24.99, quantity: 1 }
    ],
    total: 37.98,
    status: 'Completed',
    shippingAddress: '123 Main St, Anytown, AN 12345',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-1002',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      id: 'CUST-5678'
    },
    date: '2025-03-09T10:15:00',
    items: [
      { id: 2, title: 'To Kill a Mockingbird', price: 14.99, quantity: 2 }
    ],
    total: 29.98,
    status: 'Processing',
    shippingAddress: '456 Elm St, Othertown, OT 67890',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-1003',
    customer: {
      name: 'Robert Johnson',
      email: 'robert.johnson@example.com',
      id: 'CUST-9101'
    },
    date: '2025-03-08T16:45:00',
    items: [
      { id: 4, title: 'Becoming', price: 18.99, quantity: 1 },
      { id: 5, title: 'The Alchemist', price: 9.99, quantity: 1 },
      { id: 6, title: '1984', price: 10.99, quantity: 1 }
    ],
    total: 39.97,
    status: 'Pending',
    shippingAddress: '789 Oak St, Sometown, ST 12345',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-1004',
    customer: {
      name: 'Emily Brown',
      email: 'emily.brown@example.com',
      id: 'CUST-1121'
    },
    date: '2025-03-08T09:20:00',
    items: [
      { id: 7, title: 'The Hobbit', price: 14.99, quantity: 1 }
    ],
    total: 14.99,
    status: 'Shipped',
    shippingAddress: '101 Pine St, Anothercity, AC 54321',
    paymentMethod: 'Credit Card'
  },
  {
    id: 'ORD-1005',
    customer: {
      name: 'Michael Wilson',
      email: 'michael.wilson@example.com',
      id: 'CUST-3141'
    },
    date: '2025-03-07T13:10:00',
    items: [
      { id: 8, title: 'Pride and Prejudice', price: 8.99, quantity: 1 },
      { id: 9, title: 'The Catcher in the Rye', price: 9.99, quantity: 1 }
    ],
    total: 18.98,
    status: 'Cancelled',
    shippingAddress: '202 Maple St, Lastcity, LC 98765',
    paymentMethod: 'PayPal'
  },
  {
    id: 'ORD-1006',
    customer: {
      name: 'Sarah Adams',
      email: 'sarah.adams@example.com',
      id: 'CUST-5161'
    },
    date: '2025-03-06T11:30:00',
    items: [
      { id: 10, title: 'The Lord of the Rings', price: 29.99, quantity: 1 }
    ],
    total: 29.99,
    status: 'Returned',
    shippingAddress: '303 Cedar St, Firsttown, FT 13579',
    paymentMethod: 'Credit Card'
  }
];

// Orders page component
const Orders = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState(mockOrders);
  const [filteredOrders, setFilteredOrders] = useState(mockOrders);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    
    if (tab === 'all') {
      setFilteredOrders(orders);
    } else {
      setFilteredOrders(orders.filter(order => order.status.toLowerCase() === tab));
    }
  };

  const handleViewOrder = (orderId) => {
    const order = orders.find(o => o.id === orderId);
    setSelectedOrder(order);
    setShowDetails(true);
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    setFilteredOrders(updatedOrders.filter(order => 
      activeTab === 'all' || order.status.toLowerCase() === activeTab
    ));
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const getStatusBadgeClass = (status) => {
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
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
            <p className="text-gray-500 mt-2">View and manage customer orders</p>
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
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
              <RefreshCw size={16} className="mr-2" />
              Refresh
            </button>
          </div>
        </div>
        
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
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div>{order.customer.name}</div>
                      <div className="text-xs text-gray-400 mt-1">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.date)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => handleViewOrder(order.id)}
                        className="text-blue-600 hover:text-blue-800 transition duration-150 mr-4"
                      >
                        View
                      </button>
                      <button className="text-indigo-600 hover:text-indigo-800 transition duration-150">
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredOrders.length === 0 && (
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
        </div>
      </div>
      
      {/* Order details modal */}
      {showDetails && selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-6">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:text-left w-full">
                    <div className="flex justify-between items-center mb-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Order Details
                      </h3>
                      <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedOrder.status)}`}>
                        {selectedOrder.status}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Order Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm"><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                          <p className="text-sm mt-2"><span className="font-medium">Order Date:</span> {formatDate(selectedOrder.date)}</p>
                          <p className="text-sm mt-2"><span className="font-medium">Payment Method:</span> {selectedOrder.paymentMethod}</p>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-500 mt-6 mb-3">Customer Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm"><span className="font-medium">Name:</span> {selectedOrder.customer.name}</p>
                          <p className="text-sm mt-2"><span className="font-medium">Email:</span> {selectedOrder.customer.email}</p>
                          <p className="text-sm mt-2"><span className="font-medium">Customer ID:</span> {selectedOrder.customer.id}</p>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Shipping Information</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="text-sm"><span className="font-medium">Address:</span></p>
                          <p className="text-sm mt-2">{selectedOrder.shippingAddress}</p>
                        </div>
                        
                        <h4 className="text-sm font-medium text-gray-500 mt-6 mb-3">Update Status</h4>
                        <div className="flex flex-wrap gap-3">
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Pending')}
                            className="px-3 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition duration-150"
                          >
                            Pending
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Processing')}
                            className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800 hover:bg-blue-200 transition duration-150"
                          >
                            Processing
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                            className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800 hover:bg-purple-200 transition duration-150"
                          >
                            Shipped
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Completed')}
                            className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-800 hover:bg-green-200 transition duration-150"
                          >
                            Completed
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Cancelled')}
                            className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-800 hover:bg-red-200 transition duration-150"
                          >
                            Cancelled
                          </button>
                          <button 
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'Returned')}
                            className="px-3 py-1 text-xs rounded-full bg-orange-100 text-orange-800 hover:bg-orange-200 transition duration-150"
                          >
                            Returned
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    <h4 className="text-sm font-medium text-gray-500 mt-6 mb-3">Order Items</h4>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedOrder.items.map((item) => (
                            <tr key={item.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                                {item.title}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                ${item.price.toFixed(2)}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 text-right">
                                {item.quantity}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 text-right">
                                ${(item.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                          <tr className="bg-gray-50">
                            <td colSpan="3" className="px-4 py-3 text-sm font-medium text-gray-900 text-right">
                              Total:
                            </td>
                            <td className="px-4 py-3 text-sm font-bold text-gray-900 text-right">
                              ${selectedOrder.total.toFixed(2)}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Printer size={16} className="mr-2" />
                  Print Invoice
                </button>
                <button 
                  type="button" 
                  onClick={() => setShowDetails(false)}
                  className="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Orders;