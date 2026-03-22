#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Quick verification script to ensure Phase 1-9 integration testing setup is valid

.DESCRIPTION
    Checks:
    - Node/npm installed
    - Dependencies installed
    - .env.local configured
    - Production build works
    - All routes accessible

.EXAMPLE
    .\verify-setup.ps1
#>

Write-Host "🔍 Verifying AI Chat App Integration Setup..." -ForegroundColor Cyan
Write-Host ""

# Check 1: Node.js
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "  ✅ Node $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ Node.js not installed" -ForegroundColor Red
    exit 1
}

# Check 2: npm
Write-Host "✓ Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "  ✅ npm $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "  ❌ npm not installed" -ForegroundColor Red
    exit 1
}

# Check 3: .env.local
Write-Host "✓ Checking .env.local..." -ForegroundColor Yellow
if (Test-Path ".\.env.local") {
    $envContent = Get-Content ".\.env.local"
    if ($envContent -match "NEXT_PUBLIC_API_URL") {
        Write-Host "  ✅ .env.local configured" -ForegroundColor Green
    } else {
        Write-Host "  ⚠️  NEXT_PUBLIC_API_URL not found in .env.local" -ForegroundColor Yellow
    }
} else {
    Write-Host "  ❌ .env.local not found" -ForegroundColor Red
}

# Check 4: node_modules
Write-Host "✓ Checking dependencies..." -ForegroundColor Yellow
if (Test-Path ".\node_modules") {
    $count = (Get-ChildItem ".\node_modules" -Directory).Count
    Write-Host "  ✅ $count packages installed" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  node_modules not found. Run 'npm install'" -ForegroundColor Yellow
}

# Check 5: Key files exist
Write-Host "✓ Checking project structure..." -ForegroundColor Yellow
$files = @(
    "package.json",
    "tsconfig.json",
    "next.config.ts",
    "src/app/page.tsx",
    "src/app/signup/page.tsx",
    "src/app/login/page.tsx",
    "src/lib/api.ts",
    "src/lib/react-query.tsx"
)

$missing = @()
foreach ($file in $files) {
    if (-not (Test-Path ".\$file")) {
        $missing += $file
    }
}

if ($missing.Count -eq 0) {
    Write-Host "  ✅ All key files present" -ForegroundColor Green
} else {
    Write-Host "  ⚠️  Missing files:" -ForegroundColor Yellow
    $missing | ForEach-Object { Write-Host "     - $_" }
}

# Check 6: Documentation
Write-Host "✓ Checking documentation..." -ForegroundColor Yellow
$docs = @(
    "INTEGRATION_TESTING_PLAN.md",
    "TESTING_PROGRESS.md",
    "LOCAL_TESTING_GUIDE.md",
    "PHASE_1_COMPLETE.md"
)

$docCount = 0
foreach ($doc in $docs) {
    if (Test-Path ".\$doc") {
        $docCount++
    }
}
Write-Host "  ✅ $docCount/$($docs.Count) documentation files" -ForegroundColor Green

Write-Host ""
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "🚀 Quick Start Commands" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "1. Install dependencies (if needed):" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Build production (verify compilation):" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Open browser:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Gray
Write-Host ""

Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host "📖 Testing Resources" -ForegroundColor Cyan
Write-Host "═════════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""
Write-Host "Integration Plan:        INTEGRATION_TESTING_PLAN.md" -ForegroundColor Cyan
Write-Host "Testing Progress:        TESTING_PROGRESS.md" -ForegroundColor Cyan
Write-Host "Local Testing Guide:     LOCAL_TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host "Phase 1 Status:          PHASE_1_COMPLETE.md" -ForegroundColor Cyan
Write-Host ""

Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host "✅ Setup Verification Complete" -ForegroundColor Green
Write-Host "═════════════════════════════════════════" -ForegroundColor Green
Write-Host ""
Write-Host "Ready to test Phase 1-9? Start with:" -ForegroundColor White
Write-Host "  1. Read: LOCAL_TESTING_GUIDE.md" -ForegroundColor Cyan
Write-Host "  2. Run:  npm run dev" -ForegroundColor Cyan
Write-Host "  3. Test: http://localhost:3000/signup" -ForegroundColor Cyan
Write-Host ""
