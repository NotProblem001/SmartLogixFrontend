import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { GlassPanel } from '../GlassPanel/GlassPanel';
import { useAuth } from '../../context/AuthContext';

const routeTitles = {
  '/': 'Dashboard Ejecutivo',
  '/inventory': 'Inventario',
  '/orders': 'Pedidos',
  '/shipping': 'Envíos',
};

export const Header = ({ title }) => {
  const location = useLocation();
  const pageTitle = title || routeTitles[location.pathname] || 'SmartLogix';
  const { user, logout } = useAuth();

  return (
    <header className="header">
      <div>
        <h1>{pageTitle}</h1>
        <p className="subtitle">Control y visibilidad de la operación logística</p>
      </div>
      <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="search-bar" style={{ display: 'flex', alignItems: 'center', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem 1rem', width: '300px' }}>
          <span style={{ marginRight: '8px' }}>🔍</span>
          <input type="text" placeholder="Buscar pedidos, SKUs..." style={{ background: 'transparent', border: 'none', color: 'var(--text-color)', outline: 'none', width: '100%' }} />
        </div>

        <button className="btn-icon" style={{ position: 'relative', background: 'none', border: 'none', fontSize: '1.25rem', cursor: 'pointer' }}>
          🔔
          <span style={{ position: 'absolute', top: '-5px', right: '-5px', background: 'var(--accent-danger)', color: 'white', fontSize: '0.7rem', fontWeight: 'bold', borderRadius: '50%', width: '18px', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>3</span>
        </button>

        <GlassPanel className="header-chip">
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: '24px', height: '24px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold' }}>{user?.name ? user.name.charAt(0).toUpperCase() : 'A'}</div>
            {user?.name || 'Admin'}
          </span>
        </GlassPanel>

        <GlassPanel className="header-chip secondary">
          <button className="ghost-button" onClick={logout}>
            Cerrar sesión
          </button>
        </GlassPanel>
      </div>
    </header>
  );
};
