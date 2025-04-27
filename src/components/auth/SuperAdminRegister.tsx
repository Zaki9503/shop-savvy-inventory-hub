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

const formSchema = z.object({
  email: z.string().email('Invalid email address'),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export function SuperAdminRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    try {
      // TODO: Replace with actual API call
      // Simulating API call with timeout
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Store user data in localStorage for now
      // In a real app, this would be handled by your backend
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userExists = users.some(
        (user: any) => user.email === values.email || user.username === values.username
      );

      if (userExists) {
        toast({
          variant: "destructive",
          title: "Registration failed",
          description: "Email or username already exists",
        });
        return;
      }

      // Generate a unique ID with "sa_" prefix (sa = super admin)
      const userId = `sa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Create the new user with basic authentication details
      users.push({
        ...values,
        role: 'super_admin',
        id: userId,
      });
      localStorage.setItem('users', JSON.stringify(users));
      
      // Create a profile for the user
      const profileData = {
        name: values.username,
        email: values.email,
        phone: '',
        address: '',
        avatar: ''
      };
      
      localStorage.setItem(`profile_${userId}`, JSON.stringify(profileData));

      toast({
        title: "Super Admin Registration successful",
        description: "You will need your unique ID for sub-admin registration: " + userId,
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
        <CardTitle>Create Super Admin Account</CardTitle>
        <CardDescription>Enter your details to create a new super admin account</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Register'}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login here
          </Link>
        </div>
        <div className="text-xs text-gray-500 text-center">
          Note: After registration, your Super Admin ID will be displayed. You'll need this ID when creating sub-admin accounts.
        </div>
      </CardFooter>
    </Card>
  );
} 