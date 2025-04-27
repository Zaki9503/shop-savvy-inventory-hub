import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useData } from "@/lib/data-context";
import { Shop } from "@/lib/types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

// Form schema with validations
const formSchema = z.object({
  name: z.string().min(3, "Store name must be at least 3 characters"),
  shopNo: z.string().min(1, "Store number is required"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().optional(),
  email: z.string().email("Invalid email address").optional(),
  subAdminPassword: z.string().min(6, "Password must be at least 6 characters").optional()
});

type FormValues = z.infer<typeof formSchema>;

interface EditStoreModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  store: Shop | null;
}

const EditStoreModal: React.FC<EditStoreModalProps> = ({ open, onOpenChange, store }) => {
  const { updateShop } = useData();
  const { toast } = useToast();
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      shopNo: "",
      address: "",
      phone: "",
      email: "",
      subAdminPassword: ""
    }
  });
  
  // Reset form when store changes
  useEffect(() => {
    if (store) {
      form.reset({
        name: store.name,
        shopNo: store.shopNo,
        address: store.address,
        phone: store.phone || "",
        email: store.email || "",
        subAdminPassword: ""
      });
    }
  }, [store, form]);
  
  const onSubmit = async (values: FormValues) => {
    try {
      // Extract password to avoid unnecessary update if not changed
      const { subAdminPassword, ...storeData } = values;

      // Update the shop data
      const updateResult = updateShop(store!.id, {
        ...storeData,
        id: store!.id,
      });

      if (!updateResult.success) {
        // Show error from operation result
        toast({
          variant: "destructive",
          title: "Failed to update store",
          description: updateResult.error || "An error occurred while updating the store",
        });
        return;
      }

      // If there's a new password, update the sub-admin user
      if (subAdminPassword && store!.managerId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const updatedUsers = users.map((user: any) => {
          if (user.id === store!.managerId) {
            return {
              ...user,
              password: subAdminPassword,
            };
          }
          return user;
        });

        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      toast({
        title: "Store updated successfully",
        description: updateResult.success ? updateResult.message : "Store information has been updated",
      });

      form.reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating store:", error);
      toast({
        variant: "destructive",
        title: "Failed to update store",
        description: "An unexpected error occurred",
      });
    }
  };
  
  const getSubAdminUsername = () => {
    try {
      if (store?.managerId) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const subAdmin = users.find((user: any) => user.id === store.managerId);
        return subAdmin?.username || "Unknown";
      }
      return "No Sub Admin Assigned";
    } catch (error) {
      return "Error loading user data";
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Edit Store</DialogTitle>
          <DialogDescription>
            Update store information and Sub Admin account
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-4">
              <h3 className="text-sm font-medium">Store Information</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="shopNo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter store address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <div className="pt-2 space-y-4">
              <h3 className="text-sm font-medium">Sub Admin Account</h3>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="text-sm">
                  <span className="font-medium">Current Username:</span> {getSubAdminUsername()}
                </p>
              </div>
              
              <FormField
                control={form.control}
                name="subAdminPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>New Password (Optional)</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter new password to change" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit">Save Changes</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditStoreModal; 