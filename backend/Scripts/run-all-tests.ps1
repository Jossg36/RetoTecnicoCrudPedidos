# Script para ejecutar todas las pruebas unitarias
# Ejecuta tests del backend (.NET) y frontend (React)

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Iniciando Suite de Pruebas" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

$startTime = Get-Date
$successCount = 0
$failureCount = 0

# ============================================
# PRUEBAS DEL BACKEND (.NET)
# ============================================

Write-Host "1️⃣  Ejecutando Pruebas del Backend (.NET)" -ForegroundColor Yellow
Write-Host "==========================================" -ForegroundColor Yellow

$projectPath = Get-Location
$backendPath = "$projectPath\backend"
$testProjectPath = "$backendPath\OrderManagementAPI.Tests"

if (Test-Path $testProjectPath) {
    Push-Location $testProjectPath
    
    Write-Host "📦 Ejecutando: dotnet test" -ForegroundColor Cyan
    Write-Host ""
    
    dotnet test --logger "console;verbosity=detailed" /p:CollectCoverageMetrics=true
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pruebas del backend completadas exitosamente" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "❌ Error en pruebas del backend" -ForegroundColor Red
        $failureCount++
    }
    
    Pop-Location
} else {
    Write-Host "⚠️  Proyecto de tests no encontrado en: $testProjectPath" -ForegroundColor Yellow
    Write-Host "   Asegúrate de que exista el proyecto OrderManagementAPI.Tests" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# ============================================
# PRUEBAS DEL FRONTEND (React + Vitest)
# ============================================

Write-Host "2️⃣  Ejecutando Pruebas del Frontend (React)" -ForegroundColor Yellow
Write-Host "============================================" -ForegroundColor Yellow

$frontendPath = "$projectPath\frontend"

if (Test-Path $frontendPath) {
    Push-Location $frontendPath
    
    # Verificar si node_modules existe
    if (-not (Test-Path "node_modules")) {
        Write-Host "📦 Instalando dependencias..." -ForegroundColor Cyan
        npm install
        if ($LASTEXITCODE -ne 0) {
            Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
            Pop-Location
            exit 1
        }
    }
    
    Write-Host "📋 Ejecutando: npm test" -ForegroundColor Cyan
    Write-Host ""
    
    npm test -- --run
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Pruebas del frontend completadas exitosamente" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "⚠️  Algunas pruebas del frontend pueden haber fallado" -ForegroundColor Yellow
        $failureCount++
    }
    
    Pop-Location
} else {
    Write-Host "⚠️  Carpeta frontend no encontrada" -ForegroundColor Yellow
}

Write-Host ""
Write-Host ""

# ============================================
# RESUMEN DE RESULTADOS
# ============================================

$endTime = Get-Date
$duration = $endTime - $startTime

Write-Host "================================" -ForegroundColor Cyan
Write-Host "Resumen de Pruebas" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "✅ Suites exitosas: $successCount" -ForegroundColor Green
Write-Host "❌ Suites fallidas: $failureCount" -ForegroundColor Red
Write-Host "⏱️  Tiempo total: $($duration.TotalSeconds) segundos" -ForegroundColor Cyan
Write-Host ""

if ($failureCount -eq 0) {
    Write-Host "🎉 ¡TODAS LAS PRUEBAS PASARON!" -ForegroundColor Green
    exit 0
} else {
    Write-Host "⚠️  Revisa los errores arriba" -ForegroundColor Yellow
    exit 1
}
