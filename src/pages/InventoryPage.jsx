import React from 'react';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';
import { useApi } from '../hooks/useApi';
import { apiGateway } from '../services/apiGateway';

export const InventoryPage = () => {
  const { data, loading, error, retry } = useApi(() => apiGateway.call('/inventory/sync'), []);

  return (
    <DashboardLayout title="Inventario">
      <GlassPanel className="section-panel">
        <div className="section-header">
          <div>
            <h2>Sincronización de stock</h2>
            <p>Visión por bodega y tienda con el data flow desde el API Gateway.</p>
          </div>
          <span className="status-pill neutral">Actualizado en tiempo real</span>
        </div>

        {loading && <div className="status-message">Cargando datos de inventario...</div>}
        {error && (
          <div className="status-message error">
            <p>{error}</p>
            <button className="secondary-button" onClick={retry}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Bodega / Tienda</th>
                  <th>SKU</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {data?.map((row) => (
                  <tr key={`${row.warehouse}-${row.sku}`}>
                    <td>{row.warehouse}</td>
                    <td>{row.sku}</td>
                    <td>{row.stock}</td>
                    <td>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </GlassPanel>
    </DashboardLayout>
  );
};
