import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const { data: userData, isPending } = useCurrentUser();
  const location = useLocation();

  // TODO add loader UI
  if (isPending) return null;

  const user = userData;

  if (!user) {
    return <Navigate to={"/"} replace state={{ from: location }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
