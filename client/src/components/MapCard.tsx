import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, MapPin } from "lucide-react";
import { Activity } from "@shared/schema";

interface MapCardProps {
  activities: Activity[];
}

export function MapCard({ activities }: MapCardProps) {
  const locationsWithActivities = activities
    .filter(activity => activity.location)
    .map((activity, index) => ({
      location: activity.location!,
      activity: activity.title,
      color: `bg-travel-${index % 3 === 0 ? 'blue' : index % 3 === 1 ? 'success' : 'warning'}`,
    }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Today's Locations</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Placeholder map - in a real app, this would be Google Maps or Leaflet */}
        <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden relative mb-4">
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1577717903315-1691ae25ab3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400')"
            }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center">
              <div className="bg-white rounded-lg p-3 shadow-lg">
                <MapPin className="text-travel-blue text-xl" />
              </div>
            </div>
          </div>
        </div>

        {locationsWithActivities.length > 0 ? (
          <div className="space-y-2 mb-4">
            {locationsWithActivities.map((item, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className={`w-3 h-3 rounded-full ${
                  index % 3 === 0 ? 'bg-travel-blue' : 
                  index % 3 === 1 ? 'bg-travel-success' : 'bg-travel-warning'
                }`}></div>
                <span className="text-gray-600">{item.location}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-sm text-gray-500 mb-4 text-center py-4">
            No locations added yet
          </div>
        )}

        <Button 
          variant="outline" 
          className="w-full text-gray-700 hover:bg-gray-50"
          disabled={locationsWithActivities.length === 0}
        >
          <ArrowRight className="w-4 h-4 mr-2" />
          View Full Map
        </Button>
      </CardContent>
    </Card>
  );
}
