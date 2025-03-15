import React, { useState } from 'react';
import { Search, Filter, UserPlus, Download, Mail, Lock, Edit, Trash2, UserCheck, Phone } from 'lucide-react';

// Mock data for users
const mockUsers = [
  {
    id: 'CUST-1234',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '(555) 123-4567',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-09-15',
    orders: 12,
    totalSpent: 345.67,
    lastActive: '2025-03-08'
  },
  {
    id: 'CUST-5678',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '(555) 987-6543',
    role: 'Customer',
    status: 'Active',
    joinDate: '2024-11-02',
    orders: 5,
    totalSpent: 129.95,
    lastActive: '2025-03-09'
  },
  {
    id: 'ADMN-0001',
    name: 'Robert Johnson',
    email: 'robert.johnson@example.com',
    phone: '(555) 555-5555',
    role: 'Admin',
    status: 'Active',
    joinDate: '2024-08-10',
    orders: 0,
    totalSpent: 0,
    lastActive: '2025-03-09'
  },
  {
    id: 'CUST-9101',
    name: 'Emily Brown',
    email: 'emily.brown@example.com',
    phone: '(555) 111-2222',
    role: 'Customer',
    status: 'Inactive',
    joinDate: '2024-10-20',
    orders: 3,
    totalSpent: 89.97,
    lastActive: '2024-12-15'
  },
  {
    id: 'SUPP-0002',
    name: 'Michael Wilson',
    email: 'michael.wilson@example.com',
    phone: '(555) 222-3333',
    role: 'Support',
    status: 'Active',
    joinDate: '2024-09-01',
    orders: 0,
    totalSpent: 0,
    lastActive: '2025-03-08'
  }
];

const Users = () => {
  const [users, setUsers] = useState(mockUsers);
  const [filteredUsers, setFilteredUsers] = useState(mockUsers);
  const [activeTab, setActiveTab] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserForm, setShowUserForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserProfile, setShowUserProfile] = useState(false);
  
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (!query) {
      applyFilter(activeTab, users);
    } else {
      const lowercaseQuery = query.toLowerCase();
      const filtered = users.filter(user => 
        user.name.toLowerCase().includes(lowercaseQuery) || 
        user.email.toLowerCase().includes(lowercaseQuery) ||
        user.id.toLowerCase().includes(lowercaseQuery)
      );
      setFilteredUsers(filtered);
    }
  };
  
  const applyFilter = (filter, userList = users) => {
    setActiveTab(filter);
    
    if (filter === 'all') {
      setFilteredUsers(userList);
    } else if (filter === 'customers') {
      setFilteredUsers(userList.filter(user => user.role === 'Customer'));
    } else if (filter === 'admins') {
      setFilteredUsers(userList.filter(user => user.role === 'Admin'));
    } else if (filter === 'support') {
      setFilteredUsers(userList.filter(user => user.role === 'Support'));
    } else if (filter === 'active') {
      setFilteredUsers(userList.filter(user => user.status === 'Active'));
    } else if (filter === 'inactive') {
      setFilteredUsers(userList.filter(user => user.status === 'Inactive'));
    }
  };
  
  const handleAddUser = () => {
    setSelectedUser(null);
    setShowUserForm(true);
  };
  
  const handleEditUser = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setShowUserForm(true);
  };
  
  const handleViewProfile = (userId) => {
    const user = users.find(u => u.id === userId);
    setSelectedUser(user);
    setShowUserProfile(true);
  };
  
  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      setUsers(updatedUsers);
      applyFilter(activeTab, updatedUsers);
    }
  };
  
  const handleToggleStatus = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return {
          ...user,
          status: user.status === 'Active' ? 'Inactive' : 'Active'
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    applyFilter(activeTab, updatedUsers);
  };
  
  const handleSaveUser = (userData) => {
    let updatedUsers;
    
    if (selectedUser) {
      // Update existing user
      updatedUsers = users.map(user => 
        user.id === userData.id ? { ...userData } : user
      );
    } else {
      // Add new user
      const newUser = {
        ...userData,
        id: `CUST-${Math.floor(1000 + Math.random() * 9000)}`,
        joinDate: new Date().toISOString().split('T')[0],
        orders: 0,
        totalSpent: 0,
        lastActive: new Date().toISOString().split('T')[0]
      };
      updatedUsers = [...users, newUser];
    }
    
    setUsers(updatedUsers);
    applyFilter(activeTab, updatedUsers);
    setShowUserForm(false);
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  const getRoleBadgeClass = (role) => {
    switch(role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-800';
      case 'Support':
        return 'bg-blue-100 text-blue-800';
      case 'Customer':
      default:
        return 'bg-green-100 text-green-800';
    }
  };
  
  const getStatusBadgeClass = (status) => {
    return status === 'Active' 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  };

  return (
    <div className="w-full p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 sm:gap-0">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-500 mt-2">Manage your users and their permissions</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleAddUser}
            className="inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
          >
            <UserPlus size={16} className="mr-2" />
            Add New User
          </button>
          <button className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150">
            <Download size={16} className="mr-2" />
            Export Users
          </button>
        </div>
      </div>
      
      {/* User filters */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 md:gap-0">
          <div className="flex items-center">
            <Filter size={18} className="mr-3 text-blue-600" />
            <h3 className="text-lg font-medium text-gray-900">User Filters</h3>
          </div>
          <div className="relative w-full md:w-64">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Search size={18} className="text-gray-400" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px overflow-x-auto">
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'all' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('all')}
            >
              All Users
            </button>
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'customers' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('customers')}
            >
              Customers
            </button>
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'admins' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('admins')}
            >
              Admins
            </button>
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'support' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('support')}
            >
              Support
            </button>
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'active' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('active')}
            >
              Active
            </button>
            <button 
              className={`py-4 px-6 text-center border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === 'inactive' 
                  ? 'border-blue-500 text-blue-600' 
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
              onClick={() => applyFilter('inactive')}
            >
              Inactive
            </button>
          </nav>
        </div>
      </div>
      
      {/* Users table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500 mt-1">{user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{user.email}</div>
                    <div className="text-sm text-gray-500 mt-1">{user.phone}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(user.role)}`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(user.status)}`}>
                      {user.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Joined: {formatDate(user.joinDate)}</div>
                    <div className="mt-1">Last active: {formatDate(user.lastActive)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button 
                      onClick={() => handleViewProfile(user.id)}
                      className="text-blue-600 hover:text-blue-800 mr-4 transition duration-150"
                    >
                      View
                    </button>
                    <button 
                      onClick={() => handleEditUser(user.id)}
                      className="text-indigo-600 hover:text-indigo-800 mr-4 transition duration-150"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => handleToggleStatus(user.id)}
                      className={`${
                        user.status === 'Active' ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'
                      } mr-4 transition duration-150`}
                    >
                      {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-500 hover:text-red-700 transition duration-150"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredUsers.length === 0 && (
          <div className="p-6 text-center">
            <p className="text-gray-500">No users match your search criteria.</p>
          </div>
        )}
        
        <div className="border-t border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing {filteredUsers.length} of {users.length} users
          </div>
          <div className="flex-1 flex justify-end">
            <nav className="inline-flex rounded-md shadow-sm" aria-label="Pagination">
              <button className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600 hover:bg-blue-100">
                1
              </button>
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                2
              </button>
              <button className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
      
      {/* User form modal */}
      {showUserForm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-6 pt-6 pb-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 mb-6">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h3>
                
                <form>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        defaultValue={selectedUser?.name || ''}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        defaultValue={selectedUser?.email || ''}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        defaultValue={selectedUser?.phone || ''}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                        Role
                      </label>
                      <select
                        id="role"
                        name="role"
                        defaultValue={selectedUser?.role || 'Customer'}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="Customer">Customer</option>
                        <option value="Admin">Admin</option>
                        <option value="Support">Support</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        id="status"
                        name="status"
                        defaultValue={selectedUser?.status || 'Active'}
                        className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                    
                    {!selectedUser && (
                      <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                          Password
                        </label>
                        <input
                          type="password"
                          id="password"
                          name="password"
                          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        />
                      </div>
                    )}
                  </div>
                </form>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => {
                    // Normally would pull form values and validate
                    // Using mock data for this example
                    handleSaveUser(selectedUser || {
                      name: 'New User',
                      email: 'newuser@example.com',
                      phone: '(555) 555-5555',
                      role: 'Customer',
                      status: 'Active'
                    });
                  }}
                >
                  {selectedUser ? 'Save Changes' : 'Add User'}
                </button>
                <button 
                  type="button" 
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUserForm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* User profile modal */}
      {showUserProfile && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="bg-white px-6 pt-6 pb-6">
                <div className="flex justify-between items-start mb-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    User Profile
                  </h3>
                  <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getStatusBadgeClass(selectedUser.status)}`}>
                    {selectedUser.status}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="col-span-1">
                    <div className="text-center mb-6">
                      <div className="h-32 w-32 mx-auto rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-4xl">
                        {selectedUser.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <h4 className="mt-3 text-xl font-medium text-gray-900">{selectedUser.name}</h4>
                      <span className={`px-3 py-1 text-xs leading-5 font-semibold rounded-full ${getRoleBadgeClass(selectedUser.role)}`}>
                        {selectedUser.role}
                      </span>
                    </div>
                    
                    <div className="border-t border-gray-200 py-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h4>
                      <p className="text-sm flex items-center">
                        <Mail size={16} className="text-gray-400 mr-3" />
                        {selectedUser.email}
                      </p>
                      <p className="text-sm flex items-center mt-2">
                        <Phone size={16} className="text-gray-400 mr-3" />
                        {selectedUser.phone}
                      </p>
                    </div>
                  </div>
                  
                  <div className="col-span-1">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Account Details</h4>
                      <p className="text-sm"><span className="font-medium">User ID:</span> {selectedUser.id}</p>
                      <p className="text-sm mt-2"><span className="font-medium">Joined:</span> {formatDate(selectedUser.joinDate)}</p>
                      <p className="text-sm mt-2"><span className="font-medium">Last Active:</span> {formatDate(selectedUser.lastActive)}</p>
                    </div>
                    
                    {selectedUser.role === 'Customer' && (
                      <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Order History</h4>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">Total Orders</span>
                            <span className="text-sm font-medium">{selectedUser.orders}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Total Spent</span>
                            <span className="text-sm font-medium">${selectedUser.totalSpent.toFixed(2)}</span>
                          </div>
                        </div>
                        <button className="mt-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium transition duration-150">
                          <Eye size={16} className="mr-2" />
                          View Order History
                        </button>
                      </div>
                    )}
                    
                    {(selectedUser.role === 'Admin' || selectedUser.role === 'Support') && (
                      <div className="pt-4">
                        <h4 className="text-sm font-medium text-gray-500 mb-3">Permissions</h4>
                        <div className="space-y-3">
                          <div className="flex items-center">
                            <input 
                              id="perm-orders" 
                              type="checkbox" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked={selectedUser.role === 'Admin'}
                            />
                            <label htmlFor="perm-orders" className="ml-3 block text-sm text-gray-900">
                              Manage Orders
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              id="perm-inventory" 
                              type="checkbox" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked={selectedUser.role === 'Admin'}
                            />
                            <label htmlFor="perm-inventory" className="ml-3 block text-sm text-gray-900">
                              Manage Inventory
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              id="perm-users" 
                              type="checkbox" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked={selectedUser.role === 'Admin'}
                            />
                            <label htmlFor="perm-users" className="ml-3 block text-sm text-gray-900">
                              Manage Users
                            </label>
                          </div>
                          <div className="flex items-center">
                            <input 
                              id="perm-settings" 
                              type="checkbox" 
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                              defaultChecked={selectedUser.role === 'Admin'}
                            />
                            <label htmlFor="perm-settings" className="ml-3 block text-sm text-gray-900">
                              Manage Settings
                            </label>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-4 sm:flex sm:flex-row-reverse">
                <button 
                  type="button" 
                  className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => handleEditUser(selectedUser.id)}
                >
                  <Edit size={16} className="mr-2" />
                  Edit Profile
                </button>
                {selectedUser.status === 'Active' ? (
                  <button 
                    type="button" 
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleToggleStatus(selectedUser.id);
                      setShowUserProfile(false);
                    }}
                  >
                    <Lock size={16} className="mr-2" />
                    Deactivate
                  </button>
                ) : (
                  <button 
                    type="button" 
                    className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => {
                      handleToggleStatus(selectedUser.id);
                      setShowUserProfile(false);
                    }}
                  >
                    <UserCheck size={16} className="mr-2" />
                    Activate
                  </button>
                )}
                <button 
                  type="button" 
                  className="mt-3 inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUserProfile(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;