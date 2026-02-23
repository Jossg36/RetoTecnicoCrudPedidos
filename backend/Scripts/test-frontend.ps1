# Script para ejecutar tests del frontend
# Proporciona opciones para watch, UI y coverage

param(
    [Parameter(Mandatory=$false)]
    [switch]$Watch = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$UI = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Coverage = $false,
    
    [Parameter(Mandatory=$false)]
    [string]$Filter = ""
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Tests del Frontend (React + Vitest)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "" # Script para ejecutar pruebas del frontend

$projectPath = Get-Location
$frontendPath = "$projectPath\frontend"

if (-not (Test-Path $frontendPath)) {
    Write-Host "❌ Error: Carpeta frontend no encontrada en:" -ForegroundColor Red
    Write-Host "   $frontendPath" -ForegroundColor Red
    exit 1
}

Push-Location $frontendPath

# Instalar dependencias si es necesario
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Instalando dependencias..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Error instalando dependencias" -ForegroundColor Red
        Pop-Location
        exit 1
    }
}

# Construir comando de npm
$testArgs = @()

if (-not $UI -and -not $Watch) {
    $testArgs += "--"
    $testArgs += "--run"
}

if ($UI) {
    $testArgs += "--"
    $testArgs += "--ui"
}

if ($Watch -and -not $UI) {
    $testArgs += "--"
    $testArgs += "--watch"
}

if ($Coverage) {
    $testArgs += "--"
    $testArgs += "--coverage"
}

if ($Filter) {
    $testArgs += "--"
    $testArgs += "--grep", $Filter
}

Write-Host "Ejecutando: npm test $($testArgs -join ' ')" -ForegroundColor Yellow
Write-Host ""

if ($testArgs.Count -gt 0) {
    & npm test @testArgs
} else {
    & npm test
}

$exitCode = $LASTEXITCODE

Pop-Location

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Todas las pruebas del frontend pasaron" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "⚠️  Algunas pruebas del frontend fallaron (código: $exitCode)" -ForegroundColor Yellow
}

exit $exitCode
