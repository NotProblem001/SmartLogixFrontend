import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import '../index.css';

export const DashboardLayout = ({ title, children }) => {
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { label: 'Dashboard', path: '/' },
    { label: 'Inventario', path: '/inventory' },
    { label: 'Pedidos', path: '/orders' },
    { label: 'Envíos', path: '/shipping' },
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
