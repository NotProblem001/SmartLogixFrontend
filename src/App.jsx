import React from 'react';
import { DashboardLayout } from './layouts/DashboardLayout';
import { DashboardMetrics } from './features/dashboard/DashboardMetrics';
import './index.css';

/**
 * App.jsx limpio y declarativo utilizando el patrón Container/Presenter
 * y Feature-Sliced Design.
 */
function App() {
  return (
    <DashboardLayout>
      <DashboardMetrics />
    </DashboardLayout>
  );
}

export default App;
