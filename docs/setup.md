# Corporate Learning System - Setup Guide

**Last Updated:** April 25, 2026  
**Phase:** Phase 1 - Local POC (Without Docker)

---

## Prerequisites

This guide will help you set up the development environment for the Corporate Learning System Phase 1 POC.

### System Requirements
- **Operating System:** Windows 10/11, macOS 10.15+, or Linux
- **RAM:** Minimum 8GB (16GB recommended)
- **Disk Space:** 5GB free space

---

## 1. Node.js Installation

### Installed Version
- **Node.js Version:** [To be documented after installation]
- **npm Version:** [To be documented after installation]
- **Installation Date:** [To be documented after installation]

### Installation Steps (Windows)
1. Visit https://nodejs.org
2. Download **Node.js 20 LTS** (Long Term Support)
3. Run the Windows installer (`.msi` file)
4. Follow the installation wizard:
   - Accept the license agreement
   - Choose default installation path
   - Select "Automatically install necessary tools" option
5. Restart your terminal/command prompt

### Verification
After installation, open a new terminal and run:
```bash
node --version
# Expected output: v20.x.x

npm --version
# Expected output: 10.x.x
```

### Troubleshooting
- If commands are not recognized, restart your computer
- Ensure Node.js is added to your system PATH
- Run as Administrator if you encounter permission issues

---

## 2. PostgreSQL Installation

### Installed Version
- **PostgreSQL Version:** [To be documented after installation]
- **Port:** 5432 (default)
- **Installation Date:** [To be documented after installation]

### Installation Steps (Windows)
1. Visit https://www.postgresql.org/download/windows/
2. Download **PostgreSQL 15** installer
3. Run the installer
4. Configuration during installation:
   - **Superuser Password:** Set to `postgres` (for development only)
   - **Port:** Keep default `5432`
   - **Locale:** Use default locale
5. Install pgAdmin (included in installer) for database management

### Verification
After installation, open Command Prompt and run:
```bash
psql --version
# Expected output: psql (PostgreSQL) 15.x
```

### Post-Installation Setup
1. Add PostgreSQL bin folder to PATH (if not automatic):
   - Default: `C:\Program Files\PostgreSQL\15\bin`
2. Test connection:
   ```bash
   psql -U postgres
   # Enter password: postgres
   # If successful, you'll see: postgres=#
   # Exit with: \q
   ```

### Troubleshooting
- If `psql` command not found, manually add to PATH
- Use pgAdmin GUI if command-line access fails
- Ensure PostgreSQL service is running (Services.msc on Windows)

---

## 3. Git Installation

### Installed Version
- **Git Version:** [To be documented after installation]
- **Installation Date:** [To be documented after installation]

### Installation Steps (Windows)
1. Visit https://git-scm.com
2. Download **Git for Windows**
3. Run the installer
4. Recommended settings:
   - Default editor: Choose your preference (VS Code recommended)
   - PATH environment: "Git from the command line and also from 3rd-party software"
   - Line ending conversions: "Checkout Windows-style, commit Unix-style"

### Configuration
After installation, configure your identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Verify configuration
git config --list
```

### Verification
```bash
git --version
# Expected output: git version 2.x.x
```

---

## 4. VS Code Installation

### Installed Version
- **VS Code Version:** [To be documented after installation]
- **Installation Date:** [To be documented after installation]

### Installation Steps (Windows)
1. Visit https://code.visualstudio.com
2. Download **VS Code** for Windows
3. Run the installer
4. Recommended options:
   - ✅ Add "Open with Code" action to context menu
   - ✅ Add to PATH
   - ✅ Register Code as editor for supported file types

### Required Extensions
After installing VS Code, install these extensions:

1. **ESLint** (`dbaeumer.vscode-eslint`)
   - JavaScript/TypeScript linting

2. **Prettier - Code formatter** (`esbenp.prettier-vscode`)
   - Code formatting

3. **TypeScript Vue Plugin (Volar)** or **ES7+ React snippets**
   - React development support

4. **PostgreSQL** (`ckolkman.vscode-postgres`)
   - Database management in VS Code

5. **GitLens** (`eamodio.gitlens`) - Optional but recommended
   - Enhanced Git integration

### Installing Extensions
Method 1 - Via VS Code UI:
- Open VS Code
- Click Extensions icon (Ctrl+Shift+X)
- Search for each extension name
- Click "Install"

Method 2 - Via Command Line:
```bash
code --install-extension dbaeumer.vscode-eslint
code --install-extension esbenp.prettier-vscode
code --install-extension ckolkman.vscode-postgres
```

---

## 5. Setup Verification Checklist

Run all these commands to verify your setup:

```bash
# Node.js & npm
node --version
npm --version

# PostgreSQL
psql --version

# Git
git --version

# VS Code (should open VS Code)
code --version
```

**Expected Results:**
- ✅ All commands execute without errors
- ✅ Version numbers display correctly
- ✅ VS Code opens when running `code`

---

## Next Steps

After completing this setup:

1. ✅ **Document your installed versions** above
2. 📝 Proceed to **Milestone 1.2: Backend "Hello World"**
3. 🚀 Start building the NestJS backend

---

## Troubleshooting Common Issues

### Node.js or npm not found
- Restart terminal
- Restart computer
- Manually add to PATH: `C:\Program Files\nodejs\`

### PostgreSQL connection refused
- Check service is running: `services.msc`
- Look for "postgresql-x64-15"
- Start the service if stopped

### Git bash vs Command Prompt
- Both work fine
- Git Bash provides Unix-like environment
- PowerShell recommended for Windows

### VS Code extensions not installing
- Check internet connection
- Reload VS Code window (Ctrl+Shift+P → "Reload Window")
- Install manually from VS Code Marketplace website

---

## Additional Resources

- **Node.js Documentation:** https://nodejs.org/docs
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/15/
- **Git Documentation:** https://git-scm.com/doc
- **VS Code Documentation:** https://code.visualstudio.com/docs

---

**Setup Status:** ❌ Not Started

Update this document as you complete each installation step.
