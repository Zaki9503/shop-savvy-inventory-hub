
import React from "react";
import { Link } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/lib/auth-context";

const AdminHeaderUser: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="flex items-center gap-2">
      <Link to="/admin-profile" className="focus:outline-none">
        <Avatar className="h-9 w-9">
          <AvatarImage src={user?.avatar} alt={user?.name} />
          <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
        </Avatar>
      </Link>
      <div className="hidden sm:block text-sm">
        <p className="font-semibold">{user?.name}</p>
        <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
      </div>
    </div>
  );
};

export default AdminHeaderUser;
