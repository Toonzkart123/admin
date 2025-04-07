import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Users from './pages/Users';
import Financials from './pages/Financials';
import Promotions from './pages/Promotions';
import Reviews from './pages/Reviews';
import Analytics from './pages/Analytics';
import Marketing from './pages/Marketing';
import Security from './pages/Security';
import Settings from './pages/Settings';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';
import Login from './pages/Login';
import './App.css';
import Schools from './pages/Schools';
import ShopOnDemand from './pages/ShopOnDemand';
import Stationery from './pages/Stationery';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('adminInfo') !== null;
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected routes wrapped by MainLayout */}
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="users" element={<Users />} />
          <Route path="financials" element={<Financials />} />
          <Route path="promotions" element={<Promotions />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="security" element={<Security />} />
          <Route path="settings" element={<Settings />} />
          <Route path="stores" element={<Stores />} />
          <Route path="stores/:id" element={<StoreDetails />} />
          <Route path="schools" element={<Schools />} />
          <Route path="shop-on-demand" element={<ShopOnDemand />} />
          <Route path="stationery" element={<Stationery />} />
        </Route>
        
        {/* Redirect any unknown routes to login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;