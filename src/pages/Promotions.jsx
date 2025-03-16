// src/pages/Promotions.jsx
import { useState, useEffect } from 'react';
import { 
  Tag, Plus, Edit, Trash2, Search, 
  X, Check, Percent, DollarSign, Calendar
} from 'lucide-react';
import { format } from 'date-fns';

const Promotions = () => {
  // Sample promotions data - in a real app, this would come from an API
  const [promotions, setPromotions] = useState([
    {
      id: 1,
      code: 'WELCOME20',
      type: 'percentage',
      value: 20,
      startDate: new Date('2025-01-01'),
      endDate: new Date('2025-12-31'),
      usageLimit: 1000,
      usageCount: 450,
      isActive: true
    },
    {
      id: 2,
      code: 'SUMMER10',
      type: 'percentage', 
      value: 10,
      startDate: new Date('2025-05-01'),
      endDate: new Date('2025-08-31'),
      usageLimit: 500,
      usageCount: 115,
      isActive: true
    },
    {
      id: 3,
      code: 'FREESHIP',
      type: 'fixed',
      value: 5.99,
      startDate: new Date('2025-02-01'),
      endDate: new Date('2025-04-30'),
      usageLimit: 2000,
      usageCount: 967,
      isActive: false
    }
  ]);

  // State for search, modal, and editing
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: '',
    startDate: format(new Date(), 'yyyy-MM-dd'),
    endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
    usageLimit: '',
    isActive: true
  });

  // Filter promotions based on search term
  const filteredPromotions = promotions.filter(promo => 
    promo.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Handle opening the modal for creating or editing
  const handleOpenModal = (promotion = null) => {
    if (promotion) {
      // Edit existing promotion
      setEditingPromotion(promotion);
      setFormData({
        code: promotion.code,
        type: promotion.type,
        value: promotion.value,
        startDate: format(new Date(promotion.startDate), 'yyyy-MM-dd'),
        endDate: format(new Date(promotion.endDate), 'yyyy-MM-dd'),
        usageLimit: promotion.usageLimit,
        isActive: promotion.isActive
      });
    } else {
      // Create new promotion
      setEditingPromotion(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: '',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: format(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
        usageLimit: '',
        isActive: true
      });
    }
    setIsModalOpen(true);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create the promotion object
    const promotionData = {
      code: formData.code,
      type: formData.type,
      value: parseFloat(formData.value),
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      usageLimit: parseInt(formData.usageLimit),
      usageCount: editingPromotion ? editingPromotion.usageCount : 0,
      isActive: formData.isActive
    };
    
    if (editingPromotion) {
      // Update existing promotion
      setPromotions(promotions.map(promo => 
        promo.id === editingPromotion.id ? { ...promotionData, id: promo.id } : promo
      ));
    } else {
      // Add new promotion
      const newId = Math.max(...promotions.map(p => p.id), 0) + 1;
      setPromotions([...promotions, { ...promotionData, id: newId }]);
    }
    
    // Close modal
    setIsModalOpen(false);
  };

  // Handle promotion deletion
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(promotions.filter(promo => promo.id !== id));
    }
  };

  // Handle toggling promotion active status
  const toggleActiveStatus = (id) => {
    setPromotions(promotions.map(promo => 
      promo.id === id ? { ...promo, isActive: !promo.isActive } : promo
    ));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <Tag className="mr-2 text-blue-600" size={28} />
          <h1 className="text-2xl font-bold text-gray-800">Promotions</h1>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center hover:bg-blue-700"
        >
          <Plus size={20} className="mr-2" />
          Add Promotion
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex items-center">
        <div className="relative flex-grow max-w-md">
          <input
            type="text"
            placeholder="Search promo codes..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>

      {/* Promotions Table */}
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Usage</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredPromotions.length > 0 ? (
              filteredPromotions.map((promotion) => (
                <tr key={promotion.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{promotion.code}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {promotion.type === 'percentage' ? (
                        <>
                          <Percent size={16} className="mr-1 text-green-600" />
                          <span>{promotion.value}% off</span>
                        </>
                      ) : (
                        <>
                          <DollarSign size={16} className="mr-1 text-green-600" />
                          <span>${promotion.value.toFixed(2)} off</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {format(new Date(promotion.startDate), 'MM/dd/yyyy')} - {format(new Date(promotion.endDate), 'MM/dd/yyyy')}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {promotion.usageCount} / {promotion.usageLimit}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${Math.min(100, (promotion.usageCount / promotion.usageLimit) * 100)}%` }}
                      ></div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span 
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        promotion.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {promotion.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => toggleActiveStatus(promotion.id)}
                      className={`mr-2 p-1 rounded-full ${
                        promotion.isActive ? 'text-red-600 hover:bg-red-100' : 'text-green-600 hover:bg-green-100'
                      }`}
                      title={promotion.isActive ? 'Deactivate' : 'Activate'}
                    >
                      {promotion.isActive ? <X size={18} /> : <Check size={18} />}
                    </button>
                    <button 
                      onClick={() => handleOpenModal(promotion)}
                      className="mr-2 p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(promotion.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                  No promotions found. Try a different search or create a new promotion.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Promotion Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {editingPromotion ? 'Edit Promotion' : 'Add New Promotion'}
              </h2>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                {/* Promo Code */}
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700">Promo Code</label>
                  <input
                    type="text"
                    id="code"
                    name="code"
                    value={formData.code}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    required
                  />
                </div>

                {/* Discount Type */}
                <div>
                  <label htmlFor="type" className="block text-sm font-medium text-gray-700">Discount Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Fixed Amount ($)</option>
                  </select>
                </div>

                {/* Discount Value */}
                <div>
                  <label htmlFor="value" className="block text-sm font-medium text-gray-700">
                    {formData.type === 'percentage' ? 'Discount Percentage' : 'Discount Amount'}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {formData.type === 'percentage' ? <Percent size={16} className="text-gray-400" /> : <DollarSign size={16} className="text-gray-400" />}
                    </div>
                    <input
                      type="number"
                      id="value"
                      name="value"
                      value={formData.value}
                      onChange={handleInputChange}
                      className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                      placeholder={formData.type === 'percentage' ? "10" : "5.99"}
                      min={formData.type === 'percentage' ? "0" : "0.01"}
                      max={formData.type === 'percentage' ? "100" : "1000"}
                      step={formData.type === 'percentage' ? "1" : "0.01"}
                      required
                    />
                  </div>
                </div>

                {/* Date Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">Start Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="startDate"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">End Date</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="date"
                        id="endDate"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Usage Limit */}
                <div>
                  <label htmlFor="usageLimit" className="block text-sm font-medium text-gray-700">Usage Limit</label>
                  <input
                    type="number"
                    id="usageLimit"
                    name="usageLimit"
                    value={formData.usageLimit}
                    onChange={handleInputChange}
                    className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm border p-2"
                    min="1"
                    required
                  />
                </div>

                {/* Status */}
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    name="isActive"
                    checked={formData.isActive}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                    Active
                  </label>
                </div>
              </div>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="mr-3 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {editingPromotion ? 'Save Changes' : 'Create Promotion'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Promotions;