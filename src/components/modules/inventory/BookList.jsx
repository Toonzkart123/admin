import React from 'react';
import BookCard from './BookCard';

const BookList = ({ books, onEdit, onDelete, onView }) => {
  if (books.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No books match your search criteria.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {books.map(book => (
        <BookCard 
          key={book.id} 
          book={book} 
          onEdit={onEdit} 
          onDelete={onDelete} 
          onView={onView || (() => {})}
        />
      ))}
    </div>
  );
};

export default BookList;