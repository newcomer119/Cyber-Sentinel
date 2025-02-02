import { useClerk, useUser } from '@clerk/clerk-react';
import { Link } from 'react-router-dom';
import { Shield, Home, Info, LogIn, LogOut, Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useLeaderboard } from '../context/LeaderboardContext';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { signOut } = useClerk();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { addUser } = useLeaderboard();

  useEffect(() => {
    console.log('User object:', user);
    if (isSignedIn && user) {
      const username = user.username || user.email || user.firstName || user.lastName;
      console.log(`Adding user: ${username}`);
      addUser(username);
    }
  }, [isSignedIn, user, addUser]);

  return (
    <nav className="bg-cyber-black text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src="/android-chrome-512x512.png" 
                alt="CyberSentinel" 
                className="h-12 w-13"
              />
              <span className="font-bold text-xl text-white">CyberSentinel</span>
            </Link>
          </div>
          
          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-white hover:text-cyber-red transition-colors"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-1 hover:text-cyber-red transition-colors">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/compete" className="flex items-center space-x-1 hover:text-cyber-red transition-colors">
              <Shield className="h-5 w-5" />
              <span>Compete</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 hover:text-cyber-red transition-colors">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            
            {isSignedIn ? (
              <div className="flex items-center space-x-4">
                <span>{user.firstName}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-cyber-red transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center space-x-1 hover:text-cyber-red transition-colors"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden py-4 space-y-4">
            <Link to="/" className="flex items-center space-x-1 hover:text-cyber-red transition-colors py-2">
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link to="/compete" className="flex items-center space-x-1 hover:text-cyber-red transition-colors py-2">
              <Shield className="h-5 w-5" />
              <span>Compete</span>
            </Link>
            <Link to="/about" className="flex items-center space-x-1 hover:text-cyber-red transition-colors py-2">
              <Info className="h-5 w-5" />
              <span>About</span>
            </Link>
            
            {isSignedIn ? (
              <div className="flex flex-col space-y-4">
                <span>{user.firstName}</span>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-1 hover:text-cyber-red transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/sign-in"
                className="flex items-center space-x-1 hover:text-cyber-red transition-colors py-2"
              >
                <LogIn className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}