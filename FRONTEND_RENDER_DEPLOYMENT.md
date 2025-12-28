# Deploy Frontend to Render

This guide will help you deploy your React frontend to Render as a Static Site.

## Prerequisites

1. **Backend Deployed**: Your backend API should already be deployed on Render
2. **Backend URL**: Note your backend API URL (e.g., `https://career-profiling-api.onrender.com`)
3. **GitHub Repository**: Frontend code should be in a GitHub repository (can be same or different repo)

## Step-by-Step Deployment

### Step 1: Prepare Frontend Code

1. **Update API URL** (if not already done):
   - The frontend should use `VITE_API_URL` environment variable
   - Check `src/services/api.js` uses: `import.meta.env.VITE_API_URL`

2. **Build Test Locally** (optional but recommended):
   ```bash
   npm install
   npm run build
   ```
   - This creates a `dist` folder
   - Verify the build works without errors

### Step 2: Push to GitHub

If your frontend is not yet on GitHub:

1. **Create a new repository** on GitHub (or use existing one)
2. **Push your frontend code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Frontend"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_FRONTEND_REPO.git
   git branch -M main
   git push -u origin main
   ```

### Step 3: Deploy on Render

1. **Go to Render Dashboard**: https://dashboard.render.com

2. **Click "New +"** → **"Static Site"**

3. **Connect Repository**:
   - Click "Connect account" if not connected
   - Select your GitHub account
   - Choose the repository containing your frontend code
   - Click "Connect"

4. **Configure Static Site**:
   - **Name**: `career-profiling-frontend` (or any name you prefer)
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or specify if frontend is in a subfolder)
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`

5. **Environment Variables**:
   Click "Add Environment Variable" and add:
   
   - **Key**: `VITE_API_URL`
   - **Value**: Your backend API URL
   - **Example**: `https://career-profiling-api.onrender.com`
   
   ⚠️ **Important**: 
   - Do NOT include trailing slash
   - Use `https://` (not `http://`)
   - This is your backend URL from Step 1

6. **Click "Create Static Site"**

### Step 4: Wait for Deployment

1. Render will:
   - Install dependencies (`npm install`)
   - Build your app (`npm run build`)
   - Deploy the `dist` folder

2. **Monitor Progress**:
   - Watch the "Logs" tab for build progress
   - First deployment takes 5-10 minutes
   - Subsequent deployments are faster

3. **Get Your URL**:
   - Once deployed, you'll get a URL like: `https://career-profiling-frontend.onrender.com`
   - Or use your custom domain if configured

### Step 5: Update Backend CORS (Important!)

After frontend is deployed, update backend CORS:

1. **Go to your Backend Web Service** in Render
2. **Environment** tab
3. **Add/Update** environment variable:
   - **Key**: `FRONTEND_URL`
   - **Value**: Your frontend URL (e.g., `https://career-profiling-frontend.onrender.com`)
4. **Save Changes**
5. **Redeploy backend** (or it will auto-redeploy)

This allows your frontend to make API calls to the backend.

## Configuration Summary

### Render Static Site Settings:

| Setting | Value |
|---------|-------|
| **Name** | `career-profiling-frontend` |
| **Branch** | `main` |
| **Root Directory** | (empty) |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |

### Environment Variables:

| Key | Value | Example |
|-----|-------|---------|
| `VITE_API_URL` | Your backend URL | `https://career-profiling-api.onrender.com` |

## Verify Deployment

1. **Visit your frontend URL**: `https://your-frontend.onrender.com`
2. **Check browser console** (F12) for errors
3. **Test features**:
   - Login/Register
   - Test creation
   - API calls should work

## Troubleshooting

### Build Fails

**Error: "Command failed"**
- Check build logs in Render
- Verify `package.json` has correct scripts
- Ensure Node version is compatible (18.17.0)

**Error: "Module not found"**
- Check all dependencies are in `package.json`
- Verify `npm install` completes successfully
- Check for missing imports in code

### API Connection Fails

**Error: "Failed to fetch" or CORS error**
- Verify `VITE_API_URL` is set correctly
- Check backend CORS allows your frontend URL
- Ensure backend is running
- Check browser console for exact error

**Error: "Network error"**
- Verify backend URL is correct (no trailing slash)
- Check backend is deployed and running
- Test backend URL directly: `https://your-api.onrender.com/docs`

### Blank Page

**Page loads but shows nothing**
- Check browser console for JavaScript errors
- Verify build completed successfully
- Check `dist/index.html` exists
- Ensure `vite.config.js` is configured correctly

### Environment Variable Not Working

**VITE_API_URL not being used**
- Environment variables must start with `VITE_` to be accessible in frontend
- Rebuild after changing environment variables
- Check `src/services/api.js` uses `import.meta.env.VITE_API_URL`
- Clear browser cache

## Custom Domain (Optional)

1. Go to your Static Site in Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain
4. Follow DNS configuration instructions
5. Update `VITE_API_URL` if needed

## Updating Frontend

After making changes:

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Update frontend"
   git push
   ```

2. **Render auto-deploys**:
   - Render automatically detects new commits
   - Triggers new build and deployment
   - Usually takes 3-5 minutes

3. **Manual deploy** (if needed):
   - Go to Render dashboard
   - Click "Manual Deploy" → "Deploy latest commit"

## Cost

**Free Tier**:
- Static Sites are **FREE** on Render
- Unlimited deployments
- Free SSL certificate
- Custom domains supported

## File Structure Check

Ensure your project has:
```
your-frontend-repo/
├── package.json          ✅
├── vite.config.js        ✅
├── index.html            ✅
├── src/
│   ├── services/
│   │   └── api.js        ✅ (uses VITE_API_URL)
│   └── ...
└── dist/                 (created during build)
```

## Quick Checklist

- [ ] Frontend code pushed to GitHub
- [ ] Backend deployed and URL noted
- [ ] Static Site created on Render
- [ ] Build command: `npm install && npm run build`
- [ ] Publish directory: `dist`
- [ ] `VITE_API_URL` environment variable set
- [ ] Backend CORS updated with frontend URL
- [ ] Frontend loads correctly
- [ ] API calls work
- [ ] All features tested

## Next Steps

After frontend is deployed:

1. **Test all features**:
   - User registration
   - User login
   - Test creation
   - Test completion
   - Result viewing
   - PDF generation

2. **Update documentation** with live URLs

3. **Set up monitoring** (optional)

4. **Configure custom domain** (optional)

## Support

- Render Docs: https://render.com/docs/static-sites
- Vite Docs: https://vitejs.dev
- Render Status: https://status.render.com

