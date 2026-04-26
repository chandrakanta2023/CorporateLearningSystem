# GitHub Repository Connection Guide

## Current Status
- **Repository URL:** https://github.com/chandrakanta2023/CorporateLearningSystem.git
- **Local Path:** C:\Technothon\Problem_Statement_3_Corporate_Learning
- **Git Status:** ❌ Not installed

---

## ⚠️ Git Not Installed

Git is not currently installed on your system. You need to install Git before we can connect to the GitHub repository.

### Installation Steps

#### Option 1: Download Git for Windows (Recommended)
1. Go to: https://git-scm.com/download/windows
2. Download the installer (64-bit recommended)
3. Run the installer with these settings:
   - ✅ Use Visual Studio Code as Git's default editor
   - ✅ Git from the command line and also from 3rd-party software
   - ✅ Use bundled OpenSSH
   - ✅ Use the OpenSSL library
   - ✅ Checkout Windows-style, commit Unix-style line endings
   - ✅ Use MinTTY (the default terminal of MSYS2)
   - ✅ Default (fast-forward or merge)
   - ✅ Git Credential Manager
   - ✅ Enable file system caching
4. Click "Install" and wait for completion
5. Restart VS Code or PowerShell terminals

#### Option 2: Using Winget (if available)
```powershell
winget install --id Git.Git -e --source winget
```

---

## After Installing Git

Once Git is installed, run these commands to connect to your GitHub repository:

### Step 1: Configure Git (First Time Setup)
```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### Step 2: Initialize Repository
```powershell
# Navigate to project folder
cd C:\Technothon\Problem_Statement_3_Corporate_Learning

# Initialize Git repository
git init

# Add GitHub remote
git remote add origin https://github.com/chandrakanta2023/CorporateLearningSystem.git

# Verify remote was added
git remote -v
```

### Step 3: Create .gitignore (AI will do this)
The AI assistant will create comprehensive .gitignore files for:
- Root directory (general files)
- Backend (Node.js, TypeScript, .env files)
- Frontend (Node.js, build files)

### Step 4: Initial Commit
```powershell
# Stage all files
git add .

# Create initial commit
git commit -m "Initial commit: Corporate Learning System - Phase 1 POC"

# Check current branch name
git branch

# If branch is 'master', rename to 'main' (GitHub default)
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## 📋 Files That Will Be Created

Once Git is installed, the AI will create:

1. **`.gitignore`** (Root)
   - node_modules/
   - .env files
   - build outputs
   - OS-specific files
   - IDE files

2. **`backend/.gitignore`** (Backend specific)
   - dist/
   - .env
   - coverage/
   - logs/

3. **`frontend/.gitignore`** (Frontend specific)
   - dist/
   - .vite/
   - coverage/

4. **`README.md`** (Already exists, will be preserved)

5. **`.gitattributes`** (Line ending configuration)

---

## 🔐 Authentication Options

When pushing to GitHub, you'll need to authenticate:

### Option 1: Personal Access Token (Recommended)
1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Generate new token (classic)"
3. Give it a name: "Corporate Learning System"
4. Select scopes: `repo` (full control of private repositories)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)
7. When git push asks for password, use the token instead

### Option 2: GitHub CLI (Advanced)
```powershell
winget install --id GitHub.cli
gh auth login
```

### Option 3: SSH Key (Advanced)
Follow: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

---

## 🚨 Important Security Notes

**DO NOT commit these files:**
- ❌ `backend/.env` (contains database password!)
- ❌ `node_modules/` (thousands of dependencies)
- ❌ `.vscode/` (local IDE settings - optional)
- ❌ Database files
- ❌ Build outputs (dist/, build/)

**These will be EXCLUDED by .gitignore files**

---

## 📦 What Will Be Committed

✅ Source code files (.ts, .tsx, .js, .jsx)
✅ Configuration files (package.json, tsconfig.json, vite.config.ts)
✅ Environment templates (.env.example)
✅ Documentation (.md files)
✅ Database entities (TypeORM models)
✅ Setup scripts (.ps1 files)
✅ VS Code extensions list (.vscode/extensions.json)

**Estimated repository size:** ~500KB (without node_modules)

---

## 🔄 Workflow After Setup

### Daily Development Flow
```powershell
# Pull latest changes
git pull

# Make changes to code...

# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add user authentication module"

# Push to GitHub
git push
```

### Branch Strategy (Optional)
```powershell
# Create feature branch
git checkout -b feature/user-authentication

# Work on feature...
git add .
git commit -m "Implement JWT authentication"

# Push feature branch
git push -u origin feature/user-authentication

# Merge to main later (via Pull Request on GitHub)
```

---

## ⏭️ Next Steps

1. **Install Git** (5-10 minutes)
   - Download from https://git-scm.com/download/windows
   - Run installer with default settings
   - Restart PowerShell/VS Code

2. **Notify AI** (1 minute)
   - Tell AI "Git is installed"
   - AI will create .gitignore files
   - AI will guide you through repository setup

3. **Configure Git** (2 minutes)
   - Set username and email
   - Verify configuration

4. **Connect to GitHub** (5 minutes)
   - Initialize repository
   - Add remote
   - Create initial commit
   - Push to GitHub

**Total Time:** ~15-20 minutes

---

## 🆘 Troubleshooting

### "git: command not found" after installation
- Close and reopen PowerShell/VS Code
- Restart computer if still not working

### "Permission denied" when pushing
- Check authentication method (token vs SSH)
- Verify Personal Access Token has `repo` scope
- Try: `git config --global credential.helper wincred`

### "Repository already exists on GitHub"
If repository already has files:
```powershell
# Pull existing files first
git pull origin main --allow-unrelated-histories

# Then push your changes
git push -u origin main
```

### Large file rejection
- Check file size: `git ls-files -s`
- Remove large files before committing
- Use Git LFS for files >50MB

---

## 📞 Support

Once Git is installed, the AI will:
1. Create all necessary .gitignore files
2. Initialize the repository
3. Guide you through first commit
4. Help resolve any issues
5. Set up branch protection (optional)

**Current Status:** Waiting for Git installation

---

**Last Updated:** April 25, 2026
