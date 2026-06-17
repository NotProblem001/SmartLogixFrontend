import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import OrderDashboard from '../features/orders/OrderDashboard';

export const OrdersPage = () => {
  return (
    <DashboardLayout title="Pedidos">
      <OrderDashboard />
    </DashboardLayout>
  );
};
