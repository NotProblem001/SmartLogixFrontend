import React from 'react';

/**
 * Componente Genérico (Átomo).
 * Encapsula la lógica visual del "Glassmorphism" para que pueda ser
 * reutilizado en todo el proyecto sin duplicar clases CSS.
 */
export const GlassPanel = ({ children, className = '', style = {} }) => {
  return (
    <div className={`glass-panel ${className}`} style={style}>
      {children}
    </div>
  );
};
