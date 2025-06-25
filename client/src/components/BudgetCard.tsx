import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Activity } from "@shared/schema";

interface BudgetCardProps {
  budget: string | null;
  activities: Activity[];
}

export function BudgetCard({ budget, activities }: BudgetCardProps) {
  const totalBudget = budget ? parseFloat(budget) : 0;
  const totalSpent = activities.reduce((sum, activity) => 
    sum + (activity.cost ? parseFloat(activity.cost) : 0), 0
  );

  const categorySpending = activities.reduce((acc, activity) => {
    if (activity.cost && activity.category) {
      acc[activity.category] = (acc[activity.category] || 0) + parseFloat(activity.cost);
    }
    return acc;
  }, {} as Record<string, number>);

  const spentPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "accommodation": return "🏨";
      case "food": return "🍽️";
      case "activities": return "🎫";
      case "transportation": return "🚗";
      default: return "📝";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-gray-900">Budget Overview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Budget</span>
            <span className="font-semibold text-gray-900">
              ${totalBudget.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total Spent</span>
            <span className="font-semibold text-travel-success">
              ${totalSpent.toFixed(2)}
            </span>
          </div>
          {totalBudget > 0 && (
            <>
              <Progress value={spentPercentage} className="w-full" />
              <div className="text-sm text-gray-500">
                ${totalSpent.toFixed(2)} of ${totalBudget.toLocaleString()} spent ({spentPercentage.toFixed(1)}%)
              </div>
            </>
          )}
        </div>

        {Object.keys(categorySpending).length > 0 && (
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            <div className="space-y-2">
              {Object.entries(categorySpending).map(([category, amount]) => (
                <div key={category} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">
                    {getCategoryIcon(category)} {category}
                  </span>
                  <span className="font-medium">${amount.toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
