import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';

const StoreSchoolsTab = ({ storeId }) => {
  // Store's affiliated schools
  const [schools, setSchools] = useState([
    {
      id: 'sch-001',
      name: 'Lincoln High School',
      email: 'principal@lincolnhigh.edu',
      phone: '(317) 555-1234',
      status: 'active'
    },
    {
      id: 'sch-002',
      name: 'Washington Elementary',
      email: 'martinez@washingtones.edu',
      phone: '(317) 555-5678',
      status: 'active'
    },
    {
      id: 'sch-003',
      name: 'Jefferson Middle School',
      email: 'williams@jeffersonms.edu',
      phone: '(317) 555-9012',
      status: 'inactive'
    },
    {
      id: 'sch-004',
      name: 'Roosevelt Academy',
      email: 'thompson@rooseveltacademy.edu',
      phone: '(317) 555-3456',
      status: 'active'
    }
  ]);

  // All available schools for selection
  const [availableSchools, setAvailableSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState('');
  const [schoolSearchTerm, setSchoolSearchTerm] = useState('');
  
  // Filter available schools based on search term
  const filteredAvailableSchools = useMemo(() => {
    if (!schoolSearchTerm.trim()) return availableSchools;
    
    return availableSchools.filter(school => 
      school.name.toLowerCase().includes(schoolSearchTerm.toLowerCase()) || 
      (school.city && school.city.toLowerCase().includes(schoolSearchTerm.toLowerCase()))
    );
  }, [availableSchools, schoolSearchTerm]);
  
  // Search functionality
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredSchools = schools.filter(school => 
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (school.email && school.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (school.phone && school.phone.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Status filter
  const [statusFilter, setStatusFilter] = useState('all');
  
  const statusFilteredSchools = statusFilter === 'all' 
    ? filteredSchools 
    : filteredSchools.filter(school => school.status === statusFilter);
    
  // Fetch all schools from API
  const fetchSchools = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('adminToken');
      
      const response = await axios.get('https://backend-lzb7.onrender.com/api/admin/schools', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setAvailableSchools(response.data);
    } catch (err) {
      console.error('Error fetching schools:', err);
      setError('Failed to load schools. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Add a school to the store
  const addSchoolToStore = () => {
    if (!selectedSchool) return;
    
    const schoolToAdd = availableSchools.find(school => school._id === selectedSchool);
    
    if (schoolToAdd) {
      // In a real app, you would make an API call to associate the school with the store
      const newSchool = {
        id: schoolToAdd._id,
        name: schoolToAdd.name,
        email: schoolToAdd.email || 'info@' + schoolToAdd.name.toLowerCase().replace(/\s+/g, '') + '.edu',
        phone: schoolToAdd.phone || '(000) 000-0000',
        status: 'active'
      };
      
      setSchools([...schools, newSchool]);
      setShowModal(false);
      setSelectedSchool('');
    }
  };
  
  // Delete a school from the store
  const deleteSchool = (schoolId) => {
    if (window.confirm('Are you sure you want to remove this school?')) {
      // In a real app, you would make an API call to disassociate the school from the store
      setSchools(schools.filter(school => school.id !== schoolId));
    }
  };

  useEffect(() => {
    // Load available schools when modal is opened
    if (showModal) {
      fetchSchools();
    }
  }, [showModal]);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Affiliated Schools</h2>
        <button 
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          onClick={() => setShowModal(true)}
        >
          Add School
        </button>
      </div>

      {/* Filters and search */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search schools..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-5 w-5 absolute right-3 top-2.5 text-gray-400"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        
        <div className="w-full md:w-48">
          <select
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
      
      {/* School Selection Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Add School to Store</h3>
              <button 
                className="text-gray-400 hover:text-gray-600"
                onClick={() => setShowModal(false)}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-4">
                <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center py-4">{error}</div>
            ) : (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Search and Select a School
                  </label>
                  <div className="mb-4">
                    <input
                      type="text"
                      placeholder="Search schools by name or city..."
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      value={schoolSearchTerm}
                      onChange={(e) => setSchoolSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <div className="border border-gray-300 rounded-md max-h-60 overflow-y-auto mb-6">
                    {filteredAvailableSchools.length > 0 ? (
                      filteredAvailableSchools.map(school => (
                        <div 
                          key={school._id} 
                          className={`px-4 py-2 cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${selectedSchool === school._id ? 'bg-blue-50' : ''}`}
                          onClick={() => setSelectedSchool(school._id)}
                        >
                          <div className="font-medium">{school.name}</div>
                          {school.city && <div className="text-sm text-gray-500">{school.city}</div>}
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-center text-gray-500">
                        {schoolSearchTerm ? 'No schools match your search' : 'No schools available'}
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="flex justify-end gap-2">
                  <button
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!selectedSchool}
                    onClick={addSchoolToStore}
                  >
                    Add School
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Schools list */}
      {statusFilteredSchools.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">School</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {statusFilteredSchools.map(school => (
                <tr key={school.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">{school.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{school.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{school.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button 
                      className="text-red-600 hover:text-red-900"
                      onClick={() => deleteSchool(school.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-10">
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-10 w-10 mx-auto text-gray-400 mb-3"
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 2a10 10 0 110 20 10 10 0 010-20z" />
          </svg>
          <p className="text-gray-500 text-lg">No schools found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

export default StoreSchoolsTab;