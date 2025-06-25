import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { AuthModal } from "./AuthModal";
import { useState } from "react";
import { MapPin, Menu, X } from "lucide-react";

export function Navbar() {
  const [location] = useLocation();
  const { user, signOut } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <>
      <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="flex items-center space-x-2">
                <MapPin className="text-travel-blue text-2xl" />
                <span className="text-xl font-bold text-gray-900">TravelPlan</span>
              </Link>
              <div className="hidden md:flex space-x-6">
                <Link href="/" className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                  location === "/" ? "text-travel-blue" : "text-gray-700 hover:text-travel-blue"
                }`}>
                  Home
                </Link>
                {user && (
                  <>
                    <Link href="/dashboard" className={`transition-colors px-3 py-2 rounded-md text-sm font-medium ${
                      location === "/dashboard" ? "text-travel-blue" : "text-gray-700 hover:text-travel-blue"
                    }`}>
                      My Trips
                    </Link>
                    <Link 
                      href="/dashboard?create=true"
                      className="transition-colors px-3 py-2 rounded-md text-sm font-medium text-gray-700 hover:text-travel-blue"
                    >
                      Plan Trip
                    </Link>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="hidden md:flex items-center space-x-4">
                  <span className="text-sm text-gray-700">Welcome, {user.displayName || user.email}</span>
                  <Button variant="outline" onClick={handleSignOut} size="sm">
                    Sign Out
                  </Button>
                </div>
              ) : (
                <div className="hidden md:flex items-center space-x-4">
                  <Button variant="ghost" onClick={() => setShowAuthModal(true)} size="sm">
                    Sign In
                  </Button>
                  <Button onClick={() => setShowAuthModal(true)} size="sm" className="bg-travel-blue hover:bg-travel-deep">
                    Get Started
                  </Button>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? <X /> : <Menu />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-4">
              <div className="space-y-2">
                <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-travel-blue">
                  Home
                </Link>
                {user ? (
                  <>
                    <Link href="/dashboard" className="block px-3 py-2 text-gray-700 hover:text-travel-blue">
                      My Trips
                    </Link>
                    <Link 
                      href="/dashboard?create=true"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-3 py-2 text-gray-700 hover:text-travel-blue"
                    >
                      Plan Trip
                    </Link>
                    <Button variant="outline" onClick={handleSignOut} className="w-full mt-2">
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <Button onClick={() => setShowAuthModal(true)} className="w-full mt-2 bg-travel-blue hover:bg-travel-deep">
                    Get Started
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  );
}
