# Deploying to Render

This guide will help you deploy your Career Profiling Platform to Render.

## Prerequisites

1. **GitHub Repository**: Your project must be pushed to GitHub (see `GITHUB_SETUP.md`)
2. **Render Account**: Sign up at https://render.com (free tier available)
3. **Environment Variables**: Prepare your API keys and secrets

## Deployment Steps

### Step 1: Create PostgreSQL Database on Render

1. Go to https://dashboard.render.com
2. Click **"New +"** → **"PostgreSQL"**
3. Configure:
   - **Name**: `career-profiling-db`
   - **Database**: `career_profiling_db`
   - **User**: `career_profiling_user`
   - **Region**: Choose closest to your users
   - **Plan**: Free (or paid for production)
4. Click **"Create Database"**
5. **IMPORTANT**: Copy the **Internal Database URL** (you'll need this)

### Step 2: Deploy Backend API

1. In Render dashboard, click **"New +"** → **"Web Service"**
2. Connect your GitHub repository
3. Configure the service:
   - **Name**: `career-profiling-api`
   - **Environment**: `Python 3`
   - **Region**: Same as database
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (or `backend` if you prefer)
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables** (Add these):
   ```
   DATABASE_URL=<Internal Database URL from Step 1>
   JWT_SECRET_KEY=<Generate a strong random string>
   GEMINI_API_KEY=<Your Gemini API key>
   DEBUG=false
   PYTHON_VERSION=3.11.0
   ```
5. Click **"Create Web Service"**
6. Wait for deployment (5-10 minutes)

### Step 3: Deploy Frontend

1. In Render dashboard, click **"New +"** → **"Static Site"**
2. Connect your GitHub repository
3. Configure:
   - **Name**: `career-profiling-frontend`
   - **Branch**: `main`
   - **Root Directory**: Leave empty
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. **Environment Variables** (Add these):
   ```
   VITE_API_URL=<Your backend API URL from Step 2>
   ```
   Example: `https://career-profiling-api.onrender.com`
5. Click **"Create Static Site"**
6. Wait for deployment

### Step 4: Update Frontend API URL

After backend is deployed, update the frontend environment variable:

1. Go to your **Frontend Static Site** in Render
2. Go to **"Environment"** tab
3. Update `VITE_API_URL` to your backend URL
4. Click **"Save Changes"** (this will trigger a rebuild)

### Step 5: Update CORS Settings

1. Go to your **Backend Web Service** in Render
2. Go to **"Environment"** tab
3. Add environment variable:
   ```
   FRONTEND_URL=<Your frontend URL>
   ```
   Example: `https://career-profiling-frontend.onrender.com`
4. Update `backend/main.py` CORS settings to use this variable

## Alternative: Using render.yaml (Recommended)

If you prefer, you can use the `render.yaml` file for easier deployment:

1. Push `render.yaml` to your GitHub repository
2. In Render dashboard, click **"New +"** → **"Blueprint"**
3. Connect your GitHub repository
4. Render will automatically detect `render.yaml` and create all services
5. You'll still need to set environment variables manually

## Environment Variables Reference

### Backend Required Variables:
- `DATABASE_URL` - Provided by Render PostgreSQL service
- `JWT_SECRET_KEY` - Generate a strong random string
- `GEMINI_API_KEY` - Your Google Gemini API key
- `DEBUG` - Set to `false` for production

### Frontend Required Variables:
- `VITE_API_URL` - Your backend API URL (e.g., `https://career-profiling-api.onrender.com`)

## Post-Deployment Checklist

- [ ] Backend API is accessible (check health endpoint)
- [ ] Frontend loads correctly
- [ ] Database connection works
- [ ] Authentication works (login/register)
- [ ] Test creation and completion works
- [ ] PDF generation works
- [ ] CORS is configured correctly

## Troubleshooting

### Backend Issues:

1. **Database Connection Error**:
   - Verify `DATABASE_URL` is correct
   - Check database is running
   - Ensure database user has proper permissions

2. **Import Errors**:
   - Verify all dependencies are in `requirements.txt`
   - Check Python version matches (3.11.0)

3. **Port Issues**:
   - Ensure start command uses `$PORT` variable
   - Render automatically assigns port

### Frontend Issues:

1. **API Connection Error**:
   - Verify `VITE_API_URL` is correct
   - Check CORS settings in backend
   - Ensure backend is running

2. **Build Errors**:
   - Check Node version (18.17.0)
   - Verify all dependencies in `package.json`

## Custom Domain (Optional)

1. Go to your service in Render
2. Click **"Settings"** → **"Custom Domain"**
3. Add your domain
4. Follow DNS configuration instructions

## Monitoring

- Check **"Logs"** tab for real-time logs
- Use **"Metrics"** tab for performance monitoring
- Set up **"Alerts"** for downtime notifications

## Cost Estimation

**Free Tier** (Good for testing):
- Web Service: 750 hours/month free
- PostgreSQL: 90 days free trial
- Static Site: Free

**Paid Plans** (For production):
- Web Service: $7/month (Starter)
- PostgreSQL: $7/month (Starter)
- Static Site: Free

## Support

- Render Docs: https://render.com/docs
- Render Community: https://community.render.com
- Status Page: https://status.render.com

