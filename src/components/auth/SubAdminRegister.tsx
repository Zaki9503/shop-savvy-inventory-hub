import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/components/ui/use-toast";
import { useData } from '@/lib/data-context';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/lib/auth-context';

// Form schema with validations for both user and store
const formSchema = z.object({
  // User fields
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  superAdminId: z.string().min(1, 'Super Admin selection is required'),
  
  // Store fields
  storeName: z.string().min(3, 'Store name must be at least 3 characters'),
  storeNumber: z.string().min(1, 'Store number is required'),
  storeAddress: z.string().min(5, 'Address must be at least 5 characters'),
  storePhone: z.string().optional(),
  storeEmail: z.string().email('Invalid store email').optional().or(z.literal('')),
});

export function SubAdminRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { addShop } = useData();
  const { getAllSuperAdmins } = useAuth();
  const [superAdmins, setSuperAdmins] = useState<Array<{id: string, username: string}>>([]);

  useEffect(() => {
    // Load super admins for the dropdown
    const admins = getAllSuperAdmins();
    setSuperAdmins(admins.map(admin => ({
      id: admin.id,
      username: admin.username
    })));
  }, [getAllSuperAdmins]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      superAdminId: '',
      storeName: '',
      storeNumber: '',
      storeAddress: '',
      storePhone: '',
      storeEmail: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      
      // Check if username or email already exists
      const userExists = users.some(
        (user: any) => user.email === values.email || user.username === values.username
      );

      if (userExists) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email or username already exists",
        });
        setIsLoading(false);
        return;
      }

      // Generate a unique ID for the Sub Admin
      const userId = `user_${Date.now()}`;
      
      // Create the store with reference to the Sub Admin and Super Admin
      const newStoreResult = addShop({
        name: values.storeName,
        storeNumber: values.storeNumber,
        address: values.storeAddress,
        managerId: userId, // Set the Sub Admin as the manager
        phone: values.storePhone || undefined,
        email: values.storeEmail || undefined,
        superAdminId: values.superAdminId // Link to the selected Super Admin
      });
      
      if (!newStoreResult.success) {
        toast({
          variant: "destructive",
          title: "Store creation failed",
          description: newStoreResult.error || "Could not create the store. Please try again.",
        });
        setIsLoading(false);
        return;
      }
      
      const newStore = newStoreResult.data!;
      
      // Create the new user with sub-admin role and link to the new store
      const newUser = {
        id: userId,
        username: values.username,
        email: values.email,
        password: values.password,
        role: 'sub_admin',
        shopId: newStore.id,
        superAdminId: values.superAdminId // Link to the selected Super Admin
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create a profile for the user
      const profileData = {
        name: values.username,
        email: values.email,
        phone: values.storePhone || '',
        address: values.storeAddress || '',
        avatar: '',
        storeName: values.storeName
      };
      
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));

      toast({
        title: "Registration successful",
        description: "Your account and store have been created. You can now log in with your credentials.",
      });

      // Redirect to login page after successful registration
      navigate('/login');
    } catch (error) {
      console.error('Registration failed:', error);
      toast({
        variant: "destructive",
        title: "Registration failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Create Sub Admin Account & Store</CardTitle>
        <CardDescription>Register as a Sub Admin and create your store</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Account Information</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your email" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your username" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="Enter your password" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="superAdminId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Select Super Admin</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a Super Admin" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {superAdmins.map((admin) => (
                            <SelectItem key={admin.id} value={admin.id}>
                              {admin.username}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h3 className="text-lg font-medium mb-4">Store Information</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storeName"
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
                    name="storeNumber"
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
                  name="storeAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Store Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter store address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="storePhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Phone (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter store phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="storeEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Store Email (Optional)</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Enter store email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
            </div>
            
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex justify-center">
        <div className="text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 