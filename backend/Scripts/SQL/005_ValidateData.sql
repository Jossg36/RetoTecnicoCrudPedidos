-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de validación de integridad de datos
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- NOTA: Ejecutar para validar consistencia e integridad de datos
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 05. VALIDACIÓN DE INTEGRIDAD DE DATOS
-- ============================================================================

PRINT '========================================';
PRINT '[INICIANDO] Validación de datos...';
PRINT '========================================';
PRINT '';

-- ============================================================================
-- 1. Validar tabla Users
-- ============================================================================
PRINT '1️ Validando tabla Users...';

DECLARE @UserCount INT = (SELECT COUNT(*) FROM [dbo].[Users]);
PRINT '   Total de usuarios: ' + CAST(@UserCount AS NVARCHAR(10));

DECLARE @ActiveUsers INT = (SELECT COUNT(*) FROM [dbo].[Users] WHERE [IsActive] = 1);
PRINT '    Usuarios activos: ' + CAST(@ActiveUsers AS NVARCHAR(10));

DECLARE @InactiveUsers INT = (SELECT COUNT(*) FROM [dbo].[Users] WHERE [IsActive] = 0);
PRINT '    Usuarios inactivos: ' + CAST(@InactiveUsers AS NVARCHAR(10));

DECLARE @AdminUsers INT = (SELECT COUNT(*) FROM [dbo].[Users] WHERE [Role] = 1);
PRINT '    Administradores: ' + CAST(@AdminUsers AS NVARCHAR(10));

DECLARE @RegularUsers INT = (SELECT COUNT(*) FROM [dbo].[Users] WHERE [Role] = 0);
PRINT '   [USUARIO] Usuarios regulares: ' + CAST(@RegularUsers AS NVARCHAR(10));

-- Validar duplicados de Username
DECLARE @DuplicateUsernames INT = (
    SELECT COUNT(*) FROM [dbo].[Users] 
    GROUP BY [Username] HAVING COUNT(*) > 1
);
IF @DuplicateUsernames = 0
    PRINT '   [OK] Validación de nombres únicos: APROBADO (sin duplicados)';
ELSE
    PRINT '   [ERROR] Validación de nombres únicos: FALLIDO (encontrados duplicados)';

-- Validar duplicados de Email
DECLARE @DuplicateEmails INT = (
    SELECT COUNT(*) FROM [dbo].[Users] 
    GROUP BY [Email] HAVING COUNT(*) > 1
);
IF @DuplicateEmails = 0
    PRINT '   [OK] Validación de emails únicos: APROBADO (sin duplicados)';
ELSE
    PRINT '   [ERROR] Validación de emails únicos: FALLIDO (encontrados duplicados)';

PRINT '';

-- ============================================================================
-- 2. Validar tabla Orders
-- ============================================================================
PRINT '[2] Validando tabla Orders...';

DECLARE @OrderCount INT = (SELECT COUNT(*) FROM [dbo].[Orders]);
PRINT '   [TOTAL] Total de órdenes: ' + CAST(@OrderCount AS NVARCHAR(10));

-- Contar por estado
DECLARE @PendingOrders INT = (SELECT COUNT(*) FROM [dbo].[Orders] WHERE [Status] = 0);
DECLARE @ConfirmedOrders INT = (SELECT COUNT(*) FROM [dbo].[Orders] WHERE [Status] = 1);
DECLARE @ShippedOrders INT = (SELECT COUNT(*) FROM [dbo].[Orders] WHERE [Status] = 2);
DECLARE @DeliveredOrders INT = (SELECT COUNT(*) FROM [dbo].[Orders] WHERE [Status] = 3);
DECLARE @CancelledOrders INT = (SELECT COUNT(*) FROM [dbo].[Orders] WHERE [Status] = 4);

PRINT '   Órdenes por estado:';
PRINT '      [PENDIENTE] Pendientes: ' + CAST(@PendingOrders AS NVARCHAR(10));
PRINT '      [CONFIRMADA] Confirmadas: ' + CAST(@ConfirmedOrders AS NVARCHAR(10));
PRINT '      [ENVIADA] Enviadas: ' + CAST(@ShippedOrders AS NVARCHAR(10));
PRINT '      [OK] Entregadas: ' + CAST(@DeliveredOrders AS NVARCHAR(10));
PRINT '      [CANCELADA] Canceladas: ' + CAST(@CancelledOrders AS NVARCHAR(10));

-- Validar OrderNumbers únicos
DECLARE @DuplicateOrderNumbers INT = (
    SELECT COUNT(*) FROM [dbo].[Orders] 
    GROUP BY [OrderNumber] HAVING COUNT(*) > 1
);
IF @DuplicateOrderNumbers = 0
    PRINT '   [OK] Validación de números de orden únicos: APROBADO';
ELSE
    PRINT '   [ERROR] Validación de números de orden únicos: FALLIDO';

-- Validar referencias a usuarios existentes
DECLARE @OrphanOrders INT = (
    SELECT COUNT(*) FROM [dbo].[Orders] o
    WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Users] u WHERE u.Id = o.UserId)
);
IF @OrphanOrders = 0
    PRINT '   [OK] Validación de integridad referencial (Orders->Users): APROBADO (sin huérfanos)';
ELSE
    PRINT '   [ERROR] Validación de integridad referencial (Orders->Users): FALLIDO (' + CAST(@OrphanOrders AS NVARCHAR(10)) + ' huérfanos)';

PRINT '';

-- ============================================================================
-- 3. Validar tabla OrderItems
-- ============================================================================
PRINT '[3] Validando tabla OrderItems...';

DECLARE @ItemCount INT = (SELECT COUNT(*) FROM [dbo].[OrderItems]);
PRINT '   [TOTAL] Total de items: ' + CAST(@ItemCount AS NVARCHAR(10));

-- Promedio de items por orden
DECLARE @AvgItemsPerOrder DECIMAL(10, 2) = (
    SELECT AVG(ItemCount) FROM (
        SELECT COUNT(*) AS ItemCount FROM [dbo].[OrderItems]
        GROUP BY [OrderId]
    ) AS ItemsPerOrder
);
PRINT '   [PROMEDIO] Promedio de items por orden: ' + CAST(@AvgItemsPerOrder AS NVARCHAR(10));

-- Validar referencias a órdenes existentes
DECLARE @OrphanItems INT = (
    SELECT COUNT(*) FROM [dbo].[OrderItems] oi
    WHERE NOT EXISTS (SELECT 1 FROM [dbo].[Orders] o WHERE o.Id = oi.OrderId)
);
IF @OrphanItems = 0
    PRINT '   [OK] Validación de integridad referencial (OrderItems->Orders): APROBADO (sin huérfanos)';
ELSE
    PRINT '   [ERROR] Validación de integridad referencial (OrderItems->Orders): FALLIDO (' + CAST(@OrphanItems AS NVARCHAR(10)) + ' huérfanos)';

-- Validar que TotalPrice = Quantity * UnitPrice
DECLARE @PriceMismatch INT = (
    SELECT COUNT(*) FROM [dbo].[OrderItems]
    WHERE ABS([TotalPrice] - ([Quantity] * [UnitPrice])) > 0.01
);
IF @PriceMismatch = 0
    PRINT '   [OK] Validación de cálculo de precios: APROBADO (totales correctos)';
ELSE
    PRINT '   [ERROR] Validación de cálculo de precios: FALLIDO (' + CAST(@PriceMismatch AS NVARCHAR(10)) + ' discrepancias)';

PRINT '';

-- ============================================================================
-- 4. Validar totales de órdenes
-- ============================================================================
PRINT '[4] Validando cálculos de totales de órdenes...';

-- Comparar TotalAmount de Orders con suma de OrderItems
DECLARE @OrderTotalMismatch INT = (
    SELECT COUNT(*) FROM (
        SELECT o.Id, o.TotalAmount,
               ISNULL(SUM(oi.TotalPrice), 0) AS CalculatedTotal
        FROM [dbo].[Orders] o
        LEFT JOIN [dbo].[OrderItems] oi ON o.Id = oi.OrderId
        GROUP BY o.Id, o.TotalAmount
        HAVING ABS(o.TotalAmount - ISNULL(SUM(oi.TotalPrice), 0)) > 0.01
    ) AS Mismatches
);
IF @OrderTotalMismatch = 0
    PRINT '   [OK] Validación de totales de órdenes: APROBADO (cálculos correctos)';
ELSE
    PRINT '   [ERROR] Validación de totales de órdenes: FALLIDO (' + CAST(@OrderTotalMismatch AS NVARCHAR(10)) + ' discrepancias)';

-- Mostrar orden con monto total incorrecto (si existe)
IF @OrderTotalMismatch > 0
BEGIN
    PRINT '';
    PRINT '   Órdenes con discrepancias:';
    SELECT '   [ERROR] Orden #' + CAST(o.Id AS NVARCHAR(10)) +
           ' - Registrado: $' + CAST(o.TotalAmount AS NVARCHAR(15)) +
           ', Calculado: $' + CAST(ISNULL(SUM(oi.TotalPrice), 0) AS NVARCHAR(15))
    FROM [dbo].[Orders] o
    LEFT JOIN [dbo].[OrderItems] oi ON o.Id = oi.OrderId
    GROUP BY o.Id, o.TotalAmount
    HAVING ABS(o.TotalAmount - ISNULL(SUM(oi.TotalPrice), 0)) > 0.01;
END

PRINT '';

-- ============================================================================
-- 5. Resumen general
-- ============================================================================
PRINT '[5] Resumen general de la base de datos...';
PRINT '';

DECLARE @TotalInvestment DECIMAL(18, 2) = (SELECT SUM([TotalAmount]) FROM [dbo].[Orders]);
PRINT '   [DINERO] Inversión total en órdenes: $' + CAST(@TotalInvestment AS NVARCHAR(20));

DECLARE @HighestOrder DECIMAL(18, 2) = (SELECT MAX([TotalAmount]) FROM [dbo].[Orders]);
PRINT '   [MAX] Orden más grande: $' + CAST(@HighestOrder AS NVARCHAR(15));

DECLARE @LowestOrder DECIMAL(18, 2) = (SELECT MIN([TotalAmount]) FROM [dbo].[Orders]);
PRINT '   [MIN] Orden más pequeña: $' + CAST(@LowestOrder AS NVARCHAR(15));

DECLARE @AverageOrder DECIMAL(18, 2) = (SELECT AVG([TotalAmount]) FROM [dbo].[Orders]);
PRINT '   [PROMEDIO] Orden promedio: $' + CAST(@AverageOrder AS NVARCHAR(15));

PRINT '';
PRINT '========================================';
PRINT '[OK] Validación completada exitosamente';
PRINT '========================================';
PRINT '';
GO
