# Script para ejecutar tests y generar reporte de cobertura
# Backend: xUnit con coverlet
# Frontend: Vitest con coverage

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Generando Reportes de Cobertura" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$projectPath = Get-Location

# ============================================
# COBERTURA DEL BACKEND
# ============================================

Write-Host "1️⃣  Cobertura del Backend" -ForegroundColor Yellow
Write-Host "=========================" -ForegroundColor Yellow

$backendPath = "$projectPath\backend"
$testProjectPath = "$backendPath\OrderManagementAPI.Tests"

if (Test-Path $testProjectPath) {
    Push-Location $testProjectPath
    
    Write-Host "📊 Ejecutando tests con cobertura..." -ForegroundColor Cyan
    Write-Host ""
    
    dotnet test `
        --logger "console;verbosity=detailed" `
        /p:CollectCoverageMetrics=true `
        /p:CoverletOutput="../../coverage/backend/" `
        /p:CoverletOutputFormat="cobertura"
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cobertura del backend generada" -ForegroundColor Green
        Write-Host "📁 Ubicación: coverage/backend/" -ForegroundColor Cyan
    } else {
        Write-Host "❌ Error generando cobertura del backend" -ForegroundColor Red
    }
    
    Pop-Location
} else {
    Write-Host "⚠️  Proyecto de tests no encontrado" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# ============================================
# COBERTURA DEL FRONTEND
# ============================================

Write-Host "2️⃣  Cobertura del Frontend" -ForegroundColor Yellow
Write-Host "==========================" -ForegroundColor Yellow

$frontendPath = "$projectPath\frontend"

if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    
    # Instalar dependencias si es necesario
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
        npm install
    }
    
    Write-Host "📊 Ejecutando tests con cobertura..." -ForegroundColor Cyan
    Write-Host ""
    
    npm test -- --coverage --run
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Cobertura del frontend generada" -ForegroundColor Green
        Write-Host "📁 Ubicación: coverage/" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Hubo problemas generando cobertura del frontend" -ForegroundColor Yellow
    }
    
    Pop-Location
} else {
    Write-Host "⚠️  Carpeta frontend no encontrada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# ============================================
# ABRE REPORTES EN NAVEGADOR
# ============================================

Write-Host "📂 Abriendo reportes de cobertura..." -ForegroundColor Cyan
Write-Host ""

$backendCoverage = "$projectPath\coverage\backend\index.html"
$frontendCoverage = "$projectPath\frontend\coverage\index.html"

if (Test-Path $backendCoverage) {
    Write-Host "🌐 Backend coverage: $backendCoverage" -ForegroundColor Green
}

if (Test-Path $frontendCoverage) {
    Write-Host "🌐 Frontend coverage: $frontendCoverage" -ForegroundColor Green
}

Write-Host ""
Write-Host "✅ Reportes de cobertura generados exitosamente" -ForegroundColor Green
