export var OrderStatus;
(function (OrderStatus) {
    OrderStatus[OrderStatus["Pending"] = 0] = "Pending";
    OrderStatus[OrderStatus["Confirmed"] = 1] = "Confirmed";
    OrderStatus[OrderStatus["Shipped"] = 2] = "Shipped";
    OrderStatus[OrderStatus["Delivered"] = 3] = "Delivered";
    OrderStatus[OrderStatus["Cancelled"] = 4] = "Cancelled";
})(OrderStatus || (OrderStatus = {}));
export const OrderStatusLabels = {
    [OrderStatus.Pending]: 'Pendiente',
    [OrderStatus.Confirmed]: 'Confirmado',
    [OrderStatus.Shipped]: 'Enviado',
    [OrderStatus.Delivered]: 'Entregado',
    [OrderStatus.Cancelled]: 'Cancelado',
};
