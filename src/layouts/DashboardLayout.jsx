import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import '../index.css';

export const DashboardLayout = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/', icon: '📊' },
    { label: 'Inventario', path: '/inventory', icon: '📦' },
    { label: 'Pedidos', path: '/orders', icon: '🛒' },
    { label: 'Envíos', path: '/shipping', icon: '🚚' },
    { label: 'Reportes', path: '/reports', icon: '📈' },
  ];

  return (
    <div className={`app-container ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        navItems={navItems}
        collapsed={collapsed}
        onToggle={() => setCollapsed((prev) => !prev)}
      />

      <div className="content-wrapper">
        <Header title={title} />
        <main className="main-content">{children}</main>
      </div>
    </div>
  );
};
