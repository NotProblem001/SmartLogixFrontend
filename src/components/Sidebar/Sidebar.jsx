import React from 'react';
import { NavLink } from 'react-router-dom';
import { GlassPanel } from '../GlassPanel/GlassPanel';

/**
 * Componente de Navegación con react-router-dom.
 */
export const Sidebar = ({ navItems }) => {
  return (
    <GlassPanel className="sidebar" style={{ borderRadius: '0' }}>
      <div className="logo-container">
        <div className="logo-icon"></div>
        SmartLogix
      </div>
      <nav className="nav-links">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.name}
          </NavLink>
        ))}
      </nav>
    </GlassPanel>
  );
};
