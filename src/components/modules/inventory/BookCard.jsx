import React from 'react';
import { Edit, Trash2, Eye, Tag } from 'lucide-react';

const BookCard = ({ book, onEdit, onDelete, onView }) => {
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'in-stock':
        return 'bg-green-100 text-green-800';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock':
        return 'bg-red-100 text-red-800';
      case 'discontinued':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden flex flex-col">
      <div className="h-48 bg-gray-200 relative">
        {book.coverImage ? (
          <img 
            src={book.coverImage} 
            alt={book.title} 
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
            No Cover Image
          </div>
        )}
        
        {book.discount > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {book.discount}% OFF
          </div>
        )}
      </div>
      
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium text-gray-900 line-clamp-1">{book.title}</h3>
            <p className="text-sm text-gray-600 mt-1">{book.author}</p>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-bold text-gray-900">${book.price.toFixed(2)}</span>
            {book.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${book.originalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <div className="mt-3 flex flex-wrap gap-1">
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(book.status)}`}>
            {book.status === 'in-stock' ? 'In Stock' : 
              book.status === 'low-stock' ? 'Low Stock' : 
              book.status === 'out-of-stock' ? 'Out of Stock' : 'Discontinued'}
          </span>
          
          {book.category && (
            <span className="bg-blue-100 text-blue-800 px-2 py-1 text-xs font-medium rounded-full flex items-center">
              <Tag size={12} className="mr-1" />
              {book.category}
            </span>
          )}
        </div>
        
        <div className="mt-3 text-sm text-gray-500">
          <div className="flex items-center justify-between">
            <span>ISBN: {book.isbn}</span>
            <span>Stock: {book.stock}</span>
          </div>
        </div>
        
        <div className="mt-auto pt-4 flex justify-between border-t border-gray-100">
          <button 
            onClick={() => onView(book.id)} 
            className="text-gray-600 hover:text-gray-900 flex items-center transition duration-150"
          >
            <Eye size={16} className="mr-1" />
            <span className="text-sm">View</span>
          </button>
          
          <button 
            onClick={() => onEdit(book.id)} 
            className="text-blue-600 hover:text-blue-800 flex items-center transition duration-150"
          >
            <Edit size={16} className="mr-1" />
            <span className="text-sm">Edit</span>
          </button>
          
          <button 
            onClick={() => onDelete(book.id)} 
            className="text-red-500 hover:text-red-700 flex items-center transition duration-150"
          >
            <Trash2 size={16} className="mr-1" />
            <span className="text-sm">Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;