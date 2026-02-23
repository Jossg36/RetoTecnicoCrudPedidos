import React, { useState, useEffect, useContext } from 'react';
import { Order, CreateOrderRequest, CreateOrderItemRequest } from '@/types';
import orderService from '@/services/orderService';
import Modal from '@/components/Modal';
import EmptyState from '@/components/EmptyState';
import Stats from '@/components/Stats';
import AdminOrdersManager from '@/components/AdminOrdersManager';
import { SkeletonCard } from '@/components/Skeleton';
import { ToastContext } from '@/App';
import { useAuth } from '@/contexts/AuthContext';
import '../styles/dashboard.css';

const Dashboard: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [formData, setFormData] = useState<CreateOrderRequest>({
    description: '',
    items: [{ productName: '', quantity: 1, unitPrice: 0.01 }],
  });
  const toast = useContext(ToastContext);
  const { user } = useAuth();

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const data = await orderService.getMyOrders();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : 'Error al cargar pedidos',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0.01 }],
    }));
  };

  const handleRemoveItem = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleItemChange = (index: number, field: keyof CreateOrderItemRequest, value: any) => {
    setFormData((prev) => {
      const newItems = [...prev.items];
      
      if (field === 'quantity' || field === 'unitPrice') {
        // Para campos numéricos, convertir pero asegurar que sean válidos
        const numValue = parseFloat(value);
        newItems[index] = {
          ...newItems[index],
          [field]: isNaN(numValue) ? (field === 'quantity' ? 1 : 0.01) : numValue,
        };
      } else {
        // Para campos de texto
        newItems[index] = {
          ...newItems[index],
          [field]: value,
        };
      }
      
      return { ...prev, items: newItems };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description.trim()) {
      toast?.addToast('La descripción es requerida', 'warning');
      return;
    }

    // Filtrar items incompletos (sin productName)
    const completeItems = formData.items.filter(item => item.productName.trim());

    if (completeItems.length === 0) {
      toast?.addToast('Debe agregar al menos un artículo completo', 'warning');
      return;
    }

    // Validar items completos
    for (const item of completeItems) {
      if (item.quantity <= 0 || item.unitPrice <= 0) {
        toast?.addToast('Cantidad y precio deben ser mayores a 0', 'warning');
        return;
      }
    }

    setIsSaving(true);
    try {
      const dataToSend = {
        description: formData.description,
        items: editingOrder 
          ? formData.items  // En edición, mantener estructura original
          : completeItems   // En creación, solo enviar items completos
      };

      if (editingOrder) {
        await orderService.updateOrder(editingOrder.id, {
          description: dataToSend.description,
          items: dataToSend.items,
        });
        toast?.addToast('Pedido actualizado exitosamente', 'success');
      } else {
        await orderService.createOrder(dataToSend);
        toast?.addToast('Pedido creado exitosamente', 'success');
      }
      await loadOrders();
      setShowForm(false);
      setEditingOrder(null);
      setFormData({
        description: '',
        items: [{ productName: '', quantity: 1, unitPrice: 0.01 }],
      });
    } catch (err) {
      toast?.addToast(
        err instanceof Error ? err.message : 'Error al guardar pedido',
        'error'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('¿Está seguro de que desea eliminar este pedido?')) {
      try {
        await orderService.deleteOrder(id);
        toast?.addToast('Pedido eliminado exitosamente', 'success');
        await loadOrders();
      } catch (err) {
        toast?.addToast(
          err instanceof Error ? err.message : 'Error al eliminar pedido',
          'error'
        );
      }
    }
  };

  const handleEdit = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      description: order.description || '',
      items: order.items
        ? order.items.map((item: any) => ({
            productName: item.productName || '',
            quantity: item.quantity || 1,
            unitPrice: item.unitPrice || 0.01,
          }))
        : [{ productName: '', quantity: 1, unitPrice: 0.01 }],
    });
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingOrder(null);
    setFormData({
      description: '',
      items: [{ productName: '', quantity: 1, unitPrice: 0.01 }],
    });
    setIsSaving(false);
  };

  return (
    <div className="dashboard">
      {/* Tabs para Admin */}
      {user?.role === 'Admin' && (
        <div className="dashboard-tabs">
          <button
            className={`tab-btn ${activeTab === 'user' ? 'active' : ''}`}
            onClick={() => setActiveTab('user')}
          >
            📦 Mis Pedidos
          </button>
          <button
            className={`tab-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
          >
            👨‍💼 Gestión de Pedidos
          </button>
        </div>
      )}

      {/* Vista de Usuario */}
      {activeTab === 'user' && (
        <>
          <div className="dashboard-header">
            <div>
              <h2>Mis Pedidos</h2>
              <p className="dashboard-subtitle">Gestiona tus órdenes de compra</p>
            </div>
            <button onClick={() => setShowForm(true)} className="btn-primary btn-lg">
              ✨ Nuevo Pedido
            </button>
          </div>

      {isLoading && orders.length === 0 ? (
        <div className="loading-grid">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : (
        <>
          {orders.length > 0 && <Stats orders={orders} />}

          {orders.length === 0 ? (
            <EmptyState
              icon="📦"
              title="Sin pedidos aún"
              description="Comienza creando tu primer pedido para gestionar tus órdenes de compra"
              action={{
                label: '✨ Crear Primer Pedido',
                onClick: () => setShowForm(true),
              }}
            />
          ) : (
            <div className="orders-grid">
              {orders.map((order) => (
                <div key={order.id} className="order-card">
                  <div className="order-header">
                    <div className="order-header-info">
                      <h3>{order.numeroPedido}</h3>
                    </div>
                    <span className="status-badge">
                      {order.estado}
                    </span>
                  </div>

                  <div className="order-body">
                    <div className="order-main-info">
                      <div className="info-group">
                        <span className="info-label">Fecha</span>
                        <p className="info-value">
                          {new Date(order.fecha || new Date()).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                          })}
                        </p>
                      </div>
                      <div className="info-group">
                        <span className="info-label">Total</span>
                        <p className="info-value amount">S/ {(() => {
                          try {
                            const val = Number(order.total ?? 0);
                            return isNaN(val) || val < 0 ? '0.00' : val.toFixed(2);
                          } catch (e) {
                            return '0.00';
                          }
                        })()}</p>
                      </div>
                    </div>
                    
                    <div className="order-description">
                      <p>{order.description}</p>
                    </div>
                  </div>

                  <div className="order-items">
                    <h4>📦 Artículos ({(order.items && order.items.length) || 0})</h4>
                    <div className="items-list">
                      {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                        order.items.map((item: any, idx: number) => {
                          try {
                            // Obtener nombre del producto desde múltiples propiedades posibles
                            const productName = 
                              item?.productName || 
                              item?.name || 
                              item?.descripcion ||
                              item?.description ||
                              'Sin nombre';
                            
                            // Calcular el precio total del item (quantity * unitPrice)
                            const qty = Number(item?.quantity ?? 0) || 0;
                            const unitPrice = Number(item?.unitPrice ?? 0) || 0;
                            const totalPrice = Number(item?.totalPrice ?? (qty * unitPrice));
                            const finalPrice = isNaN(totalPrice) || totalPrice < 0 ? 0 : totalPrice;
                            
                            return (
                              <div key={item?.id ?? `item-${idx}`} className="item-summary">
                                <span className="item-product">{productName}</span>
                                <span className="item-qty">x{qty}</span>
                                <span className="item-cost">S/ {finalPrice.toFixed(2)}</span>
                              </div>
                            );
                          } catch (e) {
                            console.error('Error rendering item:', e, item);
                            // Fallback seguro
                            const productName = 
                              item?.productName || 
                              item?.name || 
                              item?.descripcion ||
                              item?.description ||
                              'Sin nombre';
                            return (
                              <div key={item?.id ?? `item-${idx}`} className="item-summary">
                                <span className="item-product">{productName}</span>
                                <span className="item-qty">x{item?.quantity || 0}</span>
                                <span className="item-cost">S/ 0.00</span>
                              </div>
                            );
                          }
                        })
                      ) : (
                        <div style={{ opacity: 0.5, padding: '8px' }}>
                          <span>Sin artículos</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="order-actions">
                    <button
                      onClick={() => handleEdit(order)}
                      className="btn-small btn-secondary"
                      title="Editar pedido"
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => handleDelete(order.id)}
                      className="btn-small btn-danger"
                      title="Eliminar pedido"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
        </>
      )}

      {/* Vista de Admin */}
      {activeTab === 'admin' && user?.role === 'Admin' && (
        <AdminOrdersManager />
      )}

      <Modal
        isOpen={showForm}
        title={editingOrder ? '✏️ Editar Pedido' : '✨ Crear Nuevo Pedido'}
        onClose={handleCancel}
        size="large"
      >
        <form onSubmit={handleSubmit} className="order-form">
          {/* Sección 1: Información del Pedido */}
          <div className="form-section">
            <h3 className="section-title">📋 Información del Pedido</h3>
            <div className="form-group">
              <label htmlFor="description">Descripción / Detalles del Pedido</label>
              <p className="field-hint">Describe qué incluye este pedido (máx. 500 caracteres)</p>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Ej: Compra de equipos para oficina, renovación de inventario, etc."
                rows={4}
                maxLength={500}
                className="description-textarea"
              />
              <span className="char-count">{formData.description.length}/500</span>
            </div>
          </div>

          {/* Sección 2: Artículos del Pedido */}
          <div className="form-section">
            <div className="section-header">
              <h3 className="section-title">📦 Artículos del Pedido</h3>
              <span className="items-badge">{formData.items.filter(i => i.productName.trim()).length} artículo(s)</span>
            </div>

            <div className="items-container">
              {formData.items.map((item, index) => (
                <div key={`item-${index}`} className="item-card">
                  <div className="item-number">#{index + 1}</div>
                  
                  <div className="item-form-grid">
                    <div className="input-group">
                      <label className="input-label">Nombre del Producto *</label>
                      <input
                        type="text"
                        placeholder=""
                        value={item.productName}
                        onChange={(e) => handleItemChange(index, 'productName', e.target.value)}
                        className={`product-input ${!item.productName.trim() && item !== formData.items[0] ? 'empty' : ''}`}
                        autoComplete="off"
                      />
                      {!item.productName.trim() && (
                        <small className="error-text">Campo requerido</small>
                      )}
                    </div>

                    <div className="input-group">
                      <label className="input-label">Cantidad *</label>
                      <input
                        type="number"
                        placeholder="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                        min="1"
                        max="9999"
                        className="qty-input"
                      />
                    </div>

                    <div className="input-group">
                      <label className="input-label">Precio Unitario *</label>
                      <div className="price-input-wrapper">
                        <span className="currency-symbol">S/</span>
                        <input
                          type="number"
                          placeholder="0.00"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                          min="0.01"
                          step="0.01"
                          className="price-input"
                        />
                      </div>
                    </div>

                    <div className="input-group total-group">
                      <label className="input-label">Subtotal</label>
                      <div className="subtotal-display">
                        S/ {(() => {
                          try {
                            const qty = Number(item.quantity ?? 0) || 0;
                            const price = Number(item.unitPrice ?? 0) || 0;
                            const subtotal = qty * price;
                            return isNaN(subtotal) || subtotal < 0 ? '0.00' : subtotal.toFixed(2);
                          } catch (e) {
                            return '0.00';
                          }
                        })()}
                      </div>
                    </div>
                  </div>

                  {formData.items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      className="btn-remove-item"
                      disabled={isSaving}
                      title="Eliminar este artículo"
                    >
                      🗑️ Eliminar
                    </button>
                  )}
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={handleAddItem}
              className="btn-add-item"
              style={{ marginTop: '16px' }}
            >
              ➕ Agregar Otro Artículo
            </button>
          </div>

          {/* Sección 3: Resumen */}
          <div className="form-section summary-section">
            <h3 className="section-title">💰 Resumen del Pedido</h3>
            <div className="summary-grid">
              <div className="summary-item">
                <span className="summary-label">Artículos:</span>
                <span className="summary-value">{formData.items.filter(i => (i.productName || '').trim()).length}</span>
              </div>
              <div className="summary-item">
                <span className="summary-label">Total:</span>
                <span className="summary-total">
                  S/ {(() => {
                    try {
                      const total = Number(formData.items.reduce((sum, item) => {
                        const qty = Number(item.quantity ?? 0) || 0;
                        const price = Number(item.unitPrice ?? 0) || 0;
                        return sum + (qty * price);
                      }, 0));
                      return isNaN(total) || total < 0 ? '0.00' : total.toFixed(2);
                    } catch (e) {
                      return '0.00';
                    }
                  })()}
                </span>
              </div>
            </div>
          </div>

          {/* Sección 4: Acciones */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-primary btn-lg" 
              disabled={isSaving || !formData.description.trim() || formData.items.filter(i => i.productName.trim()).length === 0}
            >
              {isSaving ? '⏳ Guardando Pedido...' : '💾 Guardar Pedido'}
            </button>
            <button 
              type="button" 
              onClick={handleCancel} 
              className="btn-secondary btn-lg" 
              disabled={isSaving}
            >
              ✕ Cancelar
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
