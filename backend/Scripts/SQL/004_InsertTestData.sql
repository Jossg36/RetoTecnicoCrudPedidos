-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de inserción de datos de prueba
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- NOTA: Ejecutar después de crear todas las tablas
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 04. INSERTAR DATOS DE PRUEBA
-- ============================================================================

SET IDENTITY_INSERT [dbo].[Users] ON;

-- Insertar usuarios de prueba
PRINT 'Inserting test users...';
INSERT INTO [dbo].[Users] 
    ([Id], [Username], [Email], [PasswordHash], [Role], [IsActive], [CreatedAt])
VALUES 
    (1, 'admin', 'admin@ordermanagement.com', 
     '$2a$12$/abcdefghijklmnopqrstuvwxyz123456789...',  -- BCrypt hash simulado
     1, 1, GETUTCDATE()),
     
    (2, 'johnsmith', 'john.smith@example.com',
     '$2a$12$/abcdefghijklmnopqrstuvwxyz123456789...',
     0, 1, DATEADD(DAY, -30, GETUTCDATE())),
     
    (3, 'mariagarcia', 'maria.garcia@example.com',
     '$2a$12$/abcdefghijklmnopqrstuvwxyz123456789...',
     0, 1, DATEADD(DAY, -60, GETUTCDATE())),
     
    (4, 'davidlopez', 'david.lopez@example.com',
     '$2a$12$/abcdefghijklmnopqrstuvwxyz123456789...',
     0, 1, DATEADD(DAY, -15, GETUTCDATE())),
     
    (5, 'annamartinez', 'anna.martinez@example.com',
     '$2a$12$/abcdefghijklmnopqrstuvwxyz123456789...',
     0, 1, DATEADD(DAY, -45, GETUTCDATE()));

SET IDENTITY_INSERT [dbo].[Users] OFF;
PRINT '[OK] Usuarios insertados: 5 registros';

-- Insertar órdenes de prueba
SET IDENTITY_INSERT [dbo].[Orders] ON;

PRINT '';
PRINT 'Inserting test orders...';
INSERT INTO [dbo].[Orders] 
    ([Id], [UserId], [OrderNumber], [Status], [Description], [TotalAmount], [CreatedAt])
VALUES 
    (1, 2, 'ORD-20260222001-A1B2C3D4', 0, 'Laptop y accesorios de oficina', 1500.00, DATEADD(DAY, -25, GETUTCDATE())),
    (2, 2, 'ORD-20260222002-B4C5D6E7', 1, 'Equipamiento de laboratorio', 3500.50, DATEADD(DAY, -15, GETUTCDATE())),
    (3, 2, 'ORD-20260222003-C7D8E9F0', 0, 'Software de desarrollo y licencias', 2200.00, DATEADD(DAY, -3, GETUTCDATE())),
    (4, 3, 'ORD-20260222004-D9E0F1A2', 3, 'Monitor, teclado y mouse', 450.00, DATEADD(DAY, -50, GETUTCDATE())),
    (5, 3, 'ORD-20260222005-E0F1A2B3', 2, 'Cables y adaptadores USB-C', 150.00, DATEADD(DAY, -8, GETUTCDATE())),
    (6, 4, 'ORD-20260222006-F1A2B3C4', 0, 'Servidor de backup y almacenamiento', 5000.00, DATEADD(DAY, -1, GETUTCDATE())),
    (7, 5, 'ORD-20260222007-A2B3C4D5', 3, 'Programa de contabilidad y bases de datos', 800.00, DATEADD(DAY, -40, GETUTCDATE())),
    (8, 5, 'ORD-20260222008-B3C4D5E6', 1, 'Impresoras multifuncionales', 1200.00, DATEADD(DAY, -20, GETUTCDATE()));

SET IDENTITY_INSERT [dbo].[Orders] OFF;
PRINT '[OK] Órdenes insertadas: 8 registros';

-- Insertar items de órdenes
SET IDENTITY_INSERT [dbo].[OrderItems] ON;

PRINT '';
PRINT 'Inserting test order items...';
INSERT INTO [dbo].[OrderItems] 
    ([Id], [OrderId], [ProductName], [Quantity], [UnitPrice], [TotalPrice])
VALUES 
    -- Orden 1: Laptop y accesorios
    (1, 1, 'Laptop Dell XPS 13', 1, 1200.00, 1200.00),
    (2, 1, 'Mouse inalámbrico Logitech', 2, 30.00, 60.00),
    (3, 1, 'Teclado mecánico', 1, 120.00, 120.00),
    
    -- Orden 2: Equipamiento de laboratorio
    (4, 2, 'Microscopio digital USB', 1, 2500.00, 2500.00),
    (5, 2, 'Set de herramientas de precisión', 3, 300.00, 900.00),
    (6, 2, 'Calibrador digital', 1, 100.50, 100.50),
    
    -- Orden 3: Software y licencias
    (7, 3, 'Visual Studio Professional - 1 año', 1, 800.00, 800.00),
    (8, 3, 'JetBrains IntelliJ IDEA - Licencia anual', 1, 700.00, 700.00),
    (9, 3, 'GitHub Copilot Pro - 3 usuarios', 3, 20.00, 60.00),
    (10, 3, 'SQL Server Standard - 1 servidor', 1, 640.00, 640.00),
    
    -- Orden 4: Monitor, teclado y mouse
    (11, 4, 'Monitor LG 27 pulgadas 4K', 1, 350.00, 350.00),
    (12, 4, 'Teclado Cherry MX', 1, 60.00, 60.00),
    (13, 4, 'Mouse gaming Razer', 1, 40.00, 40.00),
    
    -- Orden 5: Cables y adaptadores
    (14, 5, 'Cable USB-C a USB-C 2 metros', 5, 15.00, 75.00),
    (15, 5, 'Adaptador USB-C a HDMI', 3, 25.00, 75.00),
    
    -- Orden 6: Servidor de backup
    (16, 6, 'Servidor NAS Synology 8 bahías', 1, 3000.00, 3000.00),
    (17, 6, 'Discos duros SSD SATA 2 TB', 4, 500.00, 2000.00),
    
    -- Orden 7: Contabilidad y bases de datos
    (18, 7, 'Software contable empresarial', 1, 500.00, 500.00),
    (19, 7, 'Licencia Oracle Database 2 años', 1, 300.00, 300.00),
    
    -- Orden 8: Impresoras multifuncionales
    (20, 8, 'Impresora HP LaserJet Pro M454dw', 2, 600.00, 1200.00);

SET IDENTITY_INSERT [dbo].[OrderItems] OFF;
PRINT '[OK] Items de órdenes insertados: 20 registros';

PRINT '';
PRINT '========================================';
PRINT 'Datos de prueba insertados exitosamente';
PRINT '========================================';
PRINT 'Total: 5 usuarios + 8 órdenes + 20 items';
PRINT '';
GO
