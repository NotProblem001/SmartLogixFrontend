import React from 'react';
import { GlassPanel } from '../GlassPanel/GlassPanel';

/**
 * Componente de Encabezado.
 */
export const Header = ({ title, userName }) => {
  return (
    <header className="header">
      <h1>{title}</h1>
      <GlassPanel className="user-profile" style={{ padding: '8px 16px', borderRadius: '20px' }}>
        {userName}
      </GlassPanel>
    </header>
  );
};
