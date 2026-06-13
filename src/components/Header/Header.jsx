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
      <div className="header-actions">
        <GlassPanel className="header-chip">
          <span>{user?.name || 'Invitado'}</span>
        </GlassPanel>

        <GlassPanel className="header-chip secondary">
          <Link to="/shipping">Seguimiento</Link>
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
