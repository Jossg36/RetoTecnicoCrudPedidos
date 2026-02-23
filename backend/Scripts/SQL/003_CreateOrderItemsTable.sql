-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de creación de tabla OrderItems
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 03. CREAR TABLA ORDER ITEMS
-- ============================================================================
-- Tabla de detalles de órdenes (items)
-- Almacena los productos individuales dentro de cada orden

IF OBJECT_ID('[dbo].[OrderItems]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[OrderItems]
    (
        [Id] INT PRIMARY KEY IDENTITY(1, 1),
        [OrderId] INT NOT NULL,
        [ProductName] NVARCHAR(200) NOT NULL,
        [Quantity] INT NOT NULL,
        [UnitPrice] DECIMAL(18, 2) NOT NULL,
        [TotalPrice] DECIMAL(18, 2) NOT NULL,
        
        -- Foreign Key a Orders (cascada para eliminar items huérfanos)
        CONSTRAINT [FK_OrderItems_Orders_OrderId] 
            FOREIGN KEY ([OrderId]) 
            REFERENCES [dbo].[Orders]([Id]) 
            ON DELETE CASCADE
    );

    -- Crear índices para optimizar búsquedas
    CREATE NONCLUSTERED INDEX [IX_OrderItems_OrderId] 
        ON [dbo].[OrderItems]([OrderId]);

    PRINT ' Tabla OrderItems creada exitosamente';
END
ELSE
    PRINT ' Tabla OrderItems ya existe';
GO
