import React from 'react';
import './Topbar.css';

const Topbar = ({ toggleSidebar }) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="hamburger-btn btn-icon" onClick={toggleSidebar}>
          ☰
        </button>
        <div className="search-bar">
          <span className="search-icon">🔍</span>
          <input type="text" placeholder="Buscar pedidos, SKUs..." />
        </div>
      </div>
      
      <div className="topbar-right">
        <button className="btn-icon notification-btn">
          🔔
          <span className="notification-badge">3</span>
        </button>
        <div className="user-profile">
          <div className="avatar">A</div>
          <span className="user-name">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
