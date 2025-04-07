// import { useState, useEffect } from 'react';
// import axios from 'axios';
// import { AlertCircle, BookOpen, CheckCircle, Clock, Phone, User } from 'lucide-react';

// const ShopOnDemand = () => {
//   const [requests, setRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [statusFilter, setStatusFilter] = useState('all');

//   useEffect(() => {
//     fetchRequests();
//   }, []);

//   const fetchRequests = async () => {
//     try {
//       setLoading(true);
//       const token = localStorage.getItem('adminToken');
      
//       if (!token) {
//         throw new Error('Authorization token not found. Please log in again.');
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       };

//       const { data } = await axios.get(
//         'https://backend-lzb7.onrender.com/api/admin/book-requests',
//         config
//       );

//       setRequests(data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//       setLoading(false);
//     }
//   };

//   const updateRequestStatus = async (requestId, newStatus) => {
//     try {
//       const token = localStorage.getItem('adminToken');
      
//       if (!token) {
//         throw new Error('Authorization token not found');
//       }

//       const config = {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`
//         }
//       };

//       await axios.put(
//         `https://backend-lzb7.onrender.com/api/admin/book-requests/${requestId}`,
//         { status: newStatus },
//         config
//       );

//       // Update local state
//       setRequests(requests.map(req => 
//         req._id === requestId ? { ...req, status: newStatus } : req
//       ));
//     } catch (err) {
//       setError(err.response?.data?.message || err.message);
//     }
//   };

//   const getFilteredRequests = () => {
//     if (statusFilter === 'all') return requests;
//     return requests.filter(req => req.status.toLowerCase() === statusFilter.toLowerCase());
//   };

//   const getStatusBadge = (status) => {
//     switch (status.toLowerCase()) {
//       case 'pending':
//         return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center"><Clock size={16} className="mr-1" /> Pending</span>;
//       case 'approved':
//         return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center"><CheckCircle size={16} className="mr-1" /> Approved</span>;
//       case 'reviewed':
//         return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center"><CheckCircle size={16} className="mr-1" /> Reviewed</span>;
//       case 'rejected':
//         return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 flex items-center"><AlertCircle size={16} className="mr-1" /> Rejected</span>;
//       default:
//         return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">{status}</span>;
//     }
//   };

//   const formatDate = (dateString) => {
//     const options = { 
//       year: 'numeric', 
//       month: 'short', 
//       day: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     };
//     return new Date(dateString).toLocaleDateString(undefined, options);
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-6">Shop On Demand Requests</h1>
      
//       {error && (
//         <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
//           {error}
//           <button 
//             className="ml-2 underline" 
//             onClick={() => {
//               setError(null);
//               fetchRequests();
//             }}
//           >
//             Retry
//           </button>
//         </div>
//       )}

//       <div className="mb-4 flex flex-wrap items-center gap-2">
//         <span className="mr-2">Filter:</span>
//         <div className="flex flex-wrap gap-2">
//           <button 
//             className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//             onClick={() => setStatusFilter('all')}
//           >
//             All
//           </button>
//           <button 
//             className={`px-3 py-1 rounded-lg ${statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//             onClick={() => setStatusFilter('pending')}
//           >
//             Pending
//           </button>
//           <button 
//             className={`px-3 py-1 rounded-lg ${statusFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//             onClick={() => setStatusFilter('approved')}
//           >
//             Approved
//           </button>
//           <button 
//             className={`px-3 py-1 rounded-lg ${statusFilter === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//             onClick={() => setStatusFilter('reviewed')}
//           >
//             Reviewed
//           </button>
//           <button 
//             className={`px-3 py-1 rounded-lg ${statusFilter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
//             onClick={() => setStatusFilter('rejected')}
//           >
//             Rejected
//           </button>
//         </div>
//         <button 
//           className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center"
//           onClick={fetchRequests}
//         >
//           Refresh
//         </button>
//       </div>

//       {loading ? (
//         <div className="flex justify-center items-center h-64">
//           <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
//         </div>
//       ) : getFilteredRequests().length === 0 ? (
//         <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
//           No requests found.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 gap-6">
//           {getFilteredRequests().map(request => (
//             <div key={request._id} className="bg-white rounded-lg shadow overflow-hidden">
//               <div className="p-5 border-b">
//                 <div className="flex flex-wrap justify-between items-center mb-4">
//                   <div className="flex items-center gap-3 mb-2 sm:mb-0">
//                     <User className="text-blue-600" />
//                     <div>
//                       <h3 className="font-bold">{request.user.name}</h3>
//                       <p className="text-sm text-gray-600">{request.user.email}</p>
//                     </div>
//                   </div>
//                   <div className="flex flex-wrap items-center gap-3">
//                     <div className="flex items-center">
//                       <Phone size={16} className="text-gray-500 mr-1" />
//                       <span className="text-sm">{request.phoneNumber}</span>
//                     </div>
//                     {getStatusBadge(request.status)}
//                   </div>
//                 </div>
                
//                 <div className="mt-4">
//                   <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
//                     <BookOpen size={18} className="mr-2 text-blue-600" />
//                     Requested Books
//                   </h4>
//                   <div className="space-y-3 mt-3">
//                     {request.books.map((book, index) => (
//                       <div key={book._id} className="p-3 bg-gray-50 rounded-lg">
//                         <p className="font-medium text-gray-800">{index + 1}. {book.title}</p>
//                         {book.author && (
//                           <p className="text-sm text-gray-600 mt-1">
//                             Author: {book.author}
//                           </p>
//                         )}
//                       </div>
//                     ))}
//                   </div>
//                 </div>
                
//                 <div className="mt-4 text-sm text-gray-500">
//                   Requested on: {formatDate(request.createdAt)}
//                 </div>
//               </div>
              
//               {request.status.toLowerCase() === 'pending' && (
//                 <div className="p-4 bg-gray-50 flex flex-wrap gap-2">
//                   <button 
//                     className="px-4 py-2 bg-green-600 text-white rounded-lg"
//                     onClick={() => updateRequestStatus(request._id, 'Approved')}
//                   >
//                     Approve
//                   </button>
//                   <button 
//                     className="px-4 py-2 bg-blue-600 text-white rounded-lg"
//                     onClick={() => updateRequestStatus(request._id, 'Reviewed')}
//                   >
//                     Mark as Reviewed
//                   </button>
//                   <button 
//                     className="px-4 py-2 bg-red-600 text-white rounded-lg"
//                     onClick={() => updateRequestStatus(request._id, 'Rejected')}
//                   >
//                     Reject
//                   </button>
//                 </div>
//               )}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default ShopOnDemand;



import { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, BookOpen, CheckCircle, Clock, Phone, User } from 'lucide-react';

const ShopOnDemand = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authorization token not found. Please log in again.');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      const { data } = await axios.get(
        'https://backend-lzb7.onrender.com/api/admin/book-requests',
        config
      );
      
      setRequests(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        throw new Error('Authorization token not found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put(
        `https://backend-lzb7.onrender.com/api/admin/book-requests/${requestId}`,
        { status: newStatus },
        config
      );

      // Update local state
      setRequests(requests.map(req => 
        req._id === requestId ? { ...req, status: newStatus } : req
      ));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    }
  };

  const getFilteredRequests = () => {
    if (statusFilter === 'all') return requests;
    return requests.filter(req => req.status.toLowerCase() === statusFilter.toLowerCase());
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return <span className="px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 flex items-center"><Clock size={16} className="mr-1" /> Pending</span>;
      case 'approved':
        return <span className="px-2 py-1 rounded-full bg-green-100 text-green-800 flex items-center"><CheckCircle size={16} className="mr-1" /> Approved</span>;
      case 'reviewed':
        return <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 flex items-center"><CheckCircle size={16} className="mr-1" /> Reviewed</span>;
      case 'rejected':
        return <span className="px-2 py-1 rounded-full bg-red-100 text-red-800 flex items-center"><AlertCircle size={16} className="mr-1" /> Rejected</span>;
      default:
        return <span className="px-2 py-1 rounded-full bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Shop On Demand Requests</h1>
      
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-800 rounded-lg">
          {error}
          <button 
            className="ml-2 underline" 
            onClick={() => {
              setError(null);
              fetchRequests();
            }}
          >
            Retry
          </button>
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="mr-2">Filter:</span>
        <div className="flex flex-wrap gap-2">
          <button 
            className={`px-3 py-1 rounded-lg ${statusFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter('all')}
          >
            All
          </button>
          <button 
            className={`px-3 py-1 rounded-lg ${statusFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter('pending')}
          >
            Pending
          </button>
          <button 
            className={`px-3 py-1 rounded-lg ${statusFilter === 'approved' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter('approved')}
          >
            Approved
          </button>
          <button 
            className={`px-3 py-1 rounded-lg ${statusFilter === 'reviewed' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter('reviewed')}
          >
            Reviewed
          </button>
          <button 
            className={`px-3 py-1 rounded-lg ${statusFilter === 'rejected' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
            onClick={() => setStatusFilter('rejected')}
          >
            Rejected
          </button>
        </div>
        <button 
          className="ml-auto px-3 py-1 bg-blue-600 text-white rounded-lg flex items-center"
          onClick={fetchRequests}
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : getFilteredRequests().length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
          No requests found.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {getFilteredRequests().map(request => (
            <div key={request._id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-5 border-b">
                <div className="flex flex-wrap justify-between items-center mb-4">
                  {/* Updated header to remove user info */}
                  <div className="flex items-center gap-3 mb-2 sm:mb-0">
  <User className="text-blue-600" />
  <div>
    {/* If schoolName is present, display "School: ..." otherwise show "Guest Request" */}
    {request.schoolName ? (
      <p className="font-bold text-gray-800">School: {request.schoolName}</p>
    ) : (
      <p className="font-bold text-gray-800">Guest Request</p>
    )}

    {/* If studentName is present, display "Student: ..." */}
    {request.studentName && (
      <p className="text-sm text-gray-600">
        Student: {request.studentName}
      </p>
    )}
  </div>
</div>
                  <div className="flex flex-wrap items-center gap-3">
                    <div className="flex items-center">
                      <Phone size={16} className="text-gray-500 mr-1" />
                      <span className="text-base font-semibold">{request.phoneNumber}</span>
                    </div>
                    {getStatusBadge(request.status)}
                  </div>
                </div>

                
                
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <BookOpen size={18} className="mr-2 text-blue-600" />
                    Requested Books
                  </h4>
                  <div className="space-y-3 mt-3">
                    {request.books.map((book, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <p className="font-medium text-gray-800">
                          {index + 1}. {book.title}
                        </p>
                        {book.author && (
                          <p className="text-sm text-gray-600 mt-1">
                            Author: {book.author}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Requested on: {formatDate(request.createdAt)}
                </div>
              </div>
              
              {request.status.toLowerCase() === 'pending' && (
                <div className="p-4 bg-gray-50 flex flex-wrap gap-2">
                  <button 
                    className="px-4 py-2 bg-green-600 text-white rounded-lg"
                    onClick={() => updateRequestStatus(request._id, 'Approved')}
                  >
                    Approve
                  </button>
                  <button 
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    onClick={() => updateRequestStatus(request._id, 'Reviewed')}
                  >
                    Mark as Reviewed
                  </button>
                  <button 
                    className="px-4 py-2 bg-red-600 text-white rounded-lg"
                    onClick={() => updateRequestStatus(request._id, 'Rejected')}
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ShopOnDemand;
