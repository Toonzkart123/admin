import React, { useState, useEffect } from 'react';
import { X, Package, MapPin, CreditCard, CheckCircle, Clock, XCircle, Truck, ArrowLeft, User, Mail, Phone, Save } from 'lucide-react';

const OrderDetailsModal = ({ order, onClose, onOrderUpdate, getStatusBadgeClass, formatDate }) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [updatedStatus, setUpdatedStatus] = useState(order.status || '');
  const [updateError, setUpdateError] = useState(null);
  const [orderItems, setOrderItems] = useState([]);
  const [isLoadingItems, setIsLoadingItems] = useState(true);

  // Status options for dropdown
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled', 'Returned'];

  useEffect(() => {
    fetchOrderItems();
  }, [order]);

  // Fetch product details for each item in the order
  const fetchOrderItems = async () => {
    setIsLoadingItems(true);
    
    try {
      // Get the token from localStorage
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const adminToken = localStorage.getItem('adminToken');
      const token = adminToken || adminInfo.token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const items = [];

      // Process each item in the order
      for (const item of order.items || []) {
        const category = item.category;
        const productId = item.productId?._id || item.productId;
        
        if (!productId) continue;

        let apiUrl;
        if (category.toLowerCase() === 'book') {
          apiUrl = `https://backend-lzb7.onrender.com/api/admin/books/${productId}`;
        } else if (category.toLowerCase() === 'stationery') {
          apiUrl = `https://backend-lzb7.onrender.com/api/admin/stationery/${productId}`;
        } else {
          // Skip this item if the category is unknown
          continue;
        }

        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const productData = await response.json();
          
          items.push({
            _id: item._id,
            category: category,
            quantity: item.quantity || 1,
            price: item.price || 0,
            product: productData,
            // Map different property names based on category
            title: category.toLowerCase() === 'book' ? productData.title : productData.name,
            author: category.toLowerCase() === 'book' ? productData.author : productData.brand,
            isbn: category.toLowerCase() === 'book' ? productData.isbn : null,
            image: productData.image || null
          });
        } else {
          console.error(`Failed to fetch ${category} with ID ${productId}`);
          // Include the item with basic info even if fetch fails
          items.push({
            _id: item._id,
            category: category,
            quantity: item.quantity || 1,
            price: item.price || 0,
            // Use the data from the order response if available
            title: category.toLowerCase() === 'book' ? 
              (item.productId?.title || 'Unknown Book') : 
              (item.productId?.name || 'Unknown Item'),
            author: category.toLowerCase() === 'book' ? 
              (item.productId?.author || 'Unknown Author') : 
              (item.productId?.brand || 'Unknown Brand'),
            isbn: category.toLowerCase() === 'book' ? (item.productId?.isbn || 'N/A') : null
          });
        }
      }

      setOrderItems(items);
    } catch (err) {
      console.error('Error fetching order items:', err);
    } finally {
      setIsLoadingItems(false);
    }
  };

  // Calculate order summary
  const subtotal = orderItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 1), 0);
  const shipping = 0; // Assuming free shipping or include actual shipping cost if available
  const tax = 0; // Include tax calculation if available
  const total = order.totalAmount || subtotal + shipping + tax;

  // Handle status update
  const handleStatusChange = (e) => {
    setUpdatedStatus(e.target.value);
  };

  // Get customer information
  const customerName = order.user?.name || order.customerId || 'Unknown Customer';
  const customerEmail = order.user?.email || '';
  const shippingAddress = order.shippingAddress || 'No address provided';

  // Format date helper
  const getFormattedDate = (dateString) => {
    return dateString ? formatDate(dateString) : 'N/A';
  };

  // Update order via API
  const updateOrder = async () => {
    setIsUpdating(true);
    setUpdateError(null);
    
    try {
      // Get the token from localStorage
      const adminInfo = JSON.parse(localStorage.getItem('adminInfo') || '{}');
      const adminToken = localStorage.getItem('adminToken');
      const token = adminToken || adminInfo.token;
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Prepare the request body - only send the status as specified in the API
      const updateData = {
        status: updatedStatus
      };

      const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/orders/${order._id}`, {
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

      // Update was successful
      order.status = updatedStatus;
      
      // Call the onOrderUpdate callback to refresh data
      if (onOrderUpdate) {
        onOrderUpdate();
      }
      
      // Show success message
      alert("Order updated successfully!");
      
    } catch (err) {
      console.error('Error updating order:', err);
      setUpdateError(err.message);
      alert(`Failed to update order: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Handle Cancel Order button click
  const handleCancelOrder = () => {
    setUpdatedStatus('Cancelled');
    updateOrder();
  };
  
  // Handle Print Invoice button click
  const handlePrintInvoice = () => {
    // Create a new window for the invoice
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    
    if (!printWindow) {
      alert("Please allow pop-ups to print the invoice.");
      return;
    }
    
    // Get formatted date for invoice
    const invoiceDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Format the order date
    const orderDateFormatted = new Date(order.orderDate || order.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Calculate the GST amount (assuming 18% GST on total)
    const gstRate = 0.18;
    const gstAmount = (order.totalAmount * gstRate) / (1 + gstRate);
    const subtotalBeforeTax = order.totalAmount - gstAmount;
    
    // Generate HTML content for the invoice
    const invoiceContent = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invoice #${order.orderId || order._id.slice(-6)}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .invoice-container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #eee;
          }
          .invoice-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 1px solid #eee;
          }
          .company-details {
            margin-top: 10px;
          }
          .invoice-details {
            text-align: right;
          }
          .invoice-id {
            font-size: 20px;
            font-weight: bold;
            color: #2563eb;
            margin-bottom: 5px;
          }
          .customer-details, .shipping-details {
            margin-bottom: 30px;
          }
          .details-title {
            font-weight: bold;
            margin-bottom: 5px;
            color: #4b5563;
          }
          .details-content {
            margin-bottom: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
          }
          th, td {
            padding: 10px;
            text-align: left;
            border-bottom: 1px solid #eee;
          }
          th {
            background-color: #f9fafb;
            font-weight: bold;
            color: #4b5563;
          }
          .totals {
            margin-top: 30px;
            text-align: right;
          }
          .total-row {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 5px;
          }
          .total-label {
            width: 150px;
            text-align: right;
            margin-right: 20px;
          }
          .total-value {
            width: 100px;
            text-align: right;
          }
          .grand-total {
            font-weight: bold;
            font-size: 18px;
            margin-top: 10px;
            padding-top: 10px;
            border-top: 2px solid #eee;
          }
          .footer {
            margin-top: 50px;
            text-align: center;
            color: #6b7280;
            font-size: 14px;
            padding-top: 20px;
            border-top: 1px solid #eee;
          }
          .print-button {
            background-color: #2563eb;
            color: white;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            cursor: pointer;
            border-radius: 4px;
            margin-top: 20px;
          }
          @media print {
            .print-button {
              display: none;
            }
          }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <div>
              <h1>BookShop</h1>
              <div class="company-details">
                <p>123 Book Avenue</p>
                <p>New Delhi, India 110001</p>
                <p>Email: support@bookshop.com</p>
                <p>Phone: +91 123-456-7890</p>
              </div>
            </div>
            <div class="invoice-details">
              <div class="invoice-id">INVOICE #${order.orderId || order._id.slice(-6)}</div>
              <p>Date: ${invoiceDate}</p>
              <p>Order Date: ${orderDateFormatted}</p>
              <p>Payment Method: ${order.paymentMethod || 'N/A'}</p>
            </div>
          </div>
          
          <div class="customer-shipping-container" style="display: flex; justify-content: space-between;">
            <div class="customer-details">
              <div class="details-title">BILLED TO:</div>
              <div class="details-content">
                <p>${customerName}</p>
                ${customerEmail ? `<p>${customerEmail}</p>` : ''}
                ${order.customer?.phone ? `<p>${order.customer.phone}</p>` : ''}
                <p>Customer ID: ${order.customerId || 'N/A'}</p>
              </div>
            </div>
            
            <div class="shipping-details">
              <div class="details-title">SHIPPED TO:</div>
              <div class="details-content">
                <p>${shippingAddress}</p>
              </div>
            </div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Description</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map((item, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td>
                    <div><strong>${item.title || `${item.category} Item`}</strong></div>
                    <div class="text-sm text-gray-500">
                      ${item.category === 'Book' ? 
                        `Author: ${item.author || 'Unknown'}` : 
                        `Brand: ${item.author || 'Unknown'}`}
                    </div>
                    ${item.category === 'Book' && item.isbn ? 
                      `<div class="text-sm text-gray-500">ISBN: ${item.isbn}</div>` : 
                      ''}
                  </td>
                  <td>${item.quantity || 1}</td>
                  <td>₹${((item.price || 0) / 100).toFixed(2)}</td>
                  <td>₹${(((item.price || 0) * (item.quantity || 1)) / 100).toFixed(2)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          
          <div class="totals">
            <div class="total-row">
              <div class="total-label">Subtotal:</div>
              <div class="total-value">₹${(subtotalBeforeTax / 100).toFixed(2)}</div>
            </div>
            <div class="total-row">
              <div class="total-label">GST (18%):</div>
              <div class="total-value">₹${(gstAmount / 100).toFixed(2)}</div>
            </div>
            <div class="total-row">
              <div class="total-label">Shipping:</div>
              <div class="total-value">₹${shipping.toFixed(2)}</div>
            </div>
            <div class="total-row grand-total">
              <div class="total-label">TOTAL:</div>
              <div class="total-value">₹${(order.totalAmount / 100).toFixed(2)}</div>
            </div>
          </div>
          
          <div class="footer">
            <p>Thank you for your business!</p>
            <p>For any questions regarding this invoice, please contact our customer support.</p>
            <p>Order Status: ${order.status || 'Processing'}</p>
          </div>
          
          <div style="text-align: center;">
            <button class="print-button" onclick="window.print(); return false;">Print Invoice</button>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Write to the new window document
    printWindow.document.open();
    printWindow.document.write(invoiceContent);
    printWindow.document.close();
    
    // Focus on the new window
    printWindow.focus();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4 flex justify-between items-center sticky top-0 bg-white z-10">
          <div className="flex items-center">
            <button 
              onClick={onClose}
              className="mr-4 p-1 rounded-full hover:bg-gray-100 text-gray-500"
            >
              <ArrowLeft size={20} />
            </button>
            <h2 className="text-xl font-bold text-gray-800">
              Order Details: {order.orderId || `ID-${order._id.slice(-6)}`}
            </h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-full hover:bg-gray-100 text-gray-500"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left column - Order info */}
          <div className="md:col-span-2 space-y-6">
            {/* Order status */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-gray-900">Status</h3>
                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(order.status)}`}>
                  {order.status || 'Unknown'}
                </span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                <select
                  value={updatedStatus}
                  onChange={handleStatusChange}
                  className="border border-gray-300 rounded-md shadow-sm p-2 bg-white flex-grow text-sm"
                  disabled={isUpdating}
                >
                  <option value="" disabled>Select status</option>
                  {statusOptions.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
                
                <button
                  onClick={updateOrder}
                  disabled={isUpdating || updatedStatus === order.status}
                  className={`px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                    ${(isUpdating || updatedStatus === order.status) 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                    }`}
                >
                  {isUpdating ? 'Updating...' : 'Update Status'}
                </button>
              </div>
              
              <div className="text-sm text-gray-500 mt-2">
                Last updated: {getFormattedDate(order.updatedAt || order.createdAt)}
              </div>
              
              {updateError && (
                <div className="mt-2 text-sm text-red-600">
                  Error: {updateError}
                </div>
              )}
            </div>

            {/* Order details */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Order Items</h3>
              </div>
              <ul className="divide-y divide-gray-200">
                {isLoadingItems ? (
                  <li className="px-4 py-6 text-center text-gray-500">
                    Loading order items...
                  </li>
                ) : (
                  orderItems.length > 0 ? (
                    orderItems.map((item, index) => (
                      <li key={item._id || index} className="px-4 py-3 flex items-center">
                        <div className="h-16 w-16 bg-gray-100 rounded-md flex items-center justify-center mr-4 flex-shrink-0 overflow-hidden">
                          {item.image ? (
                            <img 
                              src={item.image} 
                              alt={item.title} 
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.parentElement.innerHTML = '<Package size={24} className="text-gray-400" />';
                              }}
                            />
                          ) : (
                            <Package size={24} className="text-gray-400" />
                          )}
                        </div>
                        <div className="flex-grow">
                          <div className="flex flex-col sm:flex-row sm:justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {item.title || `${item.category} Item`}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {item.category === 'Book' ? `Author: ${item.author || 'Unknown'}` : `Brand: ${item.author || 'Unknown'}`}
                              </p>
                            </div>
                            <div className="mt-1 sm:mt-0 text-sm text-gray-900">
                              ${(item.price / 100).toFixed(2) || '0.00'} x {item.quantity || 1}
                            </div>
                          </div>
                          <div className="mt-1 flex justify-between">
                            <p className="text-sm text-gray-500">
                              {item.category === 'Book' && item.isbn ? `ISBN: ${item.isbn}` : `Category: ${item.category}`}
                            </p>
                            <div className="font-medium text-gray-900">
                              ${(((item.price || 0) * (item.quantity || 1)) / 100).toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </li>
                    ))
                  ) : (
                    <li className="px-4 py-6 text-center text-gray-500">
                      No items in this order
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Shipping info */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Shipping Information</h3>
              </div>
              <div className="p-4">
                <div className="flex items-start mb-4">
                  <MapPin size={20} className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Shipping Address</h4>
                    <p className="text-gray-600 mt-1">{shippingAddress}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <CreditCard size={20} className="text-gray-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-medium text-gray-900">Payment Method</h4>
                    <p className="text-gray-600 mt-1">{order.paymentMethod || 'Not specified'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order timeline */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Order Timeline</h3>
              </div>
              <div className="p-4">
                <div className="space-y-6">
                  <div className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div className="rounded-full h-8 w-8 flex items-center justify-center bg-blue-100 text-blue-500">
                        <CheckCircle size={16} />
                      </div>
                      <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">Order Placed</h4>
                      <p className="text-gray-500 text-sm">{getFormattedDate(order.createdAt || order.orderDate)}</p>
                      <p className="text-gray-600 mt-1">Order #{order.orderId || order._id.slice(-6)} was placed</p>
                    </div>
                  </div>
                  
                  {order.status && order.status.toLowerCase() !== 'pending' && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className={`rounded-full h-8 w-8 flex items-center justify-center ${
                          order.status.toLowerCase() === 'cancelled' 
                            ? 'bg-red-100 text-red-500' 
                            : 'bg-blue-100 text-blue-500'
                        }`}>
                          {order.status.toLowerCase() === 'cancelled' ? <XCircle size={16} /> : <Clock size={16} />}
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {order.status === 'Cancelled' ? 'Order Cancelled' : 'Processing'}
                        </h4>
                        <p className="text-gray-500 text-sm">{getFormattedDate(order.updatedAt || order.createdAt)}</p>
                        <p className="text-gray-600 mt-1">
                          {order.status === 'Cancelled' 
                            ? 'The order was cancelled' 
                            : `Order status updated to ${order.status}`}
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {order.status && order.status.toLowerCase() === 'shipped' && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-purple-100 text-purple-500">
                          <Truck size={16} />
                        </div>
                        <div className="h-full w-0.5 bg-gray-200 mt-2"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Order Shipped</h4>
                        <p className="text-gray-500 text-sm">{getFormattedDate(order.updatedAt || order.createdAt)}</p>
                        <p className="text-gray-600 mt-1">The order has been shipped</p>
                      </div>
                    </div>
                  )}
                  
                  {order.status && order.status.toLowerCase() === 'completed' && (
                    <div className="flex">
                      <div className="flex flex-col items-center mr-4">
                        <div className="rounded-full h-8 w-8 flex items-center justify-center bg-green-100 text-green-500">
                          <CheckCircle size={16} />
                        </div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Order Delivered</h4>
                        <p className="text-gray-500 text-sm">{getFormattedDate(order.updatedAt || order.createdAt)}</p>
                        <p className="text-gray-600 mt-1">The order has been delivered</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Right column - Customer & Summary */}
          <div className="space-y-6">
            {/* Customer info */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Customer</h3>
              </div>
              <div className="p-4">
                <div className="flex items-start mb-3">
                  <User size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-900">{customerName}</span>
                </div>
                {customerEmail && (
                  <div className="flex items-start mb-3">
                    <Mail size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <a href={`mailto:${customerEmail}`} className="text-blue-600 hover:text-blue-800">{customerEmail}</a>
                  </div>
                )}
                {order.customer?.phone && (
                  <div className="flex items-start">
                    <Phone size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <a href={`tel:${order.customer.phone}`} className="text-blue-600 hover:text-blue-800">{order.customer.phone}</a>
                  </div>
                )}
              </div>
            </div>
            
            {/* Order summary */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="border-b border-gray-200 px-4 py-3">
                <h3 className="font-medium text-gray-900">Order Summary</h3>
              </div>
              <div className="p-4 space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-gray-900">${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="text-gray-900">${tax.toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-medium">
                  <span className="text-gray-900">Total</span>
                  <span className="text-gray-900">${(order.totalAmount / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>
            
            {/* Actions */}
            <div className="space-y-3">
              <button 
                onClick={handlePrintInvoice}
                className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Print Invoice
              </button>
              {order.status && order.status.toLowerCase() !== 'cancelled' && (
                <button 
                  onClick={handleCancelOrder}
                  disabled={isUpdating}
                  className="w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-red-600 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Cancel Order
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;