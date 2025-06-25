import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Wallet, MapPin, Plus, Play, Clock, DollarSign, TrendingUp, ChevronRight, ArrowRight } from "lucide-react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { AuthModal } from "@/components/AuthModal";

export default function Home() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeDemo, setActiveDemo] = useState<'itinerary' | 'budget' | 'map' | null>(null);
  
  // Demo data for interactive features
  const demoItinerary = [
    { time: "9:00 AM", activity: "Visit Eiffel Tower", duration: "2 hours", type: "sightseeing" },
    { time: "11:30 AM", activity: "Seine River Cruise", duration: "1.5 hours", type: "leisure" },
    { time: "2:00 PM", activity: "Louvre Museum", duration: "3 hours", type: "culture" },
    { time: "7:00 PM", activity: "Dinner at Le Comptoir", duration: "2 hours", type: "dining" }
  ];

  const demoBudget = {
    total: 2500,
    spent: 1650,
    categories: [
      { name: "Accommodation", budget: 800, spent: 600, color: "bg-blue-500" },
      { name: "Food", budget: 600, spent: 450, color: "bg-green-500" },
      { name: "Activities", budget: 500, spent: 400, color: "bg-purple-500" },
      { name: "Transport", budget: 400, spent: 200, color: "bg-orange-500" },
      { name: "Shopping", budget: 200, spent: 0, color: "bg-pink-500" }
    ]
  };

  const demoLocations = [
    { name: "Eiffel Tower", coordinates: [48.8584, 2.2945], type: "landmark" },
    { name: "Louvre Museum", coordinates: [48.8606, 2.3376], type: "museum" },
    { name: "Notre-Dame", coordinates: [48.8530, 2.3499], type: "historic" },
    { name: "Montmartre", coordinates: [48.8867, 2.3431], type: "district" }
  ];

  const handleGetStarted = () => {
    if (user) {
      // Navigate to dashboard if logged in
      setLocation("/dashboard");
    } else {
      setShowAuthModal(true);
    }
  };

  const handlePlanTrip = () => {
    if (user) {
      // Navigate to dashboard and auto-open create dialog
      setLocation("/dashboard?create=true");
    } else {
      setShowAuthModal(true);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative">
        <div 
          className="h-screen bg-cover bg-center relative"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-40"></div>
          <div className="relative z-10 flex items-center justify-center h-full">
            <div className="text-center text-white max-w-4xl mx-auto px-4">
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Plan Your Perfect <span className="text-travel-warning">Adventure</span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
                Create detailed itineraries, track budgets, and discover amazing destinations all in one place
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-travel-blue text-white px-8 py-4 text-lg font-semibold hover:bg-travel-deep transition-all duration-300 transform hover:scale-105 shadow-lg"
                >
                  <Plus className="mr-2" />
                  Create New Trip
                </Button>
                <Button 
                  onClick={handlePlanTrip}
                  variant="outline"
                  size="lg"
                  className="border-2 border-white text-white px-8 py-4 text-lg font-semibold hover:bg-white hover:text-gray-900 transition-all duration-300"
                >
                  <Play className="mr-2" />
                  Plan Trip
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Everything You Need to Plan</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From itinerary planning to budget tracking, we've got all the tools to make your trip planning effortless
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Smart Itinerary Demo */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-travel-blue bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-blue group-hover:text-white transition-all">
                    <Calendar className="text-travel-blue group-hover:text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Itinerary</h3>
                  <p className="text-gray-600 mb-4">
                    AI-powered day planning with time optimization and activity suggestions
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-travel-blue hover:text-travel-deep"
                    onClick={() => setActiveDemo(activeDemo === 'itinerary' ? null : 'itinerary')}
                  >
                    {activeDemo === 'itinerary' ? 'Hide Demo' : 'See Demo'} <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                {activeDemo === 'itinerary' && (
                  <div className="border-t bg-gray-50 p-4 space-y-3">
                    <h4 className="font-semibold text-sm text-gray-900 mb-3">Paris - Day 1</h4>
                    {demoItinerary.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="text-xs font-medium text-travel-blue bg-travel-blue bg-opacity-10 px-2 py-1 rounded">
                            {item.time}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{item.activity}</div>
                            <div className="text-xs text-gray-500">{item.duration}</div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Budget Tracking Demo */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-travel-success bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-success group-hover:text-white transition-all">
                    <Wallet className="text-travel-success group-hover:text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Budget Tracking</h3>
                  <p className="text-gray-600 mb-4">
                    Real-time expense tracking with category breakdowns and spending alerts
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-travel-success hover:text-green-700"
                    onClick={() => setActiveDemo(activeDemo === 'budget' ? null : 'budget')}
                  >
                    {activeDemo === 'budget' ? 'Hide Demo' : 'See Demo'} <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                {activeDemo === 'budget' && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Total Budget</span>
                        <span className="text-sm font-bold">${demoBudget.spent} / ${demoBudget.total}</span>
                      </div>
                      <Progress value={(demoBudget.spent / demoBudget.total) * 100} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        ${demoBudget.total - demoBudget.spent} remaining
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {demoBudget.categories.map((cat, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-3 h-3 rounded-full ${cat.color}`}></div>
                            <span>{cat.name}</span>
                          </div>
                          <span className="font-medium">${cat.spent}/${cat.budget}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Interactive Maps Demo */}
            <Card className="group cursor-pointer hover:shadow-xl transition-all duration-300 border-0 overflow-hidden">
              <CardContent className="p-0">
                <div className="p-6 text-center">
                  <div className="w-16 h-16 bg-travel-purple bg-opacity-10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-travel-purple group-hover:text-white transition-all">
                    <MapPin className="text-travel-purple group-hover:text-white text-2xl" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">Interactive Maps</h3>
                  <p className="text-gray-600 mb-4">
                    Visual trip planning with route optimization and location discovery
                  </p>
                  <Button 
                    variant="ghost" 
                    className="text-travel-purple hover:text-purple-700"
                    onClick={() => setActiveDemo(activeDemo === 'map' ? null : 'map')}
                  >
                    {activeDemo === 'map' ? 'Hide Demo' : 'See Demo'} <ChevronRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
                
                {activeDemo === 'map' && (
                  <div className="border-t bg-gray-50 p-4">
                    <div className="bg-gradient-to-br from-blue-100 to-purple-100 h-32 rounded-lg mb-3 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <MapPin className="text-travel-purple mx-auto mb-1" size={24} />
                          <div className="text-xs font-medium text-gray-700">Paris, France</div>
                        </div>
                      </div>
                      {/* Simulated map pins */}
                      <div className="absolute top-2 left-4 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="absolute top-6 right-6 w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="absolute bottom-4 left-6 w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="absolute bottom-2 right-4 w-2 h-2 bg-yellow-500 rounded-full"></div>
                    </div>
                    
                    <div className="space-y-2">
                      {demoLocations.map((location, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-white rounded text-xs">
                          <div className="flex items-center space-x-2">
                            <div className={`w-2 h-2 rounded-full ${
                              index === 0 ? 'bg-red-500' : 
                              index === 1 ? 'bg-blue-500' : 
                              index === 2 ? 'bg-green-500' : 'bg-yellow-500'
                            }`}></div>
                            <span className="font-medium">{location.name}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {location.type}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Live Features Demo Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">See It In Action</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the full power of our travel planning tools with real trip examples
            </p>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Complete Trip Planning Workflow</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-travel-blue rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Create Your Trip</h4>
                    <p className="text-gray-600 text-sm">Set destination, dates, and budget preferences</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-travel-success rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Plan Activities</h4>
                    <p className="text-gray-600 text-sm">Add and organize activities with drag-and-drop scheduling</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-travel-purple rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Track Budget</h4>
                    <p className="text-gray-600 text-sm">Monitor expenses and stay within budget automatically</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-travel-warning rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-sm font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Visualize Routes</h4>
                    <p className="text-gray-600 text-sm">See your destinations on interactive maps with optimized routes</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8">
                <Button 
                  onClick={handleGetStarted}
                  size="lg"
                  className="bg-travel-blue text-white hover:bg-travel-deep"
                >
                  Start Planning Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-xl p-6">
              <div className="mb-4">
                <h4 className="font-semibold text-gray-900 mb-2">Sample Trip Dashboard</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Total Budget</div>
                    <div className="text-lg font-bold text-travel-blue">$2,500</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-500 mb-1">Days Planned</div>
                    <div className="text-lg font-bold text-travel-success">7 days</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-travel-blue rounded-full"></div>
                    <span className="text-sm font-medium">Eiffel Tower Visit</span>
                  </div>
                  <span className="text-xs text-gray-500">Day 1</span>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-travel-success rounded-full"></div>
                    <span className="text-sm font-medium">Louvre Museum</span>
                  </div>
                  <span className="text-xs text-gray-500">Day 2</span>
                </div>
                
                <div className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-travel-purple rounded-full"></div>
                    <span className="text-sm font-medium">Seine River Cruise</span>
                  </div>
                  <span className="text-xs text-gray-500">Day 3</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Budget Used</span>
                  <span className="font-semibold text-travel-blue">66%</span>
                </div>
                <Progress value={66} className="mt-2 h-2" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <AuthModal open={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </div>
  );
}
