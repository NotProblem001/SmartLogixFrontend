import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { NetworkBoundary } from './components/NetworkBoundary/NetworkBoundary';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardMetrics } from './features/dashboard/DashboardMetrics';
import InventoryDashboard from './features/inventory/InventoryDashboard';
import OrderDashboard from './features/orders/OrderDashboard';
import ShippingDashboard from './features/shipping/ShippingDashboard';
import './index.css';

/**
 * App.jsx con React Router y manejador de conexión.
 */
function App() {
  return (
    <NetworkBoundary>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<DashboardMetrics />} />
          <Route path="/inventory" element={<InventoryDashboard />} />
          <Route path="/orders" element={<OrderDashboard />} />
          <Route path="/shipping" element={<ShippingDashboard />} />
        </Routes>
      </DashboardLayout>
    </NetworkBoundary>
  );
}

export default App;
