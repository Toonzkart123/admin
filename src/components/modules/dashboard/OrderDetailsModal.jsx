// import React, { useState, useEffect } from 'react';

// const OrderDetailsModal = ({ order, onClose, loading, error, isEditing, onSave }) => {
//   const [editableOrder, setEditableOrder] = useState(null);
//   const [isSaving, setIsSaving] = useState(false);
//   const [saveError, setSaveError] = useState(null);

//   // Initialize editable order when the order or editing mode changes
//   useEffect(() => {
//     if (order) {
//       setEditableOrder({
//         ...order,
//         status: order.status || 'Pending',
//         amount: order.amount || 0
//       });
//     }
//   }, [order, isEditing]);

//   if (!order && !loading && !error) return null;

//   const handleStatusChange = (e) => {
//     setEditableOrder({
//       ...editableOrder,
//       status: e.target.value
//     });
//   };

//   const handleAmountChange = (e) => {
//     setEditableOrder({
//       ...editableOrder,
//       amount: parseFloat(e.target.value) || 0
//     });
//   };

//   const handleSave = async () => {
//     if (!editableOrder) return;
    
//     setIsSaving(true);
//     setSaveError(null);
    
//     try {
//       await onSave(editableOrder);
//       setIsSaving(false);
//     } catch (err) {
//       setSaveError(err.message);
//       setIsSaving(false);
//     }
//   };

//   // Status options for dropdown
//   const statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
//         <div className="px-6 py-4 border-b flex justify-between items-center">
//           <h3 className="text-lg font-medium text-gray-900">
//             {loading ? 'Loading Order Details...' : `Order #${order?.id || ''}`}
//           </h3>
//           <button
//             onClick={onClose}
//             className="text-gray-400 hover:text-gray-500 focus:outline-none"
//           >
//             <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>

//         <div className="px-6 py-4">
//           {loading ? (
//             <div className="flex justify-center">
//               <p>Loading order details...</p>
//             </div>
//           ) : error ? (
//             <div className="text-red-500 text-center">
//               <p>Error: {error}</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               <div className="grid grid-cols-2 gap-4">
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">Customer</h4>
//                   <p className="mt-1">{order?.customer || 'Unknown Customer'}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
//                   <p className="mt-1">{order?.date || 'N/A'}</p>
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
//                   {isEditing ? (
//                     <div className="mt-1">
//                       <input
//                         type="number"
//                         value={editableOrder?.amount || 0}
//                         onChange={handleAmountChange}
//                         className="px-2 py-1 border rounded w-full"
//                         step="0.01"
//                         min="0"
//                       />
//                     </div>
//                   ) : (
//                     <p className="mt-1">${order?.amount?.toFixed(2) || '0.00'}</p>
//                   )}
//                 </div>
//                 <div>
//                   <h4 className="text-sm font-medium text-gray-500">Status</h4>
//                   {isEditing ? (
//                     <div className="mt-1">
//                       <select
//                         value={editableOrder?.status || 'Pending'}
//                         onChange={handleStatusChange}
//                         className="px-2 py-1 border rounded w-full"
//                       >
//                         {statusOptions.map(status => (
//                           <option key={status} value={status}>{status}</option>
//                         ))}
//                       </select>
//                     </div>
//                   ) : (
//                     <p className="mt-1">
//                       <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
//                         ${order?.status === 'Completed' ? 'bg-green-100 text-green-800' : 
//                           order?.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
//                           order?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
//                           order?.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
//                           'bg-red-100 text-red-800'}`}>
//                         {order?.status || 'Unknown'}
//                       </span>
//                     </p>
//                   )}
//                 </div>
//               </div>

//               {/* Order Items Section */}
//               <div className="mt-6">
//                 <h4 className="text-sm font-medium text-gray-500 mb-3">Order Items</h4>
//                 <div className="border rounded-md overflow-hidden">
//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Product
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Quantity
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Price
//                         </th>
//                         <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
//                           Total
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {order?.items?.map((item, index) => (
//                         <tr key={index}>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             {item.name || 'Unknown Product'}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             {item.quantity || 0}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             ${item.price?.toFixed(2) || '0.00'}
//                           </td>
//                           <td className="px-4 py-3 text-sm text-gray-500">
//                             ${(item.quantity * item.price)?.toFixed(2) || '0.00'}
//                           </td>
//                         </tr>
//                       ))}
//                       {!order?.items?.length && (
//                         <tr>
//                           <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
//                             No items found
//                           </td>
//                         </tr>
//                       )}
//                     </tbody>
//                   </table>
//                 </div>
//               </div>

//               {/* Shipping Address Section */}
//               <div className="mt-6">
//                 <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
//                 <div className="bg-gray-50 p-3 rounded">
//                   <p className="text-sm text-gray-700">
//                     {order?.shippingAddress?.street || 'N/A'}<br />
//                     {order?.shippingAddress?.city && `${order.shippingAddress.city}, `}
//                     {order?.shippingAddress?.state && `${order.shippingAddress.state} `}
//                     {order?.shippingAddress?.postalCode || ''}<br />
//                     {order?.shippingAddress?.country || ''}
//                   </p>
//                 </div>
//               </div>

//               {/* Payment Information Section */}
//               <div className="mt-6">
//                 <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
//                 <div className="bg-gray-50 p-3 rounded">
//                   <p className="text-sm text-gray-700">
//                     <strong>Payment Method:</strong> {order?.paymentMethod || 'N/A'}<br />
//                     <strong>Payment Status:</strong> {order?.paymentStatus || 'N/A'}
//                   </p>
//                 </div>
//               </div>

//               {/* Show any save errors */}
//               {saveError && (
//                 <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
//                   <p>Error saving changes: {saveError}</p>
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         <div className="px-6 py-3 border-t flex justify-end">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={onClose}
//                 className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700 mr-2"
//                 disabled={isSaving}
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-sm font-medium text-white"
//                 disabled={isSaving}
//               >
//                 {isSaving ? 'Saving...' : 'Save Changes'}
//               </button>
//             </>
//           ) : (
//             <button
//               onClick={onClose}
//               className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700"
//             >
//               Close
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default OrderDetailsModal;


import React, { useState, useEffect } from 'react';

const OrderDetailsModal = ({ order, onClose, loading, error, isEditing, onSave }) => {
  const [editableOrder, setEditableOrder] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize editable order when the order or editing mode changes
  useEffect(() => {
    if (order) {
      setEditableOrder({
        ...order,
        status: order.status || 'Pending',
        amount: order.amount || 0
      });
    }
  }, [order, isEditing]);

  // Helper function to safely format currency
  const formatCurrency = (value) => {
    if (typeof value === 'number') {
      return value.toFixed(2);
    }
    return parseFloat(value || 0).toFixed(2);
  };

  if (!order && !loading && !error) return null;

  const handleStatusChange = (e) => {
    setEditableOrder({
      ...editableOrder,
      status: e.target.value
    });
  };

  const handleAmountChange = (e) => {
    setEditableOrder({
      ...editableOrder,
      amount: parseFloat(e.target.value) || 0
    });
  };

  const handleSave = async () => {
    if (!editableOrder) return;
    
    setIsSaving(true);
    setSaveError(null);
    
    try {
      await onSave(editableOrder);
      setIsSaving(false);
    } catch (err) {
      setSaveError(err.message);
      setIsSaving(false);
    }
  };

  // Status options for dropdown
  const statusOptions = ['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-auto">
        <div className="px-6 py-4 border-b flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900">
            {loading ? 'Loading Order Details...' : `Order #${order?.id || ''}`}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500 focus:outline-none"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-6 py-4">
          {loading ? (
            <div className="flex justify-center">
              <p>Loading order details...</p>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                  <p className="mt-1">{order?.customer || 'Unknown Customer'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                  <p className="mt-1">{order?.date || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Amount</h4>
                  {isEditing ? (
                    <div className="mt-1">
                      <input
                        type="number"
                        value={editableOrder?.amount || 0}
                        onChange={handleAmountChange}
                        className="px-2 py-1 border rounded w-full"
                        step="0.01"
                        min="0"
                      />
                    </div>
                  ) : (
                    <p className="mt-1">${formatCurrency(order?.amount)}</p>
                  )}
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Status</h4>
                  {isEditing ? (
                    <div className="mt-1">
                      <select
                        value={editableOrder?.status || 'Pending'}
                        onChange={handleStatusChange}
                        className="px-2 py-1 border rounded w-full"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <p className="mt-1">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${order?.status === 'Completed' ? 'bg-green-100 text-green-800' : 
                          order?.status === 'Processing' ? 'bg-blue-100 text-blue-800' : 
                          order?.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                          order?.status === 'Shipped' ? 'bg-purple-100 text-purple-800' : 
                          'bg-red-100 text-red-800'}`}>
                        {order?.status || 'Unknown'}
                      </span>
                    </p>
                  )}
                </div>
              </div>

              {/* Order Items Section */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-3">Order Items</h4>
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Product
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Quantity
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Price
                        </th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {order?.items?.map((item, index) => (
                        <tr key={index}>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.name || 'Unknown Product'}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item.quantity || 0}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {typeof item.price === 'number' ? `${item.price.toFixed(2)}` : `${parseFloat(item.price || 0).toFixed(2)}`}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {typeof item.price === 'number' && typeof item.quantity === 'number' 
                              ? `${(item.quantity * item.price).toFixed(2)}` 
                              : `${(parseFloat(item.quantity || 0) * parseFloat(item.price || 0)).toFixed(2)}`}
                          </td>
                        </tr>
                      ))}
                      {!order?.items?.length && (
                        <tr>
                          <td colSpan="4" className="px-4 py-3 text-sm text-gray-500 text-center">
                            No items found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Shipping Address Section */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    {order?.shippingAddress?.street || 'N/A'}<br />
                    {order?.shippingAddress?.city && `${order.shippingAddress.city}, `}
                    {order?.shippingAddress?.state && `${order.shippingAddress.state} `}
                    {order?.shippingAddress?.postalCode || ''}<br />
                    {order?.shippingAddress?.country || ''}
                  </p>
                </div>
              </div>

              {/* Payment Information Section */}
              <div className="mt-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h4>
                <div className="bg-gray-50 p-3 rounded">
                  <p className="text-sm text-gray-700">
                    <strong>Payment Method:</strong> {order?.paymentMethod || 'N/A'}<br />
                    <strong>Payment Status:</strong> {order?.paymentStatus || 'N/A'}
                  </p>
                </div>
              </div>

              {/* Show any save errors */}
              {saveError && (
                <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">
                  <p>Error saving changes: {saveError}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex justify-end space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700 mr-2"
                disabled={isSaving}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded text-sm font-medium text-white flex items-center"
                disabled={isSaving}
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </>
          ) : (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded text-sm font-medium text-gray-700"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;