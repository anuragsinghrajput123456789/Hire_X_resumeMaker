import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState, useContext } from 'react';
import { cn } from '@/lib/utils';
import { 
  Menu, 
  X, 
  FileText, 
  Search, 
  Globe, 
  Mail, 
  MessageCircle,
  Sparkles,
  Brain,
  LogOut,
  User
} from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import AuthContext from '../context/AuthContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const authContext = useContext(AuthContext);
  const { user, logout } = authContext!;

  const navItems = [
    { path: '/generator', label: 'Generator', icon: FileText, description: 'Create Resume' },
    { path: '/analyzer', label: 'Analyzer', icon: Search, description: 'Analyze & Improve' },
    { path: '/job-match', label: 'Job Portals', icon: Globe, description: 'Find Perfect Jobs' },
    { path: '/cold-email', label: 'Cold Email', icon: Mail, description: 'Write Emails' },
    { path: '/chat', label: 'AI Chat', icon: MessageCircle, description: 'Career Assistant' }
  ];

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Enhanced Logo */}
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-3 text-2xl font-bold gradient-text hover:scale-105 transition-all duration-500 ease-out group"
            >
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg group-hover:shadow-xl transition-all duration-500 ease-out">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xl leading-none">AI Resume</span>
                <span className="text-lg leading-none font-semibold">Builder</span>
              </div>
              <span className="sm:hidden text-xl">AI Resume</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-500 ease-out hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg hover:shadow-xl"
                      : "text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20"
                  )}
                >
                  <Icon className={cn(
                    "w-5 h-5 transition-transform duration-400 ease-out",
                    isActive ? "text-white" : "group-hover:scale-110"
                  )} />
                  <div className="flex flex-col">
                    <span className="leading-none">{item.label}</span>
                    <span className={cn(
                      "text-xs leading-none opacity-75",
                      isActive ? "text-white/90" : "text-muted-foreground/80"
                    )}>
                      {item.description}
                    </span>
                  </div>
                  
                  {/* Active indicator */}
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl opacity-20 animate-pulse-glow" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right side - Theme Toggle, Auth, and Mobile Menu Button */}
          <div className="flex items-center space-x-4">
            <ThemeToggle />

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <User className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="hidden lg:flex items-center space-x-2">
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
            
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMenu}
              className="lg:hidden p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-400 ease-out hover:scale-105"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 text-primary transition-transform duration-300 ease-out" />
              ) : (
                <Menu className="h-6 w-6 text-primary transition-transform duration-300 ease-out" />
              )}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Navigation Menu */}
        <div
          className={cn(
            "lg:hidden overflow-hidden transition-all duration-700 ease-out",
            isMenuOpen
              ? "max-h-screen opacity-100 pb-6"
              : "max-h-0 opacity-0"
          )}
        >
          <div className="pt-4 space-y-3">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={cn(
                    "group flex items-center gap-4 px-4 py-4 rounded-xl text-sm font-medium transition-all duration-500 ease-out border-2 animate-fade-in hover:scale-[1.01]",
                    isActive
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-transparent shadow-lg"
                      : "text-muted-foreground hover:text-primary hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 border-border hover:border-primary/30"
                  )}
                  style={{animationDelay: `${index * 0.15}s`}}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-all duration-400 ease-out",
                    isActive 
                      ? "bg-white/20" 
                      : "bg-primary/10 group-hover:bg-primary/20 group-hover:scale-110"
                  )}>
                    <Icon className={cn(
                      "w-5 h-5",
                      isActive ? "text-white" : "text-primary"
                    )} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col">
                        <span className="leading-none font-semibold">{item.label}</span>
                        <span className={cn(
                          "text-xs leading-none mt-1",
                          isActive ? "text-white/90" : "text-muted-foreground"
                        )}>
                          {item.description}
                        </span>
                      </div>
                      
                      {isActive && (
                        <Sparkles className="w-5 h-5 text-white animate-pulse-glow" />
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
            {!user && (
              <div className="flex flex-col space-y-2 mt-4">
                <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="outline" className="w-full">Login</Button>
                </Link>
                <Link to="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button className="w-full">Register</Button>
                </Link>
              </div>
            )}
            {user && (
               <Button variant="destructive" className="w-full mt-4" onClick={() => {
                 onLogout();
                 setIsMenuOpen(false);
               }}>
                 Log out
               </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
