import React from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import '../index.css';

/**
 * Layout principal orquestador.
 */
export const DashboardLayout = ({ children }) => {
  const navItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Inventario', path: '/inventory' },
    { name: 'Pedidos', path: '/orders' },
    { name: 'Envíos', path: '/shipping' }
  ];

  return (
    <div className="app-container">
      <Sidebar navItems={navItems} />
      
      <main className="main-content">
        <Header title="Panel de Control" userName="Admin User" />
        {children}
      </main>
    </div>
  );
};
