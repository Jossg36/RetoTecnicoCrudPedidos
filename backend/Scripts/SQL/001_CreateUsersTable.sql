-- ============================================================================
-- BASE DE DATOS: Order Management System
-- DESCRIPCIÓN: Script de creación de tabla Users
-- FECHA: 2026-02-22
-- AUTOR: Team Development
-- VERSION: 1.0
-- ============================================================================

USE [OrderManagementDB]
GO

-- ============================================================================
-- 01. CREAR TABLA USERS
-- ============================================================================
-- Tabla principal de usuarios del sistema
-- Almacena credenciales, roles y datos básicos de usuario

IF OBJECT_ID('[dbo].[Users]', 'U') IS NULL
BEGIN
    CREATE TABLE [dbo].[Users]
    (
        [Id] INT PRIMARY KEY IDENTITY(1, 1),
        [Username] NVARCHAR(50) NOT NULL,
        [Email] NVARCHAR(100) NOT NULL,
        [PasswordHash] NVARCHAR(MAX) NOT NULL,
        [Role] INT NOT NULL DEFAULT 0,                    -- 0: User, 1: Admin
        [IsActive] BIT NOT NULL DEFAULT 1,                -- Estado de cuenta
        [CreatedAt] DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        [UpdatedAt] DATETIME2 NULL
    );

    -- Crear índices UNIQUE para evitar duplicados
    CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Username] 
        ON [dbo].[Users]([Username])
        WHERE [Username] IS NOT NULL;

    CREATE UNIQUE NONCLUSTERED INDEX [IX_Users_Email] 
        ON [dbo].[Users]([Email])
        WHERE [Email] IS NOT NULL;

    -- Crear índice para búsquedas por IsActive
    CREATE NONCLUSTERED INDEX [IX_Users_IsActive] 
        ON [dbo].[Users]([IsActive]);

    PRINT ' Tabla Users creada exitosamente';
END
ELSE
    PRINT 'Tabla Users ya existe';
GO
