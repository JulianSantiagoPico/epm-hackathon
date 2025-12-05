# Script para iniciar el servidor FastAPI
Set-Location -Path $PSScriptRoot
$venvPython = "..\.venv\Scripts\python.exe"

Write-Host "Iniciando servidor FastAPI..." -ForegroundColor Green
Write-Host "Servidor: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Docs: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""

& $venvPython -m uvicorn app.main:app --reload --port 8000
