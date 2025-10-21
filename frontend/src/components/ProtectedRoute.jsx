import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

export default function ProtectedLayout({ children }) {
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  if (!isAdmin) {
    return <Navigate to="/home" />;
  }

  return <>{children}</>;
}
