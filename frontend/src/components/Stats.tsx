import React from 'react';
import { Order } from '@/types';
import '../styles/stats.css';

interface StatsProps {
  orders: Order[];
}

const Stats: React.FC<StatsProps> = ({ orders }) => {
  const totalOrders = orders.length;
  const totalAmount = orders.reduce((sum, order) => sum + order.total, 0);
  const totalItems = orders.reduce((sum, order) => sum + order.items.length, 0);
  const pendingOrders = orders.filter((o) => o.estado === 'Registrado').length;

  const stats = [
    {
      label: 'Total de Pedidos',
      value: totalOrders,
      icon: '📦',
      color: 'blue',
    },
    {
      label: 'Monto Total',
      value: `S/ ${totalAmount.toFixed(2)}`,
      icon: '💰',
      color: 'green',
    },
    {
      label: 'Items',
      value: totalItems,
      icon: '📝',
      color: 'orange',
    },
    {
      label: 'Pendientes',
      value: pendingOrders,
      icon: '⏳',
      color: 'red',
    },
  ];

  return (
    <div className="stats-container">
      {stats.map((stat, index) => (
        <div key={index} className={`stat-card stat-${stat.color}`}>
          <div className="stat-icon">{stat.icon}</div>
          <div className="stat-content">
            <div className="stat-label">{stat.label}</div>
            <div className="stat-value">{stat.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Stats;
