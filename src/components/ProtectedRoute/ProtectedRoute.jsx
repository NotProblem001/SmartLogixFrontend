import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { GlassPanel } from '../GlassPanel/GlassPanel';

export const ProtectedRoute = ({ allowedRoles = [], children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length && !allowedRoles.includes(user.role)) {
    return (
      <div className="fallback-wrapper">
        <GlassPanel className="fallback-panel">
          <h2>Acceso denegado</h2>
          <p>No tienes permisos para ver este módulo.</p>
          <p>Contacta a un administrador para actualizar tu perfil.</p>
        </GlassPanel>
      </div>
    );
  }

  return children;
};
