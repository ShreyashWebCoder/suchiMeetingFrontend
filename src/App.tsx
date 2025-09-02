import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import UserDashboard from "./pages/UserDashboard";
import VividhksetraDashboard from "./pages/VividhksetraDashboard";
import NotFound from "./pages/NotFound";
import Report from "./pages/Report";
import PratinidhiReport from "./pages/PratinidhiReport";
import { ToastContainer } from "react-toastify";
import ViewDropdown from "./pages/ViewDropdown";
import "react-toastify/dist/ReactToastify.css";
import UserList from "./pages/Userlist";
import SanghatanUserList from "./pages/SanghatanUserList";
import PrantPracharakReport from "./pages/PrantPracharakReport";
import AbBaithakReport from "./pages/AbBaithakReport";

const queryClient = new QueryClient();

// Protected Route Component
const AuthRoute = ({ children }: { children: React.ReactNode }) => {
  const userType = localStorage.getItem("userType");

  // If user is already logged in, redirect them to their dashboard
  if (userType === "admin") {
    return <Navigate to="/admin-dashboard" replace />;
  } else if (userType === "user") {
    return <Navigate to="/user-dashboard" replace />;
  } else if (userType === "vividhksetra") {
    return <Navigate to="/vividhksetra-dashboard" replace />;
  }

  // Otherwise show the login page
  return <>{children}</>;
};

const ProtectedRoute = ({
  children,
  allowedUserType,
}: {
  children: React.ReactNode;
  allowedUserType: string;
}) => {
  const userType = localStorage.getItem("userType");

  if (!userType) {
    return <Navigate to="/login" replace />;
  }

  if (userType !== allowedUserType) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />

          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedUserType="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/material-requisition"
            element={
              <ProtectedRoute allowedUserType="admin">
                <Index />
              </ProtectedRoute>
            }
          />
          <Route
            path="/report"
            element={
              <ProtectedRoute allowedUserType="admin">
                <Report />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pratinidhi-report"
            element={
              <ProtectedRoute allowedUserType="admin">
                <PratinidhiReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/prant-pracharak-report"
            element={
              <ProtectedRoute allowedUserType="admin">
                <PrantPracharakReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/ab-baithak-report"
            element={
              <ProtectedRoute allowedUserType="admin">
                <AbBaithakReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/view-dropdown/:type"
            element={
              <ProtectedRoute allowedUserType="admin">
                <ViewDropdown />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user-dashboard"
            element={
              <ProtectedRoute allowedUserType="user">
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vividhksetra-dashboard"
            element={
              <ProtectedRoute allowedUserType="vividhksetra">
                <VividhksetraDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/userlist"
            element={
              <ProtectedRoute allowedUserType="user">
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sanghatanuserlist"
            element={
              <ProtectedRoute allowedUserType="vividhksetra">
                <SanghatanUserList />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
