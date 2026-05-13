import React from 'react';
import './FloatingActionBar.css';

const FloatingActionBar = ({ selectedCount, onClearSelection, actions }) => {
  if (selectedCount === 0) return null;

  return (
    <div className="floating-action-bar">
      <div className="fab-content">
        <div className="fab-info">
          <span className="fab-count">{selectedCount}</span>
          <span className="fab-text">elementos seleccionados</span>
        </div>
        
        <div className="fab-actions">
          {actions.map((action, index) => (
            <button 
              key={index} 
              className={`fab-btn ${action.className || ''}`}
              onClick={action.onClick}
            >
              {action.icon && <span className="fab-icon">{action.icon}</span>}
              {action.label}
            </button>
          ))}
          
          <div className="fab-divider"></div>
          
          <button className="fab-btn fab-close" onClick={onClearSelection} aria-label="Limpiar selección">
            ✕
          </button>
        </div>
      </div>
    </div>
  );
};

export default FloatingActionBar;
