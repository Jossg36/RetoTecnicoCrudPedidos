# Script para ejecutar solo tests del backend
# Proporciona feedback detallado y opciones de filter

param(
    [Parameter(Mandatory=$false)]
    [string]$Filter = "",
    
    [Parameter(Mandatory=$false)]
    [switch]$Watch = $false,
    
    [Parameter(Mandatory=$false)]
    [switch]$Verbose = $false
)

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "Tests del Backend (.NET)" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host "" # Script para ejecutar pruebas del backend

$projectPath = Get-Location
$testProjectPath = "$projectPath\backend\OrderManagementAPI.Tests"

if (-not (Test-Path $testProjectPath)) {
    Write-Host "❌ Error: Proyecto de tests no encontrado en:" -ForegroundColor Red
    Write-Host "   $testProjectPath" -ForegroundColor Red
    exit 1
}

Push-Location $testProjectPath

$baseCommand = "dotnet test"
$testArgs = @()

# Agregar opciones
if ($Filter) {
    $testArgs += "--filter", $Filter
}

if ($Watch) {
    $testArgs += "--watch"
}

if ($Verbose) {
    $testArgs += "--logger", "console;verbosity=detailed"
} else {
    $testArgs += "--logger", "console;verbosity=normal"
}

Write-Host "Ejecutando: $baseCommand $($testArgs -join ' ')" -ForegroundColor Yellow
Write-Host ""

& $baseCommand @testArgs

$exitCode = $LASTEXITCODE

Pop-Location

if ($exitCode -eq 0) {
    Write-Host ""
    Write-Host "✅ Todas las pruebas pasaron" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "❌ Algunas pruebas fallaron (código: $exitCode)" -ForegroundColor Red
}

exit $exitCode
