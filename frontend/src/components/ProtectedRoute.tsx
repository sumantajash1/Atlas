import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export function ProtectedRoute({ children, redirectTo = "/login" }: any) {
  const { user, loading } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   if (!loading && !user) {
  //     // Save the attempted URL to redirect back after login
  //     localStorage.setItem("redirectAfterLogin", location.pathname);
  //     navigate(redirectTo, { replace: true });
  //   }
  // }, [user, loading, navigate, redirectTo, location.pathname]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If not authenticated, don't render children
  if (!user) {
    return null;
  }

  // If authenticated, render the protected content
  return <>{children}</>;
}
