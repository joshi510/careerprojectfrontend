# Quick Start: Deploy Frontend to Render

## 🚀 Fast Track (5 minutes)

### 1. Prerequisites
- ✅ Backend deployed on Render (get the URL)
- ✅ Frontend code ready
- ✅ GitHub repository (can be same or different repo)

### 2. Deploy Steps

1. **Go to**: https://dashboard.render.com
2. **Click**: "New +" → "Static Site"
3. **Connect**: Your GitHub repository
4. **Configure**:
   - Name: `career-profiling-frontend`
   - Branch: `main`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
5. **Environment Variable**:
   - Key: `VITE_API_URL`
   - Value: `https://your-backend-api.onrender.com` (your backend URL)
6. **Click**: "Create Static Site"

### 3. Update Backend CORS

1. Go to **Backend Web Service** in Render
2. **Environment** tab
3. Add variable:
   - Key: `FRONTEND_URL`
   - Value: `https://your-frontend.onrender.com`
4. Save (backend will auto-redeploy)

### 4. Test

1. Visit your frontend URL
2. Check browser console (F12) for errors
3. Test login/API calls

## ✅ Done!

Your frontend is now live at: `https://your-frontend.onrender.com`

## 🆘 Issues?

- **Build fails**: Check logs, verify `package.json` scripts
- **API not working**: Verify `VITE_API_URL` is correct
- **CORS error**: Update backend `FRONTEND_URL` variable
- **Blank page**: Check browser console for errors

## 📝 Important Notes

- **Build Command**: Must be `npm install && npm run build`
- **Publish Directory**: Must be `dist`
- **Environment Variable**: Must be `VITE_API_URL` (starts with `VITE_`)
- **Backend URL**: No trailing slash, use `https://`

