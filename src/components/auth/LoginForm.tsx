import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/lib/auth-context';
import { useData } from '@/lib/data-context';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const formSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState<'admin' | 'sub_admin'>('admin');
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login } = useAuth();
  const { shops, setActiveShop } = useData();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Retrieve users from localStorage
      const usersString = localStorage.getItem('users');
      console.log("Retrieved users string:", usersString);
      
      const users = JSON.parse(usersString || '[]');
      console.log("All users:", users);
      console.log("Login attempt for:", { ...values, role: userType });

      // First check for matching credentials
      const user = users.find(
        (u: any) => u.username === values.username && u.password === values.password
      );
      
      console.log("User with matching credentials:", user);
      
      // Then check if role matches what was selected
      if (user && (user.role === userType || (userType === 'admin' && user.role === 'super_admin'))) {
        console.log("User matched with correct role:", user);
        
        let userData = {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role,
          shopId: user.shopId,
          name: user.name,
        };
        
        // For sub-admin users, get additional shop information
        if (user.role === 'sub_admin' && user.shopId) {
          // Find the shop managed by this sub-admin
          const managedShop = shops.find(shop => shop.id === user.shopId || shop.managerId === user.id);
          
          if (managedShop) {
            console.log("Sub-admin's managed shop:", managedShop);
            
            // Update userData with shop information
            userData = {
              ...userData,
              shopId: managedShop.id, // Ensure shopId is set
              shopName: managedShop.name,
              storeNumber: managedShop.storeNumber
            };
            
            // Set this shop as active in the data context
            setActiveShop(managedShop.id);
          }
        }
        
        // Save user data to context
        login(userData);
        
        // Set user data to localStorage for session persistence
        localStorage.setItem('currentUser', JSON.stringify(userData));
        
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        
        // Redirect to dashboard
        navigate('/dashboard');
      } else {
        if (!user) {
          console.log("No user found with these credentials");
        } else if (user.role !== userType) {
          console.log(`User found but role (${user.role}) doesn't match selected type (${userType})`);
        }
        
        toast({
          variant: "destructive",
          title: "Login failed",
          description: "Invalid credentials. Please try again.",
        });
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast({
        variant: "destructive",
        title: "Login failed",
        description: "Something went wrong. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="admin" className="w-full mb-4" onValueChange={(value) => setUserType(value as 'admin' | 'sub_admin')}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="admin">Super Admin</TabsTrigger>
            <TabsTrigger value="sub_admin">Sub Admin</TabsTrigger>
          </TabsList>
        </Tabs>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Don't have an account?{' '}
          <Link to="/register" className="text-primary hover:underline">
            Register as Super Admin
          </Link>
        </div>
        <div className="text-sm text-center">
          Want to register a new store?{' '}
          <Link to="/register-sub-admin" className="text-primary hover:underline">
            Register as Sub Admin & Create Store
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
} 