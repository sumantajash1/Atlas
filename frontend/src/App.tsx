import { Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/Home";
import Goals from "./pages/Goals";
import Account from "./pages/Account";
import Goal from "./pages/Goal";
import Calendar from "./pages/Calendar";
import NotFound from "./pages/NotFound";
import Sidebar from "./components/Sidebar";
import { LoginForm } from "./components/login-form";
import SignupForm from "./components/signup-form";
import { useUser } from "./context/UserContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { PublicRoute } from "./components/PublicRoute";
import AdditionalDetails from "./pages/AdditionalDetails";

function App() {
  const { user } = useUser();

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      {user && <Sidebar />}
      <div className={user ? "ml-16" : ""}>
        <Routes>
          {/* Public routes - accessible to everyone */}
          <Route path="/" element={<Home />} />

          {/* Protected routes - require authentication */}
          <Route
            path="/account"
            element={
              <ProtectedRoute>
                <Account />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
          <Route
            path="/goal/:id"
            element={
              <ProtectedRoute>
                <Goal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <Calendar />
              </ProtectedRoute>
            }
          />

          {/* Public routes - redirect if already authenticated */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginForm />
              </PublicRoute>
            }
          />
          <Route
            path="/sign-up"
            element={
              <PublicRoute>
                <SignupForm />
              </PublicRoute>
            }
          />
          <Route
            path="/additional-details"
            element={
              <ProtectedRoute>
                <AdditionalDetails />
              </ProtectedRoute>
            }
          />

          {/* 404 page - catch all unmatched routes */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </div>
  );
}
export default App;
