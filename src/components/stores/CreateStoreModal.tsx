import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useData } from '@/lib/data-context';
import { useAuth } from '@/lib/auth-context';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { v4 as uuidv4 } from 'uuid';

// Form schema with validation - base schema
const baseSchema = {
  name: z.string().min(3, 'Store name must be at least 3 characters'),
  storeNumber: z.string().min(1, 'Store number is required'),
  address: z.string().min(5, 'Address must be at least 5 characters'),
  phone: z.string().optional(),
  email: z.string().email('Invalid email format').optional().or(z.literal('')),
};

// For super-admin creating a store
const superAdminSchema = z.object({
  ...baseSchema,
  subAdminUsername: z.string().min(3, 'Username must be at least 3 characters'),
  subAdminPassword: z.string().min(8, 'Password must be at least 8 characters'),
  superAdminId: z.string().min(1, 'Super Admin ID is required'),
});

// For sub-admin creating their own store
const subAdminSchema = z.object({
  ...baseSchema,
});

export type CreateStoreModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
  forSubAdmin?: boolean;
  subAdminId?: string;
};

export function CreateStoreModal({ 
  open, 
  onOpenChange, 
  onSuccess,
  forSubAdmin = false,
  subAdminId
}: CreateStoreModalProps) {
  const { toast } = useToast();
  const { addShop } = useData();
  const { user, updateUser, getAllSuperAdmins } = useAuth();
  const [superAdmins, setSuperAdmins] = useState<Array<{id: string, username: string}>>([]);

  // Use the appropriate schema based on who's creating the store
  const formSchema = forSubAdmin ? subAdminSchema : superAdminSchema;

  useEffect(() => {
    // Load super admins for the dropdown
    if (!forSubAdmin) {
      const admins = getAllSuperAdmins();
      setSuperAdmins(admins.map(admin => ({
        id: admin.id,
        username: admin.username
      })));
    }
  }, [getAllSuperAdmins, forSubAdmin]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      storeNumber: '',
      address: '',
      phone: '',
      email: '',
      ...(forSubAdmin ? {} : {
        subAdminUsername: '',
        subAdminPassword: '',
        superAdminId: '',
      })
    },
  });

  async function onSubmit(values: any) {
    try {
      // Add the new shop
      const newShopResult = addShop({
        name: values.name,
        storeNumber: values.storeNumber,
        address: values.address,
        phone: values.phone || "",
        email: values.email || "",
        managerId: forSubAdmin ? subAdminId : undefined, // Use the sub-admin ID if provided
      });

      if (!newShopResult.success) {
        // Show error message from the operation result
        toast({
          variant: "destructive",
          title: "Failed to create store",
          description: newShopResult.error || "An error occurred while creating the store",
        });
        return;
      }

      const newShop = newShopResult.data!;

      if (!forSubAdmin) {
        // Super-admin creating a store with a new sub-admin account
        // Generate an ID for the sub-admin
        const newSubAdminId = uuidv4();

        // Check if sub-admin username already exists
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const existingUser = users.find((user: any) => user.username === values.subAdminUsername);

        if (existingUser) {
          form.setError("subAdminUsername", {
            message: "This username is already taken",
          });
          return;
        }

        // Add sub-admin user to users array
        users.push({
          id: newSubAdminId,
          username: values.subAdminUsername,
          password: values.subAdminPassword,
          role: "sub-admin",
          shopId: newShop.id,
          superAdminId: values.superAdminId, // Link to super admin
        });

        localStorage.setItem('users', JSON.stringify(users));

        // Create a profile for the sub-admin
        const profileData = {
          name: values.subAdminUsername,
          email: values.email || '',
          phone: values.phone || '',
          address: values.address,
          avatar: ''
        };
        
        localStorage.setItem(`profile_${newSubAdminId}`, JSON.stringify(profileData));

        toast({
          title: "Store Created Successfully",
          description: `${values.name} has been added with a sub-admin account`,
        });
      } else if (forSubAdmin && subAdminId) {
        // Sub-admin creating their own store
        // Update the user to link them to the new store
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const userIndex = users.findIndex((u: any) => u.id === subAdminId);
        
        if (userIndex !== -1) {
          users[userIndex].shopId = newShop.id;
          localStorage.setItem('users', JSON.stringify(users));
          
          // Also update the current user in context if applicable
          if (user && user.id === subAdminId) {
            updateUser({
              ...user,
              shopId: newShop.id
            });
          }
        }

        toast({
          title: "Store Created Successfully",
          description: `${values.name} has been created and assigned to your account`,
        });
      }

      // Reset form
      form.reset();

      // Close modal
      onOpenChange(false);

      // Call onSuccess callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating store:', error);
      toast({
        variant: "destructive",
        title: "Failed to create store",
        description: "An error occurred while creating the store",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[530px]">
        <DialogHeader>
          <DialogTitle>
            {forSubAdmin ? "Create Your Store" : "Create New Store"}
          </DialogTitle>
          <DialogDescription>
            {forSubAdmin 
              ? "Create a store that you will manage."
              : "Add a new store and create a sub-admin account for it."
            }
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[60vh]">
          <div className="p-1">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Store Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Store name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="storeNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Number</FormLabel>
                        <FormControl>
                          <Input placeholder="Store number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Input placeholder="Store address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Store phone number" {...field} />
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
                          <Input type="email" placeholder="Store email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {!forSubAdmin && (
                    <FormField
                      control={form.control}
                      name="superAdminId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Super Admin</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a Super Admin" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {superAdmins.map((admin) => (
                                <SelectItem key={admin.id} value={admin.id}>
                                  {admin.username} ({admin.id})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                {!forSubAdmin && (
                  <div className="space-y-4">
                    <h3 className="text-sm font-medium">Sub-Admin Account</h3>
                    
                    <FormField
                      control={form.control}
                      name="subAdminUsername"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username</FormLabel>
                          <FormControl>
                            <Input placeholder="Sub-admin username" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subAdminPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" placeholder="Sub-admin password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                  <Button type="submit">
                    {forSubAdmin ? "Create My Store" : "Create Store"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export default CreateStoreModal; 