
import React, { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

const AdminProfilePage: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    avatar: user?.avatar || "",
  });

  if (!isAuthenticated || !user) {
    return <div className="p-8">You must be logged in as admin.</div>;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file); // for demo only, in real app upload to backend
      setForm(f => ({ ...f, avatar: imgUrl }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Since data persistence is not implemented, we just show a toast for demo.
    toast({ description: "Profile updated successfully!", variant: "default" });
    // In a real app, would need to update the user in auth/data context and backend.
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="flex flex-col items-center gap-2">
          <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-100">
            {form.avatar ? (
              <img src={form.avatar} alt="avatar" className="object-cover w-full h-full" />
            ) : (
              <span className="text-4xl flex items-center justify-center h-full w-full bg-gray-200">
                {form.name[0]}
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
  );
};

export default AdminProfilePage;
