import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Loader2, UserPlus, ArrowRight, User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import { motion } from 'framer-motion';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const { name, email, password, confirmPassword } = formData;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { register, isLoading, isError, isSuccess, message, user } = authContext!;

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }
  }, [user, isError, isSuccess, message, navigate]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      const userData = {
        name,
        email,
        password,
      };

      register(userData);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 relative overflow-hidden">
       {/* Animated Background */}
       <div className="absolute inset-0 w-full h-full">
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-transparent to-transparent dark:from-indigo-900/30 opacity-70"></div>
          <div className="absolute bottom-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_left,_var(--tw-gradient-stops))] from-pink-100 via-transparent to-transparent dark:from-pink-900/30 opacity-70"></div>
          
          <motion.div 
            animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.7, 0.5] }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/3 right-1/4 w-96 h-96 bg-indigo-400/20 rounded-full blur-[100px]"
          />
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md px-4"
      >
        <Card className="border-0 shadow-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl ring-1 ring-gray-200 dark:ring-gray-700">
          <CardHeader className="space-y-1 pb-6">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-gradient-to-br from-indigo-500 to-pink-600 rounded-2xl shadow-lg">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-pink-600">
              Create Account
            </CardTitle>
            <CardDescription className="text-center text-gray-500 font-medium">
              Join thousands of professionals already hiring smarter
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
               <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                   <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                   <Input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    placeholder="John Doe"
                    onChange={onChange}
                    required
                    className="pl-10 h-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transaction-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                 <div className="relative">
                   <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                   <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    placeholder="name@example.com"
                    onChange={onChange}
                    required
                    className="pl-10 h-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transaction-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                   <Input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    placeholder="Create a password"
                    onChange={onChange}
                    required
                    className="pl-10 h-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transaction-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                 <div className="relative">
                   <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                   <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    placeholder="Confirm your password"
                    onChange={onChange}
                    required
                    className="pl-10 h-10 bg-white/50 dark:bg-gray-900/50 border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 transaction-all"
                  />
                </div>
              </div>
              <Button 
                 type="submit" 
                 className="w-full h-11 bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-700 hover:to-pink-700 transition-all duration-300 shadow-md hover:shadow-lg mt-2"
                 disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Get Started <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{' '}
              <Link to="/login" className="text-indigo-600 font-semibold hover:text-indigo-500 transition-colors">
                Log in
              </Link>
            </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default Register;
