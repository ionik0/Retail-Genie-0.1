# Quick Test Commands

## 🚀 Start the Application

```powershell
# Navigate to project
cd "c:\Users\ADMIN\ey tech"

# Start development server
npm run dev
```

**Expected Output:**
```
  VITE v5.0.8  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

## ✅ Verification Checklist

### 1. Check if server is running:
```powershell
# In a new terminal window
netstat -ano | findstr :5173
```

### 2. Test in browser:
- Open: http://localhost:5173
- You should see the **Customer Login** page
- Enter a name and click "Start Chat"

### 3. Test the flow:
1. ✅ Login page appears
2. ✅ Chat interface loads
3. ✅ Type "office wear" in chat
4. ✅ Products are recommended
5. ✅ Click "Browse Products" button
6. ✅ Product cards display
7. ✅ Click "Check Inventory" on any product
8. ✅ Inventory modal opens
9. ✅ Click "Proceed to Checkout"
10. ✅ Checkout page loads
11. ✅ Click "Pay" button
12. ✅ Order confirmation appears

## 🔍 Quick Diagnostics

### Check if everything is installed:
```powershell
cd "c:\Users\ADMIN\ey tech"
node --version    # Should show v22.x.x
npm --version     # Should show 10.x.x
Test-Path "node_modules"  # Should return True
```

### If server won't start:
```powershell
# Reinstall dependencies
Remove-Item -Recurse -Force node_modules
npm install
npm run dev
```

### Check for errors:
```powershell
# Try building (will show any errors)
npm run build
```

## 📋 Status Check Commands

```powershell
# All-in-one status check
cd "c:\Users\ADMIN\ey tech"
Write-Host "Node: $(node --version)"
Write-Host "npm: $(npm --version)"
Write-Host "Dependencies: $(if (Test-Path node_modules) { 'Installed' } else { 'Missing - run npm install' })"
Write-Host "Server: $(if (netstat -ano | findstr :5173) { 'Running on port 5173' } else { 'Not running - run npm run dev' })"
```

## 🎯 Success Indicators

✅ **Application is working if:**
- `npm run dev` starts without errors
- Browser shows login page at http://localhost:5173
- No red errors in browser console (F12)
- Can navigate through all pages
- Chat responds to messages
- Products display correctly
- Checkout process completes

❌ **If something is wrong:**
- Check browser console (F12) for errors
- Check terminal for build errors
- Verify all files exist in `src/components`
- Run `npm install` again
- Clear browser cache and reload

