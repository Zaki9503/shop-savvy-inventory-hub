import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth-context";

const Index = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  // If still checking auth status, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h1 className="text-xl font-medium mb-2">Loading...</h1>
          <p className="text-gray-600">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }
  
  // If authenticated, navigate to dashboard (handled by layout)
  // If not authenticated, redirect to login
  return isAuthenticated ? null : <Navigate to="/login" replace />;
};

export default Index;
