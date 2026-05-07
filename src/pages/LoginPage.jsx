import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GlassPanel } from '../components/GlassPanel/GlassPanel';

const roles = [
  { value: 'admin', label: 'Administrador' },
  { value: 'warehouse', label: 'Gestor de Inventario' },
  { value: 'orders', label: 'Gestor de Pedidos' },
  { value: 'shipments', label: 'Gestor de Envíos' },
];

export const LoginPage = () => {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', password: '', role: 'admin' });
  const [error, setError] = useState('');

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.username || !form.password) {
      setError('Usuario y contraseña son obligatorios.');
      return;
    }

    await login({ username: form.username, role: form.role });
    navigate('/', { replace: true });
  };

  return (
    <div className="login-page">
      <GlassPanel className="login-panel">
        <div className="login-brand">
          <span className="logo-icon"></span>
          <div>
            <h2>SmartLogix</h2>
            <p>Panel inteligente de gestión logística.</p>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input name="username" value={form.username} onChange={handleChange} placeholder="ej. admin" />
          </label>

          <label>
            Contraseña
            <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="********" />
          </label>

          <label>
            Rol de acceso
            <select name="role" value={form.role} onChange={handleChange}>
              {roles.map((role) => (
                <option key={role.value} value={role.value}>
                  {role.label}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="form-error">{error}</p>}

          <button type="submit" className="primary-button">
            Iniciar sesión
          </button>
        </form>
      </GlassPanel>
    </div>
  );
};
