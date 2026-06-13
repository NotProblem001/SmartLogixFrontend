import React from 'react';
import { NavLink } from 'react-router-dom';
import { GlassPanel } from '../GlassPanel/GlassPanel';

<<<<<<< HEAD
export const Sidebar = ({ navItems, collapsed, onToggle }) => {
=======
/**
 * Componente de Navegación con react-router-dom.
 */
export const Sidebar = ({ navItems }) => {
>>>>>>> main
  return (
    <GlassPanel className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <div className="sidebar-top">
        <div className="logo-container">
          <div className="logo-icon"></div>
          {!collapsed && <span>SmartLogix</span>}
        </div>
        <button className="collapse-button" onClick={onToggle}>
          {collapsed ? '>' : '<'}
        </button>
      </div>

      <nav className="nav-links">
<<<<<<< HEAD
        {navItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>{label}</span>
=======
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            {item.name}
>>>>>>> main
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="small-text">API Gateway ready</span>
      </div>
    </GlassPanel>
  );
};
