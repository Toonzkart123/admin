// src/components/stores/inventory/StoreInventory.jsx
import React, { useState, useEffect } from 'react';
import { PlusCircle, Book } from 'lucide-react';
import { getInventoryStatusClass } from '../../../pages/StoreDetails';
import axios from 'axios';
import BookModalStores from './BookModalStores';

const StoreInventory = ({ inventory = [], storeId, apiBaseUrl }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [inventoryItems, setInventoryItems] = useState(inventory || []);
  const [books, setBooks] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    setInventoryItems(inventory || []);
    
    // Fetch book details when inventory changes
    if (inventory && inventory.length > 0) {
      fetchBookDetails(inventory);
    }
  }, [inventory]);

  // Add a new useEffect to fetch the store when component mounts
  useEffect(() => {
    if (storeId) {
      fetchInventory();
    }
  }, [storeId]);

  const handleAddBook = () => {
    setShowAddModal(true);
  };

  // Fetch details for each book ID in the inventory array
  const fetchBookDetails = async (inventoryItems) => {
    if (!inventoryItems || inventoryItems.length === 0) {
      setBooks([]);
      return;
    }
    
    setIsLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token is required');
      }

      // Fetch details for each book in the inventory
      const bookDetailsPromises = inventoryItems.map(item => 
        axios.get(`${apiBaseUrl}/api/admin/books/${item.book}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
      );

      const responses = await Promise.all(bookDetailsPromises);
      
      // Combine book details with inventory stock information
      const booksWithStock = responses.map((response, index) => {
        return {
          ...response.data,
          inventoryId: inventoryItems[index]._id,
          stock: inventoryItems[index].stock
        };
      });
      
      setBooks(booksWithStock);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch the latest store inventory
  const fetchInventory = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      if (!token) {
        throw new Error('Authentication token is required');
      }

      const response = await axios.get(`${apiBaseUrl}/api/admin/stores/${storeId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      console.log("Store response:", response.data);
      
      // If the store has an inventory array, update state and fetch book details
      if (response.data.inventory && Array.isArray(response.data.inventory)) {
        setInventoryItems(response.data.inventory);
        await fetchBookDetails(response.data.inventory);
      }
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveBook = async (inventoryId) => {
    if (window.confirm('Are you sure you want to remove this book from inventory?')) {
      try {
        setIsLoading(true);
        const token = localStorage.getItem('adminToken');
        
        // Replace with your actual API endpoint for removing books from inventory
        await axios.delete(`${apiBaseUrl}/api/admin/stores/${storeId}/inventory/${inventoryId}`, {
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

  const handleUpdateStock = async (inventoryId, newStock) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('adminToken');
      
      await axios.put(`${apiBaseUrl}/api/admin/stores/${storeId}/inventory/${inventoryId}`, 
        { stock: newStock },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      // Refresh inventory after updating stock
      fetchInventory();
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveBook = async (data) => {
    // The book was saved and added to the store's inventory
    console.log('Book added to inventory:', data);
    setShowAddModal(false);
    
    // Refresh the inventory
    fetchInventory();
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
        <InventoryTable 
          inventory={books} 
          onRemoveBook={handleRemoveBook} 
          onUpdateStock={handleUpdateStock}
        />
      ) : (
        <EmptyInventory onAddBook={handleAddBook} />
      )}

      {/* Book Modal for adding new books to inventory */}
      {showAddModal && (
        <BookModalStores 
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          onSave={handleSaveBook}
          storeId={storeId}
          apiBaseUrl={apiBaseUrl}
        />
      )}
    </div>
  );
};

const InventoryTable = ({ inventory, onRemoveBook, onUpdateStock }) => {
  // Helper function to format book status based on quantity
  const getBookStatus = (quantity) => {
    if (quantity <= 0) return "Out of Stock";
    if (quantity < 5) return "Low Stock";
    return "In Stock";
  };

  const handleStockChange = (e, inventoryId) => {
    const newStock = parseInt(e.target.value) || 0;
    if (newStock >= 0) {
      onUpdateStock(inventoryId, newStock);
    }
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
              Stock
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
            const status = getBookStatus(item.stock || 0);
            
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
                  {item.stock || 0}
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
                    onClick={() => onRemoveBook(item.inventoryId)}
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