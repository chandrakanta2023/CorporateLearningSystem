# GitHub Repository Setup Commands

## After Restarting VS Code

Once you've restarted VS Code (to pick up the new Git PATH), run these commands in the PowerShell terminal:

### Step 1: Configure Git User (One-Time Setup)
```powershell
git config --global user.name "Initial Setup"
git config --global user.email "chandrakanta_sahoo@persistent.com"
```

**Verify configuration:**
```powershell
git config --global --list
```

---

### Step 2: Initialize Git Repository
```powershell
# Navigate to project directory (if not already there)
cd C:\Technothon\Problem_Statement_3_Corporate_Learning

# Initialize Git
git init

# Verify initialization
ls -force .git
```

---

### Step 3: Add GitHub Remote
```powershell
# Add your GitHub repository as remote
git remote add origin https://github.com/chandrakanta2023/CorporateLearningSystem.git

# Verify remote was added
git remote -v
```

---

### Step 4: Review Files to Commit
```powershell
# Check repository status
git status

# See what will be committed
git status --short
```

**Expected files to commit:**
- ✅ Source code (.ts, .tsx files)
- ✅ Configuration files (package.json, tsconfig.json, etc.)
- ✅ Documentation (.md files)
- ✅ Setup scripts (.ps1 files)
- ✅ .env.example files
- ❌ node_modules/ (excluded by .gitignore)
- ❌ .env files (excluded - contains secrets!)
- ❌ dist/ folders (excluded - build outputs)

---

### Step 5: Stage All Files
```powershell
# Add all files (respecting .gitignore)
git add .

# Verify what's staged
git status
```

---

### Step 6: Create Initial Commit
```powershell
git commit -m "Initial commit: Corporate Learning System - Phase 1 POC

- Backend: NestJS with TypeORM and PostgreSQL
- Frontend: React + Vite with TypeScript
- Database: 4 entities (User, Course, Enrollment, Intervention)
- Infrastructure: Environment setup, health monitoring
- Documentation: Comprehensive guides and setup instructions"
```

---

### Step 7: Rename Branch to 'main' (if needed)
```powershell
# Check current branch
git branch

# Rename to 'main' if it's 'master'
git branch -M main
```

---

### Step 8: Push to GitHub
```powershell
# Push to GitHub (you'll need to authenticate)
git push -u origin main
```

**When prompted for authentication:**
- **Username:** chandrakanta2023
- **Password:** Use a Personal Access Token (PAT), NOT your GitHub password

---

## 🔐 Creating a Personal Access Token (Required)

If you don't have a Personal Access Token yet:

1. Go to: https://github.com/settings/tokens
2. Click **"Generate new token"** → **"Generate new token (classic)"**
3. Token name: `Corporate Learning System`
4. Expiration: Choose duration (90 days recommended)
5. Select scopes:
   - ✅ **repo** (Full control of private repositories)
6. Click **"Generate token"**
7. **COPY THE TOKEN** (you won't see it again!)
8. Use this token as the password when git push asks

---

## Alternative: Git Credential Manager

If authentication fails, configure Git Credential Manager:

```powershell
git config --global credential.helper wincred
```

This will store your credentials securely in Windows Credential Manager.

---

## Troubleshooting

### "git: command not found" (after restart)
```powershell
# Check if Git is in PATH
$env:PATH -split ';' | Select-String -Pattern 'Git'

# If not found, add manually (restart PowerShell after)
[Environment]::SetEnvironmentVariable("Path", $env:Path + ";C:\Program Files\Git\bin", "User")
```

### "Permission denied" when pushing
- Verify your GitHub username: chandrakanta2023
- Make sure you're using a Personal Access Token, not password
- Check token has `repo` scope

### "Repository not found"
- Verify repository exists: https://github.com/chandrakanta2023/CorporateLearningSystem.git
- Check if it's private (requires authentication)
- Verify remote URL: `git remote -v`

### "Updates were rejected"
If the repository already has commits:
```powershell
# Pull first, allowing unrelated histories
git pull origin main --allow-unrelated-histories

# Then push
git push -u origin main
```

---

## After Successful Push

### Verify on GitHub
1. Go to: https://github.com/chandrakanta2023/CorporateLearningSystem
2. You should see all your files
3. Check commit history
4. Review repository structure

### Update TODOlist.md
The AI will update the TODO list to mark Git tasks as complete:
- ✅ Git installed
- ✅ Repository initialized
- ✅ GitHub connected
- ✅ Initial commit pushed

---

## Daily Workflow (After Setup)

### Before Starting Work
```powershell
git pull origin main
```

### After Making Changes
```powershell
# Check what changed
git status

# Stage changes
git add .

# Commit with descriptive message
git commit -m "Add user authentication module"

# Push to GitHub
git push
```

### Check Commit History
```powershell
git log --oneline --graph --decorate --all
```

---

**Ready to proceed?** After restarting VS Code, run the commands above in sequence.

The AI will assist you with:
1. Running these commands
2. Handling authentication
3. Resolving any issues
4. Updating the TODO list
5. Proceeding with database setup

---

**Last Updated:** April 25, 2026
**User:** Initial Setup (chandrakanta_sahoo@persistent.com)
**Repository:** https://github.com/chandrakanta2023/CorporateLearningSystem.git
