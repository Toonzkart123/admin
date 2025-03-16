import React, { useState, useEffect } from 'react';
import { PlusCircle, UploadCloud, Download } from 'lucide-react';
import InventoryFilters from '../components/modules/inventory/InventoryFilters';
import BookList from '../components/modules/inventory/BookList';
import BookModal from '../components/modules/inventory/BookModal';

const Inventory = () => {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch books from API
  const fetchBooks = async () => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      const response = await fetch('https://backend-lzb7.onrender.com/api/admin/books', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch books: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      setBooks(data);
      setFilteredBooks(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching books:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  // Load books on component mount
  useEffect(() => {
    fetchBooks();
  }, []);

  const handleFilterChange = (filters) => {
    // Simple filtering implementation
    let results = [...books];
    
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      results = results.filter(book => 
        book.title.toLowerCase().includes(searchLower) || 
        book.author.toLowerCase().includes(searchLower) ||
        book.isbn.includes(filters.search)
      );
    }
    
    if (filters.category) {
      results = results.filter(book => book.category.toLowerCase() === filters.category.toLowerCase());
    }
    
    if (filters.status) {
      results = results.filter(book => book.status.toLowerCase() === filters.status.toLowerCase());
    }
    
    // Sort results
    if (filters.sortBy) {
      const sortField = filters.sortBy.startsWith('-') ? filters.sortBy.slice(1) : filters.sortBy;
      const sortOrder = filters.sortBy.startsWith('-') ? -1 : 1;
      
      results.sort((a, b) => {
        if (a[sortField] < b[sortField]) return -1 * sortOrder;
        if (a[sortField] > b[sortField]) return 1 * sortOrder;
        return 0;
      });
    }
    
    setFilteredBooks(results);
  };

  const handleAddBook = () => {
    setCurrentBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (id) => {
    const bookToEdit = books.find(book => book._id === id);
    setCurrentBook(bookToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteBook = async (id) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token is required');
      }
      
      // Show loading state
      setLoading(true);
      
      const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/books/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to delete book: ${response.status} ${response.statusText}`);
      }
      
      // Update state after successful deletion
      const updatedBooks = books.filter(book => book._id !== id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
      
      // Show success message
      alert('Book deleted successfully');
    } catch (err) {
      console.error('Error deleting book:', err);
      alert(`Failed to delete book: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveBook = async (responseData) => {
    // The BookModal now handles the API calls directly and returns the response data
    // We just need to refresh the book list here
    try {
      await fetchBooks();
      setIsModalOpen(false);
    } catch (err) {
      console.error('Error refreshing books:', err);
      alert(`Failed to refresh books: ${err.message}`);
    }
  };

  return (
    <div className="w-full p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 mt-1">Manage your book listings and stock</p>
          </div>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row gap-2">
            <button 
              onClick={handleAddBook}
              className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              <PlusCircle size={16} className="mr-2" />
              Add New Book
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition duration-150">
              <UploadCloud size={16} className="mr-2" />
              Bulk Upload
            </button>
            <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150">
              <Download size={16} className="mr-2" />
              Export
            </button>
          </div>
        </div>
        
        <InventoryFilters onFilterChange={handleFilterChange} />
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Loading inventory...</p>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500">Error: {error}</p>
        </div>
      ) : (
        <BookList 
          books={filteredBooks} 
          onEdit={handleEditBook} 
          onDelete={handleDeleteBook} 
        />
      )}
      
      {isModalOpen && (
        <BookModal 
          book={currentBook} 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          onSave={handleSaveBook} 
        />
      )}
    </div>
  );
};

export default Inventory;