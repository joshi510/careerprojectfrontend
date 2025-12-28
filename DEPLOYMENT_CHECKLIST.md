# Deployment Checklist

## Pre-Deployment

- [ ] Push all code to GitHub
- [ ] Test application locally
- [ ] Get Gemini API key from Google AI Studio
- [ ] Prepare a strong JWT secret key

## Render Setup

### Database
- [ ] Create PostgreSQL database on Render
- [ ] Copy Internal Database URL
- [ ] Note database credentials

### Backend API
- [ ] Create Web Service
- [ ] Connect GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn backend.main:app --host 0.0.0.0 --port $PORT`
- [ ] Add environment variables:
  - [ ] `DATABASE_URL` (from PostgreSQL service)
  - [ ] `JWT_SECRET_KEY` (generate strong random string)
  - [ ] `GEMINI_API_KEY` (your API key)
  - [ ] `DEBUG=false`
  - [ ] `FRONTEND_URL` (will set after frontend deploys)

### Frontend
- [ ] Create Static Site
- [ ] Connect GitHub repository
- [ ] Set build command: `npm install && npm run build`
- [ ] Set publish directory: `dist`
- [ ] Add environment variable:
  - [ ] `VITE_API_URL` (backend URL after it deploys)

## Post-Deployment

- [ ] Test backend health endpoint
- [ ] Test frontend loads
- [ ] Test user registration
- [ ] Test user login
- [ ] Test test creation
- [ ] Test test completion
- [ ] Test result page
- [ ] Test PDF generation
- [ ] Update CORS with frontend URL
- [ ] Test from different devices

## Files Created for Deployment

✅ `requirements.txt` - Python dependencies
✅ `render.yaml` - Render configuration (optional)
✅ `Procfile` - Process file for backend
✅ `runtime.txt` - Python version
✅ `.nvmrc` - Node version
✅ `.gitignore` - Git ignore rules
✅ Updated `backend/database.py` - PostgreSQL support
✅ Updated `backend/main.py` - CORS configuration
✅ Updated `src/services/api.js` - Environment variable support
✅ Updated `vite.config.js` - Production build optimization

## Quick Commands

### Generate JWT Secret Key:
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### Test Backend Locally:
```bash
cd backend
uvicorn main:app --reload --port 8001
```

### Test Frontend Locally:
```bash
npm run dev
```

### Build Frontend:
```bash
npm run build
```

## Troubleshooting

### Backend won't start:
- Check logs in Render dashboard
- Verify all environment variables are set
- Check Python version matches runtime.txt

### Frontend can't connect to API:
- Verify VITE_API_URL is correct
- Check CORS settings in backend
- Ensure backend is running

### Database connection fails:
- Verify DATABASE_URL format
- Check database is running
- Ensure using Internal Database URL (not External)

## Support Resources

- Render Docs: https://render.com/docs
- Render Status: https://status.render.com
- FastAPI Docs: https://fastapi.tiangolo.com
- Vite Docs: https://vitejs.dev

