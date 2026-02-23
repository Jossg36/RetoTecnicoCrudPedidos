-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script para crear procedimientos almacenados útiles
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- NOTA: Contiene procedimientos almacenados para operaciones comunes
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 07. CREAR PROCEDIMIENTOS ALMACENADOS
-- ============================================================================

PRINT '========================================';
PRINT '⚙️  Creando procedimientos almacenados...';
PRINT '========================================';
PRINT '';

-- ============================================================================
-- Procedimiento 1: Obtener detalles de una orden
-- ============================================================================
IF OBJECT_ID('dbo.sp_GetOrderDetails', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetOrderDetails;
GO

CREATE PROCEDURE [dbo].[sp_GetOrderDetails]
    @OrderId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Obtener información de la orden
    SELECT 
        o.[Id],
        o.[OrderNumber],
        o.[Status],
        CASE o.[Status]
            WHEN 0 THEN 'Pendiente'
            WHEN 1 THEN 'Confirmada'
            WHEN 2 THEN 'Enviada'
            WHEN 3 THEN 'Entregada'
            WHEN 4 THEN 'Cancelada'
            ELSE 'Desconocido'
        END AS [StatusDescription],
        o.[Description],
        o.[TotalAmount],
        o.[CreatedAt],
        u.[Username],
        u.[Email]
    FROM [dbo].[Orders] o
    INNER JOIN [dbo].[Users] u ON o.[UserId] = u.[Id]
    WHERE o.[Id] = @OrderId;
    
    -- Obtener items de la orden
    SELECT 
        [Id],
        [ProductName],
        [Quantity],
        [UnitPrice],
        [TotalPrice]
    FROM [dbo].[OrderItems]
    WHERE [OrderId] = @OrderId
    ORDER BY [Id];
END
GO

PRINT '[OK] Procedimiento sp_GetOrderDetails creado';

-- ============================================================================
-- Procedimiento 2: Obtener órdenes por usuario
-- ============================================================================
IF OBJECT_ID('dbo.sp_GetUserOrders', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetUserOrders;
GO

CREATE PROCEDURE [dbo].[sp_GetUserOrders]
    @UserId INT,
    @Status INT = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        o.[Id],
        o.[OrderNumber],
        o.[Status],
        CASE o.[Status]
            WHEN 0 THEN 'Pendiente'
            WHEN 1 THEN 'Confirmada'
            WHEN 2 THEN 'Enviada'
            WHEN 3 THEN 'Entregada'
            WHEN 4 THEN 'Cancelada'
            ELSE 'Desconocido'
        END AS [StatusDescription],
        o.[Description],
        o.[TotalAmount],
        o.[CreatedAt],
        (SELECT COUNT(*) FROM [dbo].[OrderItems] WHERE [OrderId] = o.[Id]) AS [ItemCount]
    FROM [dbo].[Orders] o
    WHERE o.[UserId] = @UserId
        AND (@Status IS NULL OR o.[Status] = @Status)
    ORDER BY o.[CreatedAt] DESC;
END
GO

PRINT '[OK] Procedimiento sp_GetUserOrders creado';

-- ============================================================================
-- Procedimiento 3: Obtener estadísticas de órdenes
-- ============================================================================
IF OBJECT_ID('dbo.sp_GetOrderStatistics', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetOrderStatistics;
GO

CREATE PROCEDURE [dbo].[sp_GetOrderStatistics]
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        'Total de órdenes' AS [Estadística],
        CAST(COUNT(*) AS VARCHAR(20)) AS [Valor]
    FROM [dbo].[Orders]
    
    UNION ALL
    
    SELECT 
        'Órdenes pendientes',
        CAST(COUNT(*) AS VARCHAR(20))
    FROM [dbo].[Orders]
    WHERE [Status] = 0
    
    UNION ALL
    
    SELECT 
        'Órdenes completadas',
        CAST(COUNT(*) AS VARCHAR(20))
    FROM [dbo].[Orders]
    WHERE [Status] = 3
    
    UNION ALL
    
    SELECT 
        'Monto total en órdenes',
        CAST(CAST(SUM([TotalAmount]) AS DECIMAL(18,2)) AS VARCHAR(20))
    FROM [dbo].[Orders]
    
    UNION ALL
    
    SELECT 
        'Orden promedio',
        CAST(CAST(AVG([TotalAmount]) AS DECIMAL(18,2)) AS VARCHAR(20))
    FROM [dbo].[Orders]
    
    UNION ALL
    
    SELECT 
        'Total de usuarios',
        CAST(COUNT(*) AS VARCHAR(20))
    FROM [dbo].[Users]
    
    UNION ALL
    
    SELECT 
        'Usuarios activos',
        CAST(COUNT(*) AS VARCHAR(20))
    FROM [dbo].[Users]
    WHERE [IsActive] = 1;
END
GO

PRINT '[OK] Procedimiento sp_GetOrderStatistics creado';

-- ============================================================================
-- Procedimiento 4: Buscar órdenes
-- ============================================================================
IF OBJECT_ID('dbo.sp_SearchOrders', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_SearchOrders;
GO

CREATE PROCEDURE [dbo].[sp_SearchOrders]
    @SearchTerm NVARCHAR(100) = NULL,
    @StatusFilter INT = NULL,
    @MinAmount DECIMAL(18,2) = NULL,
    @MaxAmount DECIMAL(18,2) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT 
        o.[Id],
        o.[OrderNumber],
        u.[Username],
        o.[Status],
        CASE o.[Status]
            WHEN 0 THEN 'Pendiente'
            WHEN 1 THEN 'Confirmada'
            WHEN 2 THEN 'Enviada'
            WHEN 3 THEN 'Entregada'
            WHEN 4 THEN 'Cancelada'
            ELSE 'Desconocido'
        END AS [StatusDescription],
        o.[Description],
        o.[TotalAmount],
        o.[CreatedAt]
    FROM [dbo].[Orders] o
    INNER JOIN [dbo].[Users] u ON o.[UserId] = u.[Id]
    WHERE 
        (@SearchTerm IS NULL OR 
         o.[OrderNumber] LIKE '%' + @SearchTerm + '%' OR
         o.[Description] LIKE '%' + @SearchTerm + '%' OR
         u.[Username] LIKE '%' + @SearchTerm + '%')
        AND (@StatusFilter IS NULL OR o.[Status] = @StatusFilter)
        AND (@MinAmount IS NULL OR o.[TotalAmount] >= @MinAmount)
        AND (@MaxAmount IS NULL OR o.[TotalAmount] <= @MaxAmount)
    ORDER BY o.[CreatedAt] DESC;
END
GO

PRINT '[OK] Procedimiento sp_SearchOrders creado';

-- ============================================================================
-- Procedimiento 5: Obtener historial de cambios de estado
-- ============================================================================
IF OBJECT_ID('dbo.sp_GetOrderStatusHistory', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetOrderStatusHistory;
GO

CREATE PROCEDURE [dbo].[sp_GetOrderStatusHistory]
    @OrderId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    -- Nota: Esta es una consulta simulada ya que no tenemos tabla de auditoría
    -- En una implementación real, existiría una tabla de auditoría
    SELECT 
        o.[Id] AS [OrderId],
        o.[OrderNumber],
        o.[Status] AS [CurrentStatus],
        CASE o.[Status]
            WHEN 0 THEN 'Pendiente'
            WHEN 1 THEN 'Confirmada'
            WHEN 2 THEN 'Enviada'
            WHEN 3 THEN 'Entregada'
            WHEN 4 THEN 'Cancelada'
            ELSE 'Desconocido'
        END AS [StatusDescription],
        o.[CreatedAt] AS [OrderCreatedDate]
    FROM [dbo].[Orders] o
    WHERE o.[Id] = @OrderId;
    
    PRINT 'Nota: Para historial completo de cambios, implemente tabla de auditoría';
END
GO

PRINT '[OK] Procedimiento sp_GetOrderStatusHistory creado';

-- ============================================================================
-- Procedimiento 6: Obtener usuarios con más órdenes
-- ============================================================================
IF OBJECT_ID('dbo.sp_GetTopCustomers', 'P') IS NOT NULL
    DROP PROCEDURE dbo.sp_GetTopCustomers;
GO

CREATE PROCEDURE [dbo].[sp_GetTopCustomers]
    @TopCount INT = 10
AS
BEGIN
    SET NOCOUNT ON;
    
    SELECT TOP (@TopCount)
        u.[Id],
        u.[Username],
        u.[Email],
        COUNT(o.[Id]) AS [OrderCount],
        ISNULL(SUM(o.[TotalAmount]), 0) AS [TotalSpent],
        CAST(ISNULL(AVG(o.[TotalAmount]), 0) AS DECIMAL(18,2)) AS [AverageOrderAmount]
    FROM [dbo].[Users] u
    LEFT JOIN [dbo].[Orders] o ON u.[Id] = o.[UserId]
    GROUP BY u.[Id], u.[Username], u.[Email]
    ORDER BY [TotalSpent] DESC;
END
GO

PRINT '[OK] Procedimiento sp_GetTopCustomers creado';

PRINT '';
PRINT '========================================';
PRINT '[OK] Procedimientos almacenados creados';
PRINT '========================================';
PRINT '';
PRINT 'Procedimientos disponibles:';
PRINT '   1. sp_GetOrderDetails - Obtiene detalles de una orden';
PRINT '   2. sp_GetUserOrders - Obtiene órdenes de un usuario';
PRINT '   3. sp_GetOrderStatistics - Estadísticas generales';
PRINT '   4. sp_SearchOrders - Búsqueda avanzada de órdenes';
PRINT '   5. sp_GetOrderStatusHistory - Historial de estado';
PRINT '   6. sp_GetTopCustomers - Clientes con más órdenes';
PRINT '';
PRINT 'Ejemplo de uso:';
PRINT '   EXEC sp_GetOrderDetails @OrderId = 1';
PRINT '   EXEC sp_GetUserOrders @UserId = 2';
PRINT '   EXEC sp_GetOrderStatistics';
PRINT '';
GO
