import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar/Sidebar';
import { Header } from '../components/Header/Header';
import '../index.css';

/**
 * Layout principal orquestador.
 * Utiliza los componentes visuales puros (Sidebar, Header).
 */
export const DashboardLayout = ({ children }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const navItems = ['Dashboard', 'Inventario', 'Pedidos', 'Envíos'];

  return (
    <div className="app-container">
      <Sidebar 
        navItems={navItems} 
        activeTab={activeTab} 
        onTabChange={setActiveTab} 
      />
      
      <main className="main-content">
        <Header title="Vista General" userName="Admin User" />
        {children}
      </main>
    </div>
  );
};
