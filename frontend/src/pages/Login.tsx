import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { Loader2, Lock, ArrowRight, Mail } from "lucide-react";
import { toast } from "sonner";
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const authContext = useContext(AuthContext);

  const { login, isLoading, isError, isSuccess, message, user } = authContext!;

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

    const userData = {
      email,
      password,
    };

    login(userData);
  };

  return (
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-career-gradient px-4 py-10 relative">
       {/* Animated Backplate Spotlight */}
       <div className="pointer-events-none absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-grid-soft"></div>
          
          <motion.div 
            animate={{ y: [0, -15, 0], opacity: [0.4, 0.6, 0.4] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
          />
          <motion.div 
             animate={{ y: [0, 15, 0], opacity: [0.4, 0.6, 0.4] }}
             transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
             className="absolute bottom-1/4 right-1/4 h-80 w-80 rounded-full bg-purple-500/10 blur-[120px]"
          />
       </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card border border-white/[0.05] rounded-3xl p-8 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg shadow-indigo-500/10">
              <Lock className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tighter text-white font-poppins">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Enter your credentials to access your workspace
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="email">Email</label>
              <div className="relative">
                 <Mail className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                 <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  placeholder="name@example.com"
                  onChange={onChange}
                  required
                  className="pl-11 w-full input-premium"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">Password</label>
                <Link to="#" className="text-xs text-indigo-400 hover:text-indigo-300 font-medium">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="••••••••"
                  onChange={onChange}
                  required
                  className="pl-11 w-full input-premium"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              className="w-full btn-gradient py-6 rounded-xl flex items-center justify-center font-extrabold text-xs shadow-md mt-6" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </>
              )}
            </Button>
          </form>
          
          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-xs text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-400 transition-colors hover:text-indigo-300 ml-1">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
