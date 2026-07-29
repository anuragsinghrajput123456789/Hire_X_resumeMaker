import { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Button } from "@/components/ui/button";
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
  const register = authContext?.register || (async () => {});
  const isLoading = authContext?.isLoading || false;
  const isError = authContext?.isError || false;
  const isSuccess = authContext?.isSuccess || false;
  const message = authContext?.message || '';
  const user = authContext?.user || null;

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
    <div className="flex min-h-screen items-center justify-center overflow-hidden bg-career-gradient px-4 py-10 relative">
       {/* Animated Backplate Spotlight */}
       <div className="pointer-events-none absolute inset-0 w-full h-full">
          <div className="absolute inset-0 bg-grid-soft"></div>
          
          <motion.div 
            animate={{ scale: [1, 1.08, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 right-1/4 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px]"
          />
       </div>

      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="glass-card border border-white/[0.05] rounded-3xl p-8 shadow-2xl relative">
          <div className="flex justify-center mb-6">
            <div className="rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 p-3 shadow-lg shadow-indigo-500/10">
              <UserPlus className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold tracking-tighter text-white font-poppins">
              Create Account
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-1">
              Join thousands of professionals already hiring smarter
            </p>
          </div>

          <form onSubmit={onSubmit} className="space-y-4">
             <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider" htmlFor="name">Full Name</label>
              <div className="relative">
                 <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                 <input
                  type="text"
                  id="name"
                  name="name"
                  value={name}
                  placeholder="John Doe"
                  onChange={onChange}
                  required
                  className="pl-11 w-full input-premium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider" htmlFor="email">Email</label>
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

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider" htmlFor="password">Password</label>
              <div className="relative">
                 <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                 <input
                  type="password"
                  id="password"
                  name="password"
                  value={password}
                  placeholder="Create a password"
                  onChange={onChange}
                  required
                  className="pl-11 w-full input-premium"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-300 uppercase tracking-wider" htmlFor="confirmPassword">Confirm Password</label>
               <div className="relative">
                 <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                 <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  placeholder="Confirm password"
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
                  Creating account...
                </>
              ) : (
                <>
                  Get Started <ArrowRight className="ml-2 h-4 w-4 text-white" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-white/[0.04] text-center">
            <p className="text-xs text-slate-400 font-medium">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-indigo-400 transition-colors hover:text-indigo-300 ml-1">
                Log in
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
