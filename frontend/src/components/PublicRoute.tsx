import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@/context/UserContext";

export function PublicRoute({ children, redirectTo = "/" }: any) {
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user) {
      // Check if there's a saved redirect URL
      const savedRedirect = localStorage.getItem("redirectAfterLogin");
      if (savedRedirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(savedRedirect, { replace: true });
      } else {
        navigate(redirectTo, { replace: true });
      }
    }
  }, [user, loading, navigate, redirectTo]);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-950">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // If authenticated, don't render children (will redirect)
  if (user) {
    return null;
  }

  // If not authenticated, render the public content
  return <>{children}</>;
}
