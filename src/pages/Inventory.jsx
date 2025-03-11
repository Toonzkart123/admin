import React, { useState } from 'react';
import { PlusCircle, UploadCloud, Download } from 'lucide-react';
import InventoryFilters from '../components/modules/inventory/InventoryFilters';
import BookList from '../components/modules/inventory/BookList';
import BookModal from '../components/modules/inventory/BookModal';

// Mock data
const mockBooks = [
  {
    id: 1,
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    isbn: '9780061120084',
    category: 'Fiction',
    price: 14.99,
    originalPrice: 19.99,
    stock: 42,
    status: 'in-stock',
    coverImage: '/api/placeholder/200/300',
    discount: 25,
    publisher: 'HarperCollins',
    publishDate: '2006-05-23',
  },
  {
    id: 2,
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    isbn: '9780743273565',
    category: 'Fiction',
    price: 12.99,
    originalPrice: null,
    stock: 3,
    status: 'low-stock',
    coverImage: '/api/placeholder/200/300',
    discount: 0,
    publisher: 'Scribner',
    publishDate: '2004-09-30',
  },
  {
    id: 3,
    title: 'Sapiens: A Brief History of Humankind',
    author: 'Yuval Noah Harari',
    isbn: '9780062316097',
    category: 'Non-Fiction',
    price: 24.99,
    originalPrice: 29.99,
    stock: 28,
    status: 'in-stock',
    coverImage: '/api/placeholder/200/300',
    discount: 17,
    publisher: 'Harper',
    publishDate: '2015-02-10',
  },
  {
    id: 4,
    title: 'Becoming',
    author: 'Michelle Obama',
    isbn: '9781524763138',
    category: 'Biography',
    price: 18.99,
    originalPrice: 32.50,
    stock: 0,
    status: 'out-of-stock',
    coverImage: '/api/placeholder/200/300',
    discount: 42,
    publisher: 'Crown',
    publishDate: '2018-11-13',
  }
];

const Inventory = () => {
  const [books, setBooks] = useState(mockBooks);
  const [filteredBooks, setFilteredBooks] = useState(mockBooks);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBook, setCurrentBook] = useState(null);

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
      results = results.filter(book => book.category.toLowerCase() === filters.category);
    }
    
    if (filters.status) {
      results = results.filter(book => book.status === filters.status);
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
    const bookToEdit = books.find(book => book.id === id);
    setCurrentBook(bookToEdit);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (id) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      const updatedBooks = books.filter(book => book.id !== id);
      setBooks(updatedBooks);
      setFilteredBooks(updatedBooks);
    }
  };

  const handleSaveBook = (bookData) => {
    let updatedBooks;
    
    if (bookData.id) {
      // Update existing book
      updatedBooks = books.map(book => 
        book.id === bookData.id ? { ...bookData } : book
      );
    } else {
      // Add new book
      const newBook = {
        ...bookData,
        id: Math.max(...books.map(book => book.id), 0) + 1,
      };
      updatedBooks = [...books, newBook];
    }
    
    setBooks(updatedBooks);
    setFilteredBooks(updatedBooks);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Inventory Management</h1>
          <p className="text-gray-500 mt-1">Manage your book listings and stock</p>
        </div>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
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
      
      <BookList 
        books={filteredBooks} 
        onEdit={handleEditBook} 
        onDelete={handleDeleteBook} 
      />
      
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