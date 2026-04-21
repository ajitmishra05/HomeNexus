import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Button } from './ui/button';
import { useEffect, useState } from 'react';
import { ProfileMenu } from './ProfileMenu';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeSection, setActiveSection] = useState('hero');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  useEffect(() => {
    // Scroll to hash on mount or when location changes
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      if (element) {
        // slight delay to ensure render is complete
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    } else if (location.pathname === '/') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname !== '/') return;
      
      const sections = ['features', 'about', 'hero'];
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= window.innerHeight / 2) { // Trigger when section hits middle of screen
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    // Call once to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  const isActive = (section: string) => {
    if (location.pathname !== '/') return false;
    return activeSection === section;
  };

  const getLinkClasses = (section: string) => {
    const baseClasses = "text-sm font-medium transition-colors border-b-2 py-1 ";
    return baseClasses + (isActive(section) ? "text-primary border-primary" : "text-gray-600 border-transparent hover:text-primary");
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center gap-6">
            <Link to="/" className="text-2xl font-extrabold text-primary tracking-tight">
              HomeNexus
            </Link>
            
            {/* Global Links */}
            <div className="hidden md:flex space-x-6 ml-6">
              <Link to="/" className={getLinkClasses('hero')}>
                Home
              </Link>
              <a href="/#about" className={getLinkClasses('about')}>
                About
              </a>
              <a href="/#features" className={getLinkClasses('features')}>
                Services
              </a>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to={user.role === 'resident' ? '/resident' : '/provider'} className="hidden sm:block text-sm font-medium text-gray-600 hover:text-primary transition-colors">
                  Dashboard
                </Link>
                <Button variant="outline" size="sm" onClick={handleLogout} className="hidden sm:inline-flex border-gray-200 hover:bg-gray-50">
                  Logout
                </Button>
                <ProfileMenu />
              </>
            ) : (
              <>
                <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex text-primary hover:text-primary/80 hover:bg-primary/10">
                  <Link to="/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="hidden sm:inline-flex bg-primary hover:bg-primary/90 text-white">
                  <Link to="/signup">Join Now</Link>
                </Button>
              </>
            )}
            
            <div className="md:hidden flex items-center ml-2">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-gray-600 hover:text-primary focus:outline-none p-1">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-3 shadow-lg">
          <Link to="/" className={`block w-full ${getLinkClasses('hero')}`} onClick={() => setIsMobileMenuOpen(false)}>Home</Link>
          <a href="/#about" className={`block w-full ${getLinkClasses('about')}`} onClick={() => setIsMobileMenuOpen(false)}>About</a>
          <a href="/#features" className={`block w-full ${getLinkClasses('features')}`} onClick={() => setIsMobileMenuOpen(false)}>Services</a>
          {!user && (
            <div className="pt-2 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Sign In</Link>
              </Button>
              <Button asChild className="w-full">
                <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Join Now</Link>
              </Button>
            </div>
          )}
          {user && (
            <div className="pt-2 flex flex-col gap-2">
              <Button asChild variant="outline" className="w-full">
                <Link to={user.role === 'resident' ? '/resident' : '/provider'} onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
              </Button>
              <Button variant="outline" onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full border-gray-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-200">
                Logout
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
