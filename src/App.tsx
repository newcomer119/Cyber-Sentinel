import { ClerkProvider, SignIn} from '@clerk/clerk-react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import About from './pages/About';
import Compete from './pages/Compete';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

function App() {
  return (
    <ClerkProvider 
      publishableKey={CLERK_PUBLISHABLE_KEY}
      appearance={{
        elements: {
          formButtonPrimary: 'bg-cyber-red hover:bg-red-700',
          socialButtonsBlockButton: 'bg-white border border-gray-300 hover:bg-gray-50'
        }
      }}
    >
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <Navbar />
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route
                path="/compete"
                element={
                  <ProtectedRoute>
                    <Compete />
                  </ProtectedRoute>
                }
              />
              <Route 
                path="/sign-in/*" 
                element={
                  <div className="flex justify-center items-center min-h-[calc(100vh-64px)]">
                    <SignIn 
                      routing="path" 
                      path="/sign-in" 
                      appearance={{
                        elements: {
                          formButtonPrimary: 'bg-cyber-red hover:bg-red-700',
                          socialButtonsBlockButton: 'bg-white border border-gray-300 hover:bg-gray-50'
                        }
                      }}
                      afterSignInUrl="/"
                      
                      // socialAuth={{
                      //   strategy: 'google_oauth',
                      //   displayName: 'Continue with Google'
                      // }}
                    />
                  </div>
                } 
              />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </ClerkProvider>
  );
}

export default App;