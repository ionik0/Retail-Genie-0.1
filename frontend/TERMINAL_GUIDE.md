# Terminal Guide - Testing the Application

## Step-by-Step Verification Commands

### 1. Navigate to Project Directory
```powershell
cd "c:\Users\ADMIN\ey tech"
```

### 2. Check Node.js and npm Installation
```powershell
node --version
npm --version
```
**Expected Output:**
- Node.js version (e.g., v22.20.0)
- npm version (e.g., 10.9.3)

### 3. Verify Project Structure
```powershell
# Check if key files exist
Test-Path "package.json"
Test-Path "src\App.jsx"
Test-Path "src\components\Chatbot.jsx"
Test-Path "src\data\products.json"
```

### 4. Install Dependencies (if needed)
```powershell
npm install
```
**Expected Output:**
- Should complete without errors
- Creates/updates `node_modules` folder
- Creates `package-lock.json`

### 5. Verify Dependencies Installed
```powershell
# Check if node_modules exists and has content
Test-Path "node_modules"
Get-ChildItem "node_modules" | Measure-Object | Select-Object -ExpandProperty Count
```

### 6. Start Development Server
```powershell
npm run dev
```
**Expected Output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network:  use --host to expose
  ➜  press h + enter to show help
```

### 7. Verify Server is Running
Open a **NEW terminal window** and run:
```powershell
# Check if port 5173 is in use
netstat -ano | findstr :5173
```

Or test the connection:
```powershell
# Test if server responds (PowerShell 7+)
Invoke-WebRequest -Uri "http://localhost:5173" -UseBasicParsing | Select-Object StatusCode
```

### 8. Check for Build Errors
```powershell
# Try building the project
npm run build
```
**Expected Output:**
- Creates `dist` folder
- No errors in output

### 9. Quick File Verification
```powershell
# Verify all key components exist
$files = @(
    "src\App.jsx",
    "src\main.jsx",
    "src\components\CustomerLogin.jsx",
    "src\components\Chatbot.jsx",
    "src\components\ProductsPage.jsx",
    "src\components\Checkout.jsx",
    "src\components\OrderSummary.jsx",
    "src\components\PostPurchaseSupport.jsx",
    "src\data\products.json",
    "src\data\customers.json",
    "src\data\inventory.json",
    "src\data\promotions.json"
)

foreach ($file in $files) {
    if (Test-Path $file) {
        Write-Host "✅ $file" -ForegroundColor Green
    } else {
        Write-Host "❌ $file MISSING" -ForegroundColor Red
    }
}
```

## Troubleshooting Commands

### If npm install fails:
```powershell
# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
Remove-Item -Recurse -Force node_modules
Remove-Item package-lock.json
npm install
```

### If port 5173 is already in use:
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or use a different port
# Edit vite.config.js to add: server: { port: 3000 }
```

### Check for syntax errors:
```powershell
# This will show any import/export errors
npm run build
```

### Verify TailwindCSS is configured:
```powershell
# Check if Tailwind config exists
Test-Path "tailwind.config.js"
Test-Path "postcss.config.js"
Get-Content "src\index.css" | Select-String "tailwind"
```

## Quick Test Script

Save this as `test-setup.ps1` and run it:

```powershell
Write-Host "=== Testing Application Setup ===" -ForegroundColor Cyan

# Check Node.js
Write-Host "`n1. Checking Node.js..." -ForegroundColor Yellow
$nodeVersion = node --version
if ($nodeVersion) {
    Write-Host "   ✅ Node.js: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ Node.js not found!" -ForegroundColor Red
    exit 1
}

# Check npm
Write-Host "`n2. Checking npm..." -ForegroundColor Yellow
$npmVersion = npm --version
if ($npmVersion) {
    Write-Host "   ✅ npm: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "   ❌ npm not found!" -ForegroundColor Red
    exit 1
}

# Check project files
Write-Host "`n3. Checking project files..." -ForegroundColor Yellow
$requiredFiles = @(
    "package.json",
    "src\App.jsx",
    "src\main.jsx",
    "vite.config.js"
)

$allFilesExist = $true
foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "   ✅ $file" -ForegroundColor Green
    } else {
        Write-Host "   ❌ $file MISSING" -ForegroundColor Red
        $allFilesExist = $false
    }
}

if (-not $allFilesExist) {
    Write-Host "`n❌ Some required files are missing!" -ForegroundColor Red
    exit 1
}

# Check node_modules
Write-Host "`n4. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    $moduleCount = (Get-ChildItem "node_modules" -Directory).Count
    Write-Host "   ✅ node_modules exists ($moduleCount packages)" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  node_modules not found. Run 'npm install'" -ForegroundColor Yellow
}

Write-Host "`n=== Setup Check Complete ===" -ForegroundColor Cyan
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm install (if node_modules missing)" -ForegroundColor White
Write-Host "2. Run: npm run dev" -ForegroundColor White
Write-Host "3. Open: http://localhost:5173" -ForegroundColor White
```

## Expected Behavior When Running

### ✅ Success Indicators:
1. `npm run dev` starts without errors
2. Terminal shows "Local: http://localhost:5173/"
3. Browser opens and shows login page
4. No console errors in browser DevTools (F12)
5. All pages navigate correctly

### ❌ Error Indicators:
1. Port already in use → Kill process or change port
2. Module not found → Run `npm install`
3. Syntax errors → Check file syntax
4. Tailwind not working → Verify TailwindCSS config

## Quick Verification Checklist

Run these commands in sequence:

```powershell
# 1. Navigate
cd "c:\Users\ADMIN\ey tech"

# 2. Check versions
node --version
npm --version

# 3. Install (if needed)
npm install

# 4. Start server
npm run dev
```

**If all steps complete successfully, your application is working!** 🎉

Open http://localhost:5173 in your browser to see the application.

