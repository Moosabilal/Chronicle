# Chronicle - Modern Blogging Platform

Chronicle is a beautiful, full-stack blogging platform that allows users to read, write, and manage stories. It features a rich text editor, user authentication, image uploads, search, pagination, and a highly polished UI.

## Features
- **User Authentication**: Secure sign up, log in, and password reset flows.
- **Create & Edit Posts**: Rich text editing with image cover uploads.
- **User Profiles**: Manage your profile picture, name, and view your authored posts.
- **Search & Pagination**: Find articles quickly with debounced search and pagination.
- **Responsive Design**: A premium, glassmorphism-inspired UI that works on all devices.

## Tech Stack
- **Frontend**: React, TypeScript, Vite, Zustand, GSAP (animations)
- **Backend**: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod (validation)
- **Image Storage**: Cloudinary

## Prerequisites
Before you begin, ensure you have installed:
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Local or Atlas)
- A [Cloudinary](https://cloudinary.com/) account for image uploads

## Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Moosabilal/Chronicle.git
cd Chronicle
```

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `backend` directory with the following variables:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The backend will be running on `http://localhost:5000`.*

### 3. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `frontend` directory:
   ```env
   VITE_API_URL=http://localhost:5000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The frontend will be running on `http://localhost:5173`.*

## License
MIT
