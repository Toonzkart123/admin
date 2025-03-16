// src/components/stores/inventory/StoreInventory.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Book } from 'lucide-react';
import { getInventoryStatusClass } from '../../../pages/StoreDetails';
import axios from 'axios';

const StoreInventory = ({ inventory = [], storeId, apiBaseUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [books, setBooks] = useState(inventory || []);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setBooks(inventory || []);
  }, [inventory]);

  const handleAddBook = () => {
    setShowAddModal(true);
  };

  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${apiBaseUrl}/api/admin/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      if (response.data.inventory) {
        setBooks(response.data.inventory);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async (bookId) => {
    if (window.confirm('Are you sure you want to remove this book from inventory?')) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        
        // Replace with your actual API endpoint for removing books from inventory
        await axios.delete(`${apiBaseUrl}/api/admin/stores/${storeId}/inventory/${bookId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        // Refresh inventory after removal
        fetchInventory();
      } catch (error) {
        console.error('Error removing book:', error);
        alert('Failed to remove book from inventory');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Store Inventory</h3>
        <button
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          onClick={handleAddBook}
        >
          <PlusCircle size={16} className="mr-2" />
          Add Book
        </button>
      </div>
      
      {isLoading ? (
        <div className="p-6 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-2"></div>
          <p className="text-gray-500">Loading inventory...</p>
        </div>
      ) : books.length > 0 ? (
        <InventoryTable inventory={books} onRemoveBook={handleRemoveBook} />
      ) : (
        <EmptyInventory onAddBook={handleAddBook} />
      )}

      {/* TODO: Implement Add Book Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Add Book to Inventory</h2>
            <p className="text-gray-500 mb-4">
              This feature is coming soon. You'll be able to add books to this store's inventory.
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
                onClick={() => setShowAddModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const InventoryTable = ({ inventory, onRemoveBook }) => {
  // Helper function to format book status based on quantity
  const getBookStatus = (quantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity < 5) return "Low Stock";
    return "In Stock";
  };

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
          {inventory.map((item) => {
            const status = getBookStatus(item.quantity || 0);
            
            return (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {item.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.isbn || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.category || 'Uncategorized'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  ${item.price ? item.price.toFixed(2) : '0.00'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {item.quantity || 0}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getInventoryStatusClass(status)}`}>
                    {status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button className="text-blue-600 hover:text-blue-800 mr-3 transition duration-150">
                    Edit
                  </button>
                  <button 
                    className="text-red-500 hover:text-red-700 transition duration-150"
                    onClick={() => onRemoveBook(item._id)}
                  >
                    Remove
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const EmptyInventory = ({ onAddBook }) => {
  return (
    <div className="p-6 text-center">
      <Book size={48} className="mx-auto text-gray-400 mb-2" />
      <p className="text-gray-500">No inventory items found for this store</p>
      <button
        className="mt-4 inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
        onClick={onAddBook}
      >
        <PlusCircle size={16} className="mr-2" />
        Add First Book
      </button>
    </div>
  );
};

export default StoreInventory;