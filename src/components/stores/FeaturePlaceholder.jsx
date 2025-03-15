// src/components/stores/FeaturePlaceholder.jsx
import React from 'react';

const FeaturePlaceholder = ({ icon, title }) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 text-center">
      {icon && React.cloneElement(icon, { className: 'mx-auto text-gray-400 mb-2', size: 48 })}
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500">This feature will be available soon.</p>
    </div>
  );
};

export default FeaturePlaceholder;