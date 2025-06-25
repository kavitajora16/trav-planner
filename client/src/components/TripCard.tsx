import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MapPin } from "lucide-react";
import { Trip } from "@shared/schema";
import { Link } from "wouter";

interface TripCardProps {
  trip: Trip;
}

export function TripCard({ trip }: TripCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-travel-blue text-white";
      case "completed":
        return "bg-gray-400 text-white";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getDuration = () => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
    return `${days} days`;
  };

  return (
    <Card className="hover:shadow-md transition-shadow overflow-hidden">
      {trip.imageUrl && (
        <img 
          src={trip.imageUrl} 
          alt={trip.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-gray-900 line-clamp-1">
            {trip.title}
          </h3>
          <Badge className={getStatusColor(trip.status || "planning")}>
            {trip.status || "planning"}
          </Badge>
        </div>
        
        <div className="flex items-center text-gray-600 mb-3">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="text-sm">{trip.destination}</span>
        </div>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
          </div>
          <span>{getDuration()}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="text-sm">
            <span className="text-gray-500">Budget: </span>
            <span className="font-semibold text-travel-success">
              ${trip.budget ? parseFloat(trip.budget).toLocaleString() : "Not set"}
            </span>
          </div>
          <Link href={`/planner/${trip.id}`}>
            <Button variant="ghost" size="sm" className="text-travel-blue hover:text-travel-deep">
              <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
