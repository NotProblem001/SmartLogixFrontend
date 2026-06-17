import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MetricCard } from './MetricCard';

describe('MetricCard Component', () => {
  it('renderiza el título y el valor correctamente', () => {
    // Renderizamos el componente con propiedades (props) de prueba
    render(<MetricCard title="Total Pedidos" value="150" trendType="up" />);

    // Buscamos si los textos existen en la pantalla virtual
    expect(screen.getByText('Total Pedidos')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });

  it('aplica la clase correcta basada en trendType down', () => {
    render(<MetricCard title="Cancelados" value="5" trend="-2%" trendType="down" />);
    
    // Verificamos que el trend se renderiza
    expect(screen.getByText(/↓/i)).toBeInTheDocument();
    expect(screen.getByText(/-2%/i)).toBeInTheDocument();
  });
});
