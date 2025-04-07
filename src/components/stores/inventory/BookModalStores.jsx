import React, { useState, useEffect } from 'react';
import { X, Upload } from 'lucide-react';

const BookModalStore = ({ book, isOpen, onClose, onSave, storeId }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    isbn: '',
    category: '',
    description: '',
    price: '',
    originalPrice: '',
    discount: '',
    stock: '',
    status: 'In Stock',
    publisher: '',
    publishDate: '',
    language: 'English',
    pages: '',
    image: null
  });
  
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (book) {
      // Convert null values to empty strings for form fields
      const bookData = { ...book };
      Object.keys(bookData).forEach(key => {
        if (bookData[key] === null && key !== 'image') {
          bookData[key] = '';
        }
      });
      
      setFormData(bookData);
      
      // Set image preview if book has an image
      if (book.image) {
        setImagePreview(book.image);
      } else {
        setImagePreview(null);
      }
    }
  }, [book]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    if (type === 'file') {
      const file = e.target.files[0];
      setFormData({
        ...formData,
        [name]: file
      });
      
      // Create image preview
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData({
        ...formData,
        [name]: value
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      // Get token from localStorage
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authentication token is required');
      }

      // Prepare the book data
      const bookData = {
        title: formData.title,
        author: formData.author,
        isbn: formData.isbn,
        category: formData.category,
        description: formData.description,
        price: parseFloat(formData.price),
        originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
        discount: formData.discount ? parseFloat(formData.discount) : undefined,
        stock: parseInt(formData.stock),
        status: formData.status,
        publisher: formData.publisher,
        publishDate: formData.publishDate,
        language: formData.language,
        pages: formData.pages ? parseInt(formData.pages) : undefined,
        quantity: 1, // Default quantity when adding to inventory
        image: formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image
      };
      
      // Filter out undefined values
      Object.keys(bookData).forEach(key => {
        if (bookData[key] === undefined || bookData[key] === '') {
          delete bookData[key];
        }
      });

      // If editing an existing book
      if (formData._id) {
        // Create a response with the updated book data
        const responseData = {
          ...formData,
          ...bookData
        };
        
        // Return the response data to the parent component
        onSave(responseData);
        setIsSubmitting(false);
      }
      // If adding a new book to store
      else if (storeId) {
        // Add book to store inventory using the specified API
        const response = await fetch(`https://backend-lzb7.onrender.com/api/admin/stores/${storeId}/inventory`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(bookData)
        });
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || `Failed to add book to store: ${response.status} ${response.statusText}`);
        }
        
        const responseData = await response.json();
        
        // Return the response data to the parent component
        onSave(responseData);
        setIsSubmitting(false);
      }
      
    } catch (err) {
      console.error('Error saving book:', err);
      setError(err.message);
      setIsSubmitting(false);
    }
  };

  const categories = [
    'Fiction',
    'Non-Fiction',
    'Science',
    'History',
    'Biography',
    'Children',
    'Fantasy',
    'Mystery',
    'Romance',
    'Science Fiction',
    'Self-Help',
    'Business',
    'Social Studies',
    'Mathematics'
  ];

  const statusOptions = [
    'In Stock',
    'Low Stock',
    'Out of Stock',
    'Discontinued'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
          <div className="absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="text-gray-400 hover:text-gray-500 focus:outline-none"
              onClick={onClose}
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                {book ? 'Edit Book and Add to Store' : 'Add New Book to Store'}
              </h3>

              {error && (
                <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      required
                      value={formData.title}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                      Author *
                    </label>
                    <input
                      type="text"
                      name="author"
                      id="author"
                      required
                      value={formData.author}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="isbn" className="block text-sm font-medium text-gray-700">
                      ISBN *
                    </label>
                    <input
                      type="text"
                      name="isbn"
                      id="isbn"
                      required
                      value={formData.isbn}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      required
                      value={formData.category}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      <option value="">Select a category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price *
                      </label>
                      <input
                        type="number"
                        name="price"
                        id="price"
                        required
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700">
                        Original Price
                      </label>
                      <input
                        type="number"
                        name="originalPrice"
                        id="originalPrice"
                        min="0"
                        value={formData.originalPrice || ''}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                      Cover Image
                    </label>
                    <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                      {imagePreview ? (
                        <div className="space-y-1 text-center">
                          <img
                            src={imagePreview}
                            alt="Book cover preview"
                            className="mx-auto h-32 w-auto object-cover"
                          />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <button
                              type="button"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                              onClick={() => {
                                setFormData({ ...formData, image: null });
                                setImagePreview(null);
                              }}
                            >
                              Remove image
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-1 text-center">
                          <Upload className="mx-auto h-12 w-12 text-gray-400" />
                          <div className="flex text-sm text-gray-600 justify-center">
                            <label
                              htmlFor="image-upload"
                              className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                            >
                              <span>Upload a file</span>
                              <input
                                id="image-upload"
                                name="image"
                                type="file"
                                className="sr-only"
                                accept="image/*"
                                onChange={handleChange}
                              />
                            </label>
                          </div>
                          <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700">
                        Stock *
                      </label>
                      <input
                        type="number"
                        name="stock"
                        id="stock"
                        required
                        min="0"
                        value={formData.stock}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="discount" className="block text-sm font-medium text-gray-700">
                        Discount
                      </label>
                      <input
                        type="number"
                        name="discount"
                        id="discount"
                        min="0"
                        value={formData.discount || ''}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                      {statusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="publisher" className="block text-sm font-medium text-gray-700">
                      Publisher
                    </label>
                    <input
                      type="text"
                      name="publisher"
                      id="publisher"
                      value={formData.publisher || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700">
                        Publish Date
                      </label>
                      <input
                        type="date"
                        name="publishDate"
                        id="publishDate"
                        value={formData.publishDate ? formData.publishDate.slice(0, 10) : ''}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>

                    <div>
                      <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                        Language
                      </label>
                      <input
                        type="text"
                        name="language"
                        id="language"
                        value={formData.language || ''}
                        onChange={handleChange}
                        className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pages" className="block text-sm font-medium text-gray-700">
                      Pages
                    </label>
                    <input
                      type="number"
                      name="pages"
                      id="pages"
                      min="0"
                      value={formData.pages || ''}
                      onChange={handleChange}
                      className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:bg-blue-300"
              >
                {isSubmitting ? 'Saving...' : book ? 'Save Changes' : 'Add Book to Store'}
              </button>
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={onClose}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookModalStore;