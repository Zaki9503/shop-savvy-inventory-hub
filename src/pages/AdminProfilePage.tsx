import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth-context";
import { useData } from "@/lib/data-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Store } from "lucide-react";

const AdminProfilePage: React.FC = () => {
  const { user, isAuthenticated, updateUser } = useAuth();
  const { getShop, shops } = useData();
  const { toast } = useToast();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    storeName: "",
  });

  // Get the store associated with the user (if sub-admin)
  const userStore = user?.shopId ? getShop(user.shopId) : null;

  // Load user data into form when user data is available
  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || user.username || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar: user.avatar || "",
        storeName: userStore?.name || user.storeName || "",
      });
    }
  }, [user, userStore]);

  if (!isAuthenticated || !user) {
    return <div className="p-8">You must be logged in as admin.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, avatar: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update the user context with new information
    updateUser({ 
      ...user, 
      name: form.name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      avatar: form.avatar,
      storeName: form.storeName 
    });
    
    toast({ 
      title: "Success",
      description: "Profile updated successfully!",
      variant: "default"
    });

    // Navigate to dashboard after successful update
    navigate("/dashboard");
  };

  // Check if user is a sub-admin
  const isSubAdmin = user.role === 'sub_admin';

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold">Admin Profile</h2>
      
      {/* Store information card for sub-admin */}
      {(isSubAdmin && userStore) && (
        <Card className="mb-4">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center text-lg font-medium">
              <Store className="h-5 w-5 mr-2 text-primary" />
              Your Store
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <span className="text-sm font-medium">Store Name:</span>
              <p>{userStore.name}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Store Number:</span>
              <p>{userStore.shopNo}</p>
            </div>
            <div>
              <span className="text-sm font-medium">Address:</span>
              <p>{userStore.address}</p>
            </div>
            {userStore.phone && (
              <div>
                <span className="text-sm font-medium">Phone:</span>
                <p>{userStore.phone}</p>
              </div>
            )}
            {userStore.email && (
              <div>
                <span className="text-sm font-medium">Email:</span>
                <p>{userStore.email}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      
      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-xl font-bold mb-4">Edit Profile</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2">
            <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
              {form.avatar ? (
                <img src={form.avatar} alt="avatar" className="object-cover w-full h-full" />
              ) : (
                <span className="text-4xl flex items-center justify-center h-full w-full bg-gray-200">
                  {form.name ? form.name[0] : user.username ? user.username[0] : "U"}
                </span>
              )}
            </div>
            <label className="cursor-pointer text-sm">
              Edit Photo
              <Input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <Input name="name" value={form.name} onChange={handleChange} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input type="email" name="email" value={form.email} onChange={handleChange} required />
          </div>
          {isSubAdmin && !userStore && (
            <div>
              <label className="block text-sm font-medium mb-1">Store Name</label>
              <Input name="storeName" value={form.storeName} onChange={handleChange} />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <Input name="phone" value={form.phone} onChange={handleChange} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <Textarea name="address" value={form.address} onChange={handleChange} />
          </div>
          <Button type="submit" className="w-full">Save Changes</Button>
        </form>
      </div>
    </div>
  );
};

export default AdminProfilePage;
