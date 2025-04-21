import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-context";

const NotFound = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="flex items-center justify-center gap-2 mb-2">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">ShopSavvy</h1>
          </div>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg p-8 mb-6">
          <h2 className="text-6xl font-bold text-gray-900 mb-4">404</h2>
          <p className="text-xl text-gray-600 mb-6">
            Oops! We couldn't find the page you're looking for
          </p>
          
          <Button asChild className="w-full">
            <Link to={isAuthenticated ? "/" : "/login"}>
              {isAuthenticated ? "Back to Dashboard" : "Back to Login"}
            </Link>
          </Button>
        </div>
        
        <p className="text-sm text-gray-500">
          If you believe this is an error, please contact support
        </p>
      </div>
    </div>
  );
};

export default NotFound;
