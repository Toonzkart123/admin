import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
// import NotFound from './pages/NotFound';
import './App.css';
import Stores from './pages/Stores';
import StoreDetails from './pages/StoreDetails';

function App() {
  return (
    <Router>
      <Routes>
        {/* Routes wrapped by MainLayout */}
        <Route path="/" element={<MainLayout />}>
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
        </Route>
        
        {/* 404 route */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
