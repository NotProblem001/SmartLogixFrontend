import React from 'react';
<<<<<<< HEAD
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';
import { DashboardPage } from './pages/DashboardPage';
import { InventoryPage } from './pages/InventoryPage';
import { OrdersPage } from './pages/OrdersPage';
import { ShippingPage } from './pages/ShippingPage';
import { LoginPage } from './pages/LoginPage';
import './index.css';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <ProtectedRoute allowedRoles={['admin', 'warehouse']}>
                <InventoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute allowedRoles={['admin', 'orders']}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/shipping"
            element={
              <ProtectedRoute allowedRoles={['admin', 'shipments']}>
                <ShippingPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
=======
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
>>>>>>> main
  );
}

export default App;
