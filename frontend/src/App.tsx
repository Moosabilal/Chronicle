import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { FeedPage } from './pages/FeedPage'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { CreatePostPage } from './pages/CreatePostPage'
import { ViewPostPage } from './pages/ViewPostPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<FeedPage />} />
          <Route path="/post/:slug" element={<ViewPostPage />} />
          <Route path="/write" element={<CreatePostPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
