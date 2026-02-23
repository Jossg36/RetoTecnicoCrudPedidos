-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de creación de tabla Orders
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 02. CREAR TABLA ORDERS
-- ============================================================================
-- Tabla de órdenes de compra
-- Almacena información de pedidos y su estado de cumplimiento
-- Estados: 0=Pending, 1=Confirmed, 2=Shipped, 3=Delivered, 4=Cancelled

IF OBJECT_ID('[dbo].[Orders]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Orders]
    (
        [Id] INT PRIMARY KEY IDENTITY(1, 1),
        [UserId] INT NOT NULL,
        [OrderNumber] NVARCHAR(50) NOT NULL,
        [Status] INT NOT NULL DEFAULT 0,                  -- Estado del pedido
        [Description] NVARCHAR(500),                      -- Descripción opcional
        [TotalAmount] DECIMAL(18, 2) NOT NULL DEFAULT 0.00,  -- Cantidad total
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL,
        
        -- Foreign Key a Users (cascada para eliminar órdenes huérfanas)
        CONSTRAINT [FK_Orders_Users_UserId] 
            FOREIGN KEY ([UserId]) 
            REFERENCES [dbo].[Users]([Id]) 
            ON DELETE CASCADE
    );

    -- Crear índices para optimizar búsquedas
    CREATE NONCLUSTERED INDEX [IX_Orders_UserId] 
        ON [dbo].[Orders]([UserId]);

    CREATE NONCLUSTERED INDEX [IX_Orders_Status] 
        ON [dbo].[Orders]([Status]);

    CREATE NONCLUSTERED INDEX [IX_Orders_CreatedAt] 
        ON [dbo].[Orders]([CreatedAt] DESC);

    -- Índice único para OrderNumber
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Orders_OrderNumber] 
        ON [dbo].[Orders]([OrderNumber]);

    PRINT ' Tabla Orders creada exitosamente';
END
ELSE
    PRINT ' Tabla Orders ya existe';
GO
