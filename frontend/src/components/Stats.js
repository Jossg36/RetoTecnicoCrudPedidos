import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import '../styles/stats.css';
const Stats = ({ orders }) => {
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
    return (_jsx("div", { className: "stats-container", children: stats.map((stat, index) => (_jsxs("div", { className: `stat-card stat-${stat.color}`, children: [_jsx("div", { className: "stat-icon", children: stat.icon }), _jsxs("div", { className: "stat-content", children: [_jsx("div", { className: "stat-label", children: stat.label }), _jsx("div", { className: "stat-value", children: stat.value })] })] }, index))) }));
};
export default Stats;
