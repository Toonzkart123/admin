// src/components/common/Loader.jsx
import React from 'react';

const Loader = ({ message = 'Loading...' }) => {
  return (
    <div className="w-full p-6 flex items-center justify-center">
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-gray-200 border-t-blue-600 mb-2"></div>
        <p className="text-gray-500">{message}</p>
      </div>
    </div>
  );
};

export default Loader;