import { Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainLayout from "./layouts/MainLayout";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./routes/ProtectedRoute";
import CreatePostPage from "./pages/CreatePostPage";
import EditPostPage from "./pages/EditPostPage";
import NotFoundPage from "./components/feedback/NotFound";
import ProfilePage from "./pages/ProfilePage";
import PostPage from "./pages/PostPage";
import UserLikedPostsPage from "./pages/UserLikedPostsPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="posts/:postId" element={<PostPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<ProfilePage />} />
            <Route path="liked-post" element={<UserLikedPostsPage />} />
            <Route path="posts/create" element={<CreatePostPage />} />
            <Route path="posts/:postId/edit" element={<EditPostPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster position="top-right" theme="system" richColors />
    </>
  );
};

export default App;
