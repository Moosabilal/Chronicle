# Chronicle — Stories Worth Reading

[![Live Demo](https://img.shields.io/badge/Demo-chronicle.moosadev.online-success?style=for-the-badge&logo=vercel)](https://chronicle.moosadev.online)
[![GitHub Repository](https://img.shields.io/badge/GitHub-Moosabilal%2FChronicle-black?style=for-the-badge&logo=github)](https://github.com/Moosabilal/Chronicle)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)

**Chronicle** is a modern, cinematic, full-stack blogging platform architected for writers and thoughtful readers. Featuring a tactile, glassmorphic design and ambient 3D canvas physics, Chronicle delivers an editorial experience that prioritizes craft, clarity, and performance.

---

## 🌟 Key Features

- **Cinematic 3D Canvas**: Ambient floating marble geometries powered by React Three Fiber (`@react-three/fiber` & `@react-three/drei`) that react dynamically as readers scroll through stories.
- **Story Creation & Publishing**: Clean, distraction-free publishing flow supporting custom cover photos, excerpts, markdown-friendly story bodies, and tags.
- **Image Upload Integration**: Direct image uploads to Cloudinary with built-in client and server file-size validation (up to 10 MB).
- **User Authentication & Recovery**: Secure JWT authentication, password hashing with `bcryptjs`, and automated password reset workflows delivered via **Resend**.
- **User Profile & Story Management**: A dedicated profile dashboard allowing writers to update their avatar and name, alongside a "My Stories" tab to edit or delete their published posts.
- **Instant Search & Pagination**: 500ms debounced search scanning both article titles and excerpts, coupled with server-driven paginated grid browsing.
- **Interactive Discussion**: Nested comment threads populated with commenter avatars and timestamps.
- **Fully Responsive**: Crafted with modern mobile-first layouts supporting viewports down to 320px (Mobile-S) and a theme-adaptive book favicon that switches between light and dark browser modes.
- **Enterprise-Grade Architecture**: InversifyJS Dependency Injection graph separating Controllers, Services, and Repositories with strict Zod validation.

---

## 🛠️ Tech Stack

### Frontend
- **Framework & Language**: React 19, TypeScript
- **Bundler & Tooling**: Vite, Oxlint
- **3D & Animation**: Three.js, `@react-three/fiber`, `@react-three/drei`, GSAP
- **State & Routing**: Zustand, React Router DOM
- **HTTP Client**: Axios with global JWT authorization and error interceptors
- **Icons**: Lucide React

### Backend
- **Runtime & Framework**: Node.js, Express, TypeScript
- **Dependency Injection**: InversifyJS (`reflect-metadata`)
- **Database & ODM**: MongoDB, Mongoose
- **Validation**: Zod schema validation middleware
- **Authentication**: JSON Web Tokens (`jsonwebtoken`), `bcryptjs`, Node.js `crypto`
- **Integrations**: Cloudinary SDK (Media Storage), Resend SDK (Transactional Emails)

### Deployment & CI/CD
- **Frontend Hosting**: Vercel
- **Backend Hosting**: Render / AWS EC2
- **Automation**: GitHub Actions (Continuous Integration & Deployment)

---

## 📋 Prerequisites

Before running the project locally, make sure you have the following installed:
- [Node.js](https://nodejs.org/) (version 18.0.0 or higher)
- [npm](https://www.npmjs.com/) (version 9 or higher) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/) (running locally or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A free [Cloudinary](https://cloudinary.com/) account for image storage
- A free [Resend](https://resend.com/) account for transactional password reset emails

---

## 🚀 Local Development Setup

Follow these steps to clone and run Chronicle on your machine:

### 1. Clone the Repository
```bash
git clone https://github.com/Moosabilal/Chronicle.git
cd Chronicle
```

---

### 2. Backend Setup

1. Open your terminal and navigate to the `backend` directory:
   ```bash
   cd backend
   ```

2. Install backend dependencies:
   ```bash
   npm install
   ```

3. Create your environment configuration file:
   ```bash
   cp .env.example .env
   ```

4. Open `.env` and fill in your credentials:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=mongodb://localhost:27017/chronicle
   JWT_SECRET=your_super_secret_jwt_key_here
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   RESEND_API_KEY=re_your_resend_api_key_here
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend server will start on `http://localhost:5000` with active database connection logs.*

---

### 3. Frontend Setup

1. Open a new terminal tab/window and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Create the frontend environment configuration:
   ```bash
   touch .env
   ```

4. Add the backend API URL into `frontend/.env`:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```

5. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client app will launch at `http://localhost:5173`.*

---

## 📂 Project Architecture

```text
Chronicle/
├── backend/
│   ├── src/
│   │   ├── config/         # Environment schemas & Cloudinary configuration
│   │   ├── container/      # InversifyJS Dependency Injection bindings
│   │   ├── controllers/    # Request handlers (AuthController, BlogController, etc.)
│   │   ├── interfaces/     # TypeScript contracts for services and repositories
│   │   ├── middlewares/    # Authentication guard, Multer file upload, error handlers
│   │   ├── models/         # Mongoose models (User, Blog, Comment)
│   │   ├── repositories/   # Data access layer (BaseRepository, BlogRepository, etc.)
│   │   ├── routes/         # Express API route declarations
│   │   ├── services/       # Business logic (AuthService, BlogService, etc.)
│   │   ├── utils/          # AppError, catchAsync wrappers
│   │   └── validations/    # Zod input schemas
│   └── package.json
│
├── frontend/
│   ├── public/             # Static assets & theme-adaptive SVG favicon
│   ├── src/
│   │   ├── api/            # Axios instance with normalization & interceptors
│   │   ├── components/     # UI components & Three.js Canvas Scene
│   │   ├── layouts/        # Global layout with responsive navigation & modal dialogs
│   │   ├── pages/          # FeedPage, ViewPostPage, CreatePostPage, ProfilePage, Auth
│   │   ├── services/       # API services (AuthService, BlogService, UploadService)
│   │   └── store/          # Zustand authentication & profile store
│   └── package.json
│
├── .github/
│   └── workflows/          # GitHub Actions CI/CD deployment pipelines
├── Chronicle_Overview.pdf  # Project overview document
└── README.md
```

---

## 🌿 Git & Contribution Workflow

To maintain clean repository hygiene, all new features or bug fixes should follow standard Git feature branching:

1. **Create and switch to a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Stage and commit your changes**:
   ```bash
   git add .
   git commit -m "feat: describe your change in present tense"
   ```

3. **Keep your branch updated with main**:
   ```bash
   git checkout main
   git pull origin main
   git checkout feature/your-feature-name
   git merge main
   ```

4. **Merge and push to GitHub**:
   ```bash
   git checkout main
   git merge feature/your-feature-name
   git push origin main
   ```

---

## 🌐 Production Deployment

- **Frontend (Vercel)**: Automatically deploys on push to `main`. Ensure the `VITE_API_URL` environment variable in Vercel is set to your production backend endpoint (e.g. `https://chronicle-h6xs.onrender.com/api/v1`).
- **Backend (Render / AWS)**: Ensure all environment variables from `.env.example` are configured in your host settings with `NODE_ENV=production`.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
