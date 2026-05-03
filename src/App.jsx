import React, { useState } from 'react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="app-container">
      {/* Sidebar Component (RF-F02: Modularización en proceso) */}
      <aside className="sidebar glass-panel">
        <div className="logo-container">
          <div className="logo-icon"></div>
          SmartLogix
        </div>
        <nav className="nav-links">
          {['Dashboard', 'Inventario', 'Pedidos', 'Envíos'].map((item) => (
            <div 
              key={item} 
              className={`nav-item ${activeTab === item.toLowerCase() ? 'active' : ''}`}
              onClick={() => setActiveTab(item.toLowerCase())}
            >
              {item}
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="main-content">
        <header className="header">
          <h1>Vista General</h1>
          <div className="user-profile glass-panel" style={{ padding: '8px 16px', borderRadius: '20px' }}>
            Admin User
          </div>
        </header>

        {/* Metrics Grid */}
        <div className="metrics-grid">
          <div className="metric-card glass-panel">
            <span className="metric-title">Pedidos Activos</span>
            <span className="metric-value">1,284</span>
            <span className="metric-trend trend-up">↑ 12% vs ayer</span>
          </div>
          <div className="metric-card glass-panel">
            <span className="metric-title">Envíos en Ruta</span>
            <span className="metric-value">842</span>
            <span className="metric-trend trend-up">↑ 5% vs ayer</span>
          </div>
          <div className="metric-card glass-panel">
            <span className="metric-title">Alertas de Stock</span>
            <span className="metric-value" style={{background: 'linear-gradient(to right, #ef4444, #f87171)', WebkitBackgroundClip: 'text'}}>24</span>
            <span className="metric-trend trend-down">Revisión requerida (Bodega Central)</span>
          </div>
        </div>

        {/* Placeholder para la integración futura con el BFF */}
        <div className="glass-panel" style={{ height: '400px', padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', gap: '1rem' }}>
          <h3>Gráfico Interactivo de Operaciones</h3>
          <p>La integración con <code>/api/v1/inventory</code> y <code>/api/v1/orders</code> vía el BFF Gateway está en desarrollo.</p>
        </div>
      </main>
    </div>
  );
}

export default App;
