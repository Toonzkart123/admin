// src/components/stores/inventory/StoreInventory.jsx
import React from 'react';
import { PlusCircle, Book } from 'lucide-react';
import { getInventoryStatusClass } from '../../../pages/StoreDetails';

const StoreInventory = ({ inventory }) => {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Store Inventory</h3>
        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          onClick={() => {/* Add inventory function */}}
        >
          <PlusCircle size={16} className="mr-2" />
          Add Book
        </button>
      </div>
      
      {inventory.length > 0 ? (
        <InventoryTable inventory={inventory} />
      ) : (
        <EmptyInventory />
      )}
    </div>
  );
};

const InventoryTable = ({ inventory }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Title
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Author
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              ISBN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Price
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Quantity
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
          {inventory.map((item) => (
            <tr key={item.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {item.title}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.author}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.isbn}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${item.price.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {item.quantity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getInventoryStatusClass(item.status)}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150">
                  Edit
                </button>
                <button className="text-red-500 hover:text-red-700 transition duration-150">
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const EmptyInventory = () => {
  return (
    <div className="p-6 text-center">
      <Book size={48} className="mx-auto text-gray-400 mb-2" />
      <p className="text-gray-500">No inventory items found for this store</p>
      <button
        className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        onClick={() => {/* Add inventory function */}}
      >
        <PlusCircle size={16} className="mr-2" />
        Add First Book
      </button>
    </div>
  );
};

export default StoreInventory;