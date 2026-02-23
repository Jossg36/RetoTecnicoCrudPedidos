-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de limpieza y reinicio de datos
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- NOTA: Ejecutar para eliminar todos los datos manteniendo estructura
--       [ADVERTENCIA] Esto eliminará todos los datos de la base de datos
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 06. LIMPIAR Y REINICIAR DATOS
-- ============================================================================

PRINT '========================================';
PRINT '[ADVERTENCIA] INICIANDO LIMPIEZA DE DATOS';
PRINT '========================================';
PRINT '';
PRINT '[ELIMINANDO] Este script eliminará TODOS los datos de la base de datos';
PRINT '   pero mantendrá la estructura de tablas intacta.';
PRINT '   Presione Ctrl+A y ejecute cuando esté seguro.';
PRINT '';

BEGIN TRANSACTION;

PRINT '[DATOS] Eliminando datos...';
PRINT '';

-- Deshabilitar restricciones de clave externa temporalmente
ALTER TABLE [dbo].[OrderItems] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Orders] NOCHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Users] NOCHECK CONSTRAINT ALL;

-- Preservar identidades existentes
SET IDENTITY_INSERT [dbo].[OrderItems] OFF;
SET IDENTITY_INSERT [dbo].[Orders] OFF;
SET IDENTITY_INSERT [dbo].[Users] OFF;

-- Eliminar datos en orden de dependencias (desde las tablas más dependientes)
-- Paso 1: Eliminar items de órdenes
IF OBJECT_ID('tempdb..#OrderItemCount') IS NOT NULL DROP TABLE #OrderItemCount;
CREATE TABLE #OrderItemCount (ItemCount INT);

INSERT INTO #OrderItemCount SELECT COUNT(*) FROM [dbo].[OrderItems];
DECLARE @OrderItemCount INT = (SELECT ItemCount FROM #OrderItemCount);

IF @OrderItemCount > 0
BEGIN
    DELETE FROM [dbo].[OrderItems];
    PRINT '   [OK] Items de órdenes eliminados: ' + CAST(@OrderItemCount AS NVARCHAR(10)) + ' registros';
END
ELSE
    PRINT '   [OK] No había items de órdenes para eliminar';

-- Paso 2: Eliminar órdenes
IF OBJECT_ID('tempdb..#OrderCount') IS NOT NULL DROP TABLE #OrderCount;
CREATE TABLE #OrderCount (OrderCount INT);

INSERT INTO #OrderCount SELECT COUNT(*) FROM [dbo].[Orders];
DECLARE @OrderCount INT = (SELECT OrderCount FROM #OrderCount);

IF @OrderCount > 0
BEGIN
    DELETE FROM [dbo].[Orders];
    PRINT '   [OK] Órdenes eliminadas: ' + CAST(@OrderCount AS NVARCHAR(10)) + ' registros';
END
ELSE
    PRINT '   [OK] No había órdenes para eliminar';

-- Paso 3: Eliminar usuarios
IF OBJECT_ID('tempdb..#UserCount') IS NOT NULL DROP TABLE #UserCount;
CREATE TABLE #UserCount (UserCount INT);

INSERT INTO #UserCount SELECT COUNT(*) FROM [dbo].[Users];
DECLARE @UserCount INT = (SELECT UserCount FROM #UserCount);

IF @UserCount > 0
BEGIN
    DELETE FROM [dbo].[Users];
    PRINT '   [OK] Usuarios eliminados: ' + CAST(@UserCount AS NVARCHAR(10)) + ' registros';
END
ELSE
    PRINT '   [OK] No había usuarios para eliminar';

PRINT '';

-- Reactivar restricciones de clave externa
ALTER TABLE [dbo].[Users] WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[Orders] WITH CHECK CHECK CONSTRAINT ALL;
ALTER TABLE [dbo].[OrderItems] WITH CHECK CHECK CONSTRAINT ALL;

-- Resetear identidades
DBCC CHECKIDENT ('[dbo].[OrderItems]', RESEED, 1);
DBCC CHECKIDENT ('[dbo].[Orders]', RESEED, 1);
DBCC CHECKIDENT ('[dbo].[Users]', RESEED, 1);

PRINT '[LIMPIAR] Identidades reseteadas a valor inicial (1)';
PRINT '';

-- Confirmar transacción
COMMIT TRANSACTION;

PRINT '========================================';
PRINT '[OK] Limpieza completada exitosamente';
PRINT '========================================';
PRINT '';
PRINT '[PASOS] Próximos pasos:';
PRINT '   1. Ejecute 004_InsertTestData.sql para recargar datos de prueba';
PRINT '   2. Ejecute 005_ValidateData.sql para validar integridad';
PRINT '';
GO

-- Opcional: Mostrar estado final
PRINT 'Estado final de tablas:';
PRINT '';
PRINT '[USUARIOS] Usuarios: ' + CAST((SELECT COUNT(*) FROM [dbo].[Users]) AS VARCHAR(10)) + ' registros';
PRINT '[ORDENES] Órdenes: ' + CAST((SELECT COUNT(*) FROM [dbo].[Orders]) AS VARCHAR(10)) + ' registros';
PRINT '[ITEMS] Items: ' + CAST((SELECT COUNT(*) FROM [dbo].[OrderItems]) AS VARCHAR(10)) + ' registros';
PRINT '';
GO
