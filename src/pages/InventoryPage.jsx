import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import InventoryDashboard from '../features/inventory/InventoryDashboard';

export const InventoryPage = () => {
  return (
    <DashboardLayout title="Inventario">
      <InventoryDashboard />
    </DashboardLayout>
  );
};
