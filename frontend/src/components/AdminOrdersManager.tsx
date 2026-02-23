import React, { useState, useEffect, useContext } from 'react';
import { Order } from '@/types';
import orderService from '@/services/orderService';
import { ToastContext } from '@/App';
import '../styles/admin-orders.css';

const AdminOrdersManager: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const toast = useContext(ToastContext);

  useEffect(() => {
    loadAllOrders();
  }, []);

  const loadAllOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getAllOrders();
      setOrders(data);
      filterOrders(data, filterStatus);
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : 'Error al cargar pedidos',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const filterOrders = (ordersToFilter: Order[], status: string) => {
    if (status === 'all') {
      setFilteredOrders(ordersToFilter);
    } else {
      setFilteredOrders(ordersToFilter.filter(o => o.estado === status));
    }
  };

  const handleFilterChange = (status: string) => {
    setFilterStatus(status);
    filterOrders(orders, status);
  };

  // Obtener estados únicos desde los pedidos
  const getStatuses = () => {
    const statuses = Array.from(new Set(orders.map(o => o.estado)));
    return statuses;
  };

  return (
    <div className="admin-orders-manager">
      <div className="admin-header">
        <div>
          <h2>📊 Gestión de Pedidos</h2>
          <p className="admin-subtitle">Revisa y aprueba los pedidos de los usuarios</p>
        </div>
        <button onClick={loadAllOrders} className="btn-secondary" disabled={isLoading}>
          🔄 Actualizar
        </button>
      </div>

      {/* Filtros */}
      <div className="admin-filters">
        <div className="filter-group">
          <label>Estado del Pedido:</label>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${filterStatus === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              📋 Todos ({orders.length})
            </button>
            {getStatuses().map((status) => (
              <button
                key={status}
                className={`filter-btn ${filterStatus === status ? 'active' : ''}`}
                onClick={() => handleFilterChange(status)}
              >
                {status} ({orders.filter(o => o.estado === status).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Pedidos */}
      {isLoading ? (
        <div className="loading-message">Cargando pedidos...</div>
      ) : filteredOrders.length === 0 ? (
        <div className="empty-orders-message">
          <p className="empty-icon">📭</p>
          <p className="empty-text">No hay pedidos para mostrar en esta categoría</p>
        </div>
      ) : (
        <div className="admin-orders-grid">
          {filteredOrders.map((order) => (
            <div key={order.id} className="admin-order-card">
              <div className="card-header">
                <div className="card-title">
                  <h3>{order.numeroPedido}</h3>
                  <span className="order-user">
                    👤 {order.cliente}
                  </span>
                </div>
                <div className="card-status">
                  <span className="status-badge">
                    {order.estado}
                  </span>
                </div>
              </div>

              <div className="card-details">
                <div className="detail-row">
                  <span className="label">Descripción:</span>
                  <span className="value">{order.description}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total:</span>
                  <span className="value amount">S/ {order.total.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha:</span>
                  <span className="value">
                    {new Date(order.fecha).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              </div>

              <div className="card-items">
                <h4>📦 Artículos ({order.items.length})</h4>
                <div className="items-list">
                  {order.items.map((item) => (
                    <div key={item.id} className="item-summary">
                      <span className="item-product">{item.productName}</span>
                      <span className="item-qty">x{item.quantity}</span>
                      <span className="item-cost">S/ {item.totalPrice.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersManager;
