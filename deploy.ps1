# ============================================
# PRE CLOSER — PRODUCTION DEPLOY SCRIPT
# ============================================
# This script ensures the frontend build is
# synced to backend/public before every deploy.
# ============================================

$ErrorActionPreference = "Stop"
$ROOT = Split-Path -Parent $MyInvocation.MyCommand.Path

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host " PRE CLOSER DEPLOYMENT PIPELINE" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# --- STEP 1: Build Frontend ---
Write-Host "[1/6] Building frontend..." -ForegroundColor Yellow
Set-Location "$ROOT\frontend"
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "FRONTEND BUILD FAILED" -ForegroundColor Red; exit 1 }
Write-Host "  Frontend build complete." -ForegroundColor Green

# --- STEP 2: Verify frontend/out exists ---
Write-Host "[2/6] Verifying frontend export..." -ForegroundColor Yellow
$outDir = "$ROOT\frontend\out"
if (-not (Test-Path "$outDir\index.html")) {
    Write-Host "  ERROR: frontend/out/index.html not found!" -ForegroundColor Red
    exit 1
}
$outSize = (Get-Item "$outDir\index.html").Length
Write-Host "  index.html size: $outSize bytes" -ForegroundColor Green

# --- STEP 3: Clean old backend/public ---
Write-Host "[3/6] Cleaning old backend/public..." -ForegroundColor Yellow
$publicDir = "$ROOT\backend\public"
if (Test-Path $publicDir) { Remove-Item -Recurse -Force $publicDir }
Write-Host "  Old public cleared." -ForegroundColor Green

# --- STEP 4: Copy frontend/out -> backend/public ---
Write-Host "[4/6] Syncing frontend build to backend/public..." -ForegroundColor Yellow
Copy-Item -Recurse -Force $outDir $publicDir

# Stamp build version
$stamp = @{
    buildTime = (Get-Date).ToString("yyyy-MM-dd HH:mm:ss")
    indexSize = $outSize
    commit    = (git -C $ROOT log --oneline -1 2>$null) ?? "unknown"
} | ConvertTo-Json
$stamp | Out-File -FilePath "$publicDir\_build_meta.json" -Encoding utf8
Write-Host "  Sync complete. Build stamp written." -ForegroundColor Green

# --- STEP 5: Build Backend ---
Write-Host "[5/6] Building backend..." -ForegroundColor Yellow
Set-Location "$ROOT\backend"
npx prisma generate 2>$null
npm run build
if ($LASTEXITCODE -ne 0) { Write-Host "BACKEND BUILD FAILED" -ForegroundColor Red; exit 1 }
Write-Host "  Backend build complete." -ForegroundColor Green

# --- STEP 6: Git commit & push ---
Write-Host "[6/6] Committing and pushing..." -ForegroundColor Yellow
Set-Location $ROOT
git add -A
git commit -m "deploy: sync frontend build to production $(Get-Date -Format 'yyyy-MM-dd HH:mm')"
git push

Write-Host "`n========================================" -ForegroundColor Green
Write-Host " DEPLOYMENT COMPLETE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host " Frontend build synced to backend/public"
Write-Host " Changes pushed to origin/main"
Write-Host "========================================`n" -ForegroundColor Green
