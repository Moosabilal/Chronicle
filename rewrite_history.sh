#!/bin/bash
set -e

# Delete current history and initialize fresh
rm -rf .git
git init

# Ensure we're on main branch (default might be master on some systems)
git checkout -b main || true

# Helper to commit safely
commit_if_changes() {
    if ! git diff --cached --quiet; then
        git commit -m "$1"
    fi
}

# 1. Initial Commit
git add .gitignore backend/.gitignore frontend/.gitignore || true
commit_if_changes "Initial commit: Project setup"

# 2. Backend Setup
git checkout -b feature/backend-setup
git add backend/package.json backend/package-lock.json backend/tsconfig.json backend/.env* backend/src/app.ts backend/src/server.ts backend/src/config/db.ts backend/src/config/env.ts || true
commit_if_changes "Backend setup: Initial express server and config"
git add backend/src/middlewares/error.middleware.ts backend/src/middlewares/validate.middleware.ts backend/src/utils/ || true
commit_if_changes "Backend setup: Error handling and utilities"
git checkout main
git merge --no-ff feature/backend-setup -m "Merge branch 'feature/backend-setup'"

# 3. Backend Auth
git checkout -b feature/backend-auth
git add backend/src/models/User.ts backend/src/validations/auth.validation.ts backend/src/middlewares/auth.middleware.ts || true
commit_if_changes "Backend Auth: User model and middlewares"
git add backend/src/interfaces/IUserRepository.ts backend/src/interfaces/services/IAuthService.ts backend/src/repositories/UserRepository.ts backend/src/repositories/BaseRepository.ts backend/src/interfaces/IBaseRepository.ts || true
commit_if_changes "Backend Auth: Repositories and interfaces"
git add backend/src/services/AuthService.ts backend/src/controllers/AuthController.ts backend/src/routes/auth.routes.ts backend/src/routes/index.ts backend/src/types/ || true
commit_if_changes "Backend Auth: Services, Controllers and Routes"
git checkout main
git merge --no-ff feature/backend-auth -m "Merge branch 'feature/backend-auth'"

# 4. Backend Blog
git checkout -b feature/backend-blog
git add backend/src/models/Blog.ts backend/src/models/Comment.ts backend/src/validations/blog.validation.ts || true
commit_if_changes "Backend Blog: Models and validations"
git add backend/src/interfaces/IBlogRepository.ts backend/src/interfaces/ICommentRepository.ts backend/src/repositories/BlogRepository.ts backend/src/repositories/CommentRepository.ts || true
commit_if_changes "Backend Blog: Repositories"
git add backend/src/interfaces/services/IBlogService.ts backend/src/interfaces/services/ICommentService.ts backend/src/services/BlogService.ts backend/src/services/CommentService.ts backend/src/controllers/BlogController.ts backend/src/controllers/CommentController.ts backend/src/routes/blog.routes.ts || true
commit_if_changes "Backend Blog: Services, Controllers and Routes"
git checkout main
git merge --no-ff feature/backend-blog -m "Merge branch 'feature/backend-blog'"

# 5. Backend DI and Upload
git checkout -b feature/backend-di-upload
git add backend/src/container/ backend/src/config/cloudinary.ts backend/src/interfaces/services/IUploadService.ts backend/src/services/UploadService.ts backend/src/controllers/UploadController.ts backend/src/middlewares/upload.middleware.ts || true
commit_if_changes "Backend DI: Inversify setup and Upload module"
git checkout main
git merge --no-ff feature/backend-di-upload -m "Merge branch 'feature/backend-di-upload'"

# 6. Frontend Setup
git checkout -b feature/frontend-setup
git add frontend/package.json frontend/package-lock.json frontend/tsconfig.* frontend/vite.config.ts frontend/index.html frontend/.oxlintrc.json frontend/README.md || true
commit_if_changes "Frontend setup: Vite react project init"
git add frontend/src/main.tsx frontend/src/App.tsx frontend/src/index.css frontend/src/App.css || true
commit_if_changes "Frontend setup: React entry points and global styles"
git add frontend/src/api/ frontend/src/store/ || true
commit_if_changes "Frontend setup: Axios config and Zustand store"
git checkout main
git merge --no-ff feature/frontend-setup -m "Merge branch 'feature/frontend-setup'"

# 7. Frontend Pages
git checkout -b feature/frontend-pages
git add frontend/src/layouts/ frontend/src/pages/LoginPage.tsx frontend/src/pages/RegisterPage.tsx frontend/src/pages/index.tsx || true
commit_if_changes "Frontend Pages: Main layout and Auth pages"
git add frontend/src/pages/FeedPage.tsx frontend/src/pages/ViewPostPage.tsx frontend/src/pages/CreatePostPage.tsx || true
commit_if_changes "Frontend Pages: Blog feed, view, and create pages"
git add frontend/src/services/ || true
commit_if_changes "Frontend Pages: API service classes"
git checkout main
git merge --no-ff feature/frontend-pages -m "Merge branch 'feature/frontend-pages'"

# 8. Frontend 3D Canvas
git checkout -b feature/3d-canvas
git add frontend/src/components/canvas/ || true
commit_if_changes "Frontend 3D: R3F Canvas and GSAP floating marbles"
git checkout main
git merge --no-ff feature/3d-canvas -m "Merge branch 'feature/3d-canvas'"

# 9. Catch-all for remaining files (assets, etc.)
git checkout -b feature/assets-cleanup
git add .
commit_if_changes "Cleanup: Add final assets and remaining files"
git checkout main
git merge --no-ff feature/assets-cleanup -m "Merge branch 'feature/assets-cleanup'"

# Setup remote and force push
git remote add origin https://github.com/Moosabilal/Chronicle.git
git push -u origin main --force

echo "History rewritten successfully!"
