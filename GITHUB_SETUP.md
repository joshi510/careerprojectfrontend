# How to Push Your Project to GitHub

## Step 1: Install Git
If Git is not installed on your system:

### For Windows:
1. Download Git from: https://git-scm.com/download/win
2. Run the installer and follow the setup wizard
3. Restart your terminal/PowerShell after installation

## Step 2: Initialize Git Repository

Open PowerShell/Terminal in your project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit: Career Profiling System"
```

## Step 3: Create GitHub Repository

1. Go to https://github.com and sign in
2. Click the "+" icon in the top right → "New repository"
3. Name your repository (e.g., "career-profiling-system")
4. **DO NOT** initialize with README, .gitignore, or license (we already have files)
5. Click "Create repository"

## Step 4: Connect and Push to GitHub

After creating the repository, GitHub will show you commands. Run these in your terminal:

```bash
# Add remote repository (replace YOUR_USERNAME and REPO_NAME)
git remote add origin https://github.com/YOUR_USERNAME/REPO_NAME.git

# Rename branch to main (if needed)
git branch -M main

# Push to GitHub
git push -u origin main
```

## Step 5: Authentication

GitHub may ask for authentication. You can use:
- **Personal Access Token** (recommended): 
  - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - Generate new token with `repo` permissions
  - Use this token as your password when pushing

## Alternative: Using GitHub Desktop

If you prefer a GUI:
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. File → Add Local Repository → Select your project folder
4. Click "Publish repository" button

## Important Notes:

- **Never commit sensitive data** like API keys, passwords, or `.env` files
- The `.gitignore` file has been created to exclude unnecessary files
- Make sure to review what files are being committed before pushing

