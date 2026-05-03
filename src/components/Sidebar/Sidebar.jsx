import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

/**
 * Componente de Navegación (Organismo).
 * Totalmente agnóstico: Recibe las rutas y la función de clickeado como props.
 */
export const Sidebar = ({ navItems, activeTab, onTabChange }) => {
  return (
    <GlassPanel className="sidebar" style={{ borderRadius: '0' }}>
      <div className="logo-container">
        <div className="logo-icon"></div>
        SmartLogix
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <div 
            key={item} 
            className={`nav-item ${activeTab === item.toLowerCase() ? 'active' : ''}`}
            onClick={() => onTabChange(item.toLowerCase())}
          >
            {item}
          </div>
        ))}
      </nav>
    </GlassPanel>
  );
};
