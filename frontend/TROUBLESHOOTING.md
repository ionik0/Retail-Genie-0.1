# Troubleshooting Guide - Application Not Opening

## Quick Fixes

### 1. Check if Server is Running
The server should be running on: **http://localhost:5173/**

If you see this in terminal:
```
➜  Local:   http://localhost:5173/
```
Then the server IS running.

### 2. Open the Correct URL
Make sure you're opening:
```
http://localhost:5173/
```
NOT `http://localhost:5175/` (wrong port!)

### 3. Clear Browser Cache
1. Press `Ctrl + Shift + Delete` (or `Cmd + Shift + Delete` on Mac)
2. Clear cached images and files
3. Reload the page with `Ctrl + F5` (hard refresh)

### 4. Check Browser Console for Errors
1. Open browser (Chrome/Edge/Firefox)
2. Press `F12` to open Developer Tools
3. Click on "Console" tab
4. Look for any RED error messages
5. Share those errors if you see any

### 5. Try Different Browser
- If Chrome doesn't work, try Edge or Firefox
- Sometimes browser extensions can block the app

### 6. Check if Port is Blocked
Run this in PowerShell:
```powershell
netstat -ano | findstr :5173
```
If you see output, the server is running.

### 7. Restart the Server
1. In terminal, press `Ctrl + C` to stop the server
2. Then run again:
```powershell
npm run dev
```

### 8. Check for JavaScript Errors
Open browser console (F12) and look for:
- Red error messages
- Failed network requests
- Import/module errors

## Common Issues

### Issue: Blank White Screen
**Solution:**
- Open browser console (F12)
- Check for errors
- Try hard refresh: `Ctrl + F5`

### Issue: "Cannot GET /"
**Solution:**
- Make sure you're going to `http://localhost:5173/`
- Not `http://localhost:5173/index.html`

### Issue: "Port already in use"
**Solution:**
```powershell
# Find process using port 5173
netstat -ano | findstr :5173

# Kill the process (replace PID with number from above)
taskkill /PID <PID> /F

# Restart server
npm run dev
```

### Issue: Module not found errors
**Solution:**
```powershell
# Reinstall dependencies
npm install
npm run dev
```

## Step-by-Step Debugging

1. **Verify server is running:**
   ```powershell
   netstat -ano | findstr :5173
   ```

2. **Open browser to:** http://localhost:5173/

3. **Open Developer Tools:** Press `F12`

4. **Check Console tab** for errors

5. **Check Network tab** - see if files are loading

6. **Try incognito/private mode** - rules out extension issues

## Still Not Working?

Share these details:
1. What URL are you trying to open?
2. What do you see? (blank page, error message, etc.)
3. Any errors in browser console (F12)?
4. What browser are you using?

