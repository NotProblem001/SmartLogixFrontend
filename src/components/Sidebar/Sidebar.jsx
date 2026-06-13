import React from 'react';
import { NavLink } from 'react-router-dom';
import { GlassPanel } from '../GlassPanel/GlassPanel';

export const Sidebar = ({ navItems, collapsed, onToggle }) => {
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
        {navItems.map(({ label, path }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <span className="small-text">API Gateway ready</span>
      </div>
    </GlassPanel>
  );
};
