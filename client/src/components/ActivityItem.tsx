import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2, GripVertical, MapPin } from "lucide-react";
import { Activity } from "@shared/schema";

interface ActivityItemProps {
  activity: Activity;
  onEdit: (activity: Activity) => void;
  onDelete: (id: number) => void;
  dragHandleProps?: any;
}

export function ActivityItem({ activity, onEdit, onDelete, dragHandleProps }: ActivityItemProps) {
  const getCategoryColor = (category: string | null) => {
    switch (category) {
      case "accommodation":
        return "bg-blue-100 text-blue-700";
      case "food":
        return "bg-orange-100 text-orange-700";
      case "activities":
        return "bg-green-100 text-green-700";
      case "transportation":
        return "bg-purple-100 text-purple-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getCategoryIcon = (category: string | null) => {
    switch (category) {
      case "accommodation":
        return "🏨";
      case "food":
        return "🍽️";
      case "activities":
        return "🎫";
      case "transportation":
        return "🚗";
      default:
        return "📝";
    }
  };

  return (
    <Card className="p-4 hover:shadow-sm transition-shadow cursor-move">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center space-x-3 mb-2">
            {activity.time && (
              <Badge variant="outline" className="text-travel-blue border-travel-blue">
                {activity.time}
              </Badge>
            )}
            <h4 className="font-semibold text-gray-900">{activity.title}</h4>
            {activity.category && (
              <Badge className={getCategoryColor(activity.category)}>
                {getCategoryIcon(activity.category)} {activity.category}
              </Badge>
            )}
          </div>
          {activity.location && (
            <div className="flex items-center text-gray-600 text-sm mb-2">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{activity.location}</span>
            </div>
          )}
          {activity.description && (
            <p className="text-gray-500 text-sm">{activity.description}</p>
          )}
        </div>
        <div className="flex items-center space-x-2 ml-4">
          {activity.cost && (
            <span className="text-sm font-medium text-travel-success">
              ${parseFloat(activity.cost).toFixed(2)}
            </span>
          )}
          <div className="flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(activity)}
              className="text-gray-400 hover:text-travel-blue h-8 w-8 p-0"
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(activity.id)}
              className="text-gray-400 hover:text-red-500 h-8 w-8 p-0"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
            <div {...dragHandleProps} className="flex items-center justify-center h-8 w-8 cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical className="h-3 w-3" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
