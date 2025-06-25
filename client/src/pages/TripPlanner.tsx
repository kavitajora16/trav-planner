import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useTrip } from "@/contexts/TripContext";
import { useEffect, useState } from "react";
import { Trip, Activity } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Plus } from "lucide-react";
import { ActivityItem } from "@/components/ActivityItem";
import { BudgetCard } from "@/components/BudgetCard";
import { MapCard } from "@/components/MapCard";
import { Link } from "wouter";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertActivitySchema } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const activityFormSchema = insertActivitySchema.extend({
  title: z.string().min(1, "Title is required"),
  day: z.number().min(1),
  cost: z.string().optional(),
  category: z.string().optional(),
}).omit({
  orderIndex: true,
  createdAt: true,
});

export default function TripPlanner() {
  const { id } = useParams();
  const { user } = useAuth();
  const { state, dispatch, getDayActivities, getTripDuration } = useTrip();
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const { toast } = useToast();

  const { data: trip, isLoading: tripLoading } = useQuery<Trip>({
    queryKey: [`/api/trips/${id}`],
    enabled: !!id,
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery<Activity[]>({
    queryKey: [`/api/trips/${id}/activities`],
    enabled: !!id,
  });

  const createActivityMutation = useMutation({
    mutationFn: async (data: z.infer<typeof activityFormSchema>) => {
      const response = await apiRequest("POST", "/api/activities", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${id}/activities`] });
      setShowActivityDialog(false);
      setEditingActivity(null);
      toast({ title: "Activity saved successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to save activity", variant: "destructive" });
    },
  });

  const updateActivityMutation = useMutation({
    mutationFn: async ({ activityId, data }: { activityId: number; data: Partial<Activity> }) => {
      console.log("Updating activity:", activityId, "with data:", data);
      const response = await apiRequest("PUT", `/api/activities/${activityId}`, data);
      return response.json();
    },
    onSuccess: (result) => {
      console.log("Update successful:", result);
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${id}/activities`] });
      setShowActivityDialog(false);
      setEditingActivity(null);
      form.reset();
      toast({ title: "Activity updated successfully!" });
    },
    onError: (error) => {
      console.error("Update failed:", error);
      toast({ title: "Failed to update activity", variant: "destructive" });
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (activityId: number) => {
      await apiRequest("DELETE", `/api/activities/${activityId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/trips/${id}/activities`] });
      toast({ title: "Activity deleted successfully!" });
    },
    onError: () => {
      toast({ title: "Failed to delete activity", variant: "destructive" });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: async ({ day, activityIds }: { day: number; activityIds: number[] }) => {
      await apiRequest("PUT", `/api/trips/${id}/activities/reorder`, { day, activityIds });
    },
  });

  useEffect(() => {
    if (trip) {
      dispatch({ type: "SET_SELECTED_TRIP", payload: trip });
    }
  }, [trip, dispatch]);

  useEffect(() => {
    if (activities) {
      dispatch({ type: "SET_ACTIVITIES", payload: activities });
    }
  }, [activities, dispatch]);

  // Set initial selected day to 1
  useEffect(() => {
    dispatch({ type: "SET_SELECTED_DAY", payload: 1 });
  }, [dispatch]);

  const form = useForm<z.infer<typeof activityFormSchema>>({
    resolver: zodResolver(activityFormSchema),
    defaultValues: {
      tripId: parseInt(id!),
      title: "",
      description: "",
      location: "",
      day: state.selectedDay,
      time: "",
      cost: "",
      category: "",
    },
  });

  useEffect(() => {
    if (editingActivity) {
      form.reset({
        tripId: editingActivity.tripId,
        title: editingActivity.title,
        description: editingActivity.description || "",
        location: editingActivity.location || "",
        day: editingActivity.day,
        time: editingActivity.time || "",
        cost: editingActivity.cost || "",
        category: editingActivity.category || "",
      });
    } else {
      form.reset({
        tripId: parseInt(id!),
        title: "",
        description: "",
        location: "",
        day: state.selectedDay,
        time: "",
        cost: "",
        category: "",
      });
    }
  }, [editingActivity, state.selectedDay, id, form]);

  const onSubmit = (data: z.infer<typeof activityFormSchema>) => {
    console.log("Form submitted with data:", data);
    console.log("Editing activity:", editingActivity);
    
    if (editingActivity) {
      const updateData = {
        ...data,
        tripId: editingActivity.tripId, // Ensure tripId is preserved
        day: data.day || editingActivity.day, // Preserve day if not set
      };
      console.log("Update data:", updateData);
      updateActivityMutation.mutate({ activityId: editingActivity.id, data: updateData });
    } else {
      createActivityMutation.mutate(data);
    }
  };

  const handleEditActivity = (activity: Activity) => {
    setEditingActivity(activity);
    setShowActivityDialog(true);
  };

  const handleDeleteActivity = (activityId: number) => {
    deleteActivityMutation.mutate(activityId);
  };

  // Reset form when dialog opens for new activity
  const handleAddActivity = () => {
    setEditingActivity(null);
    form.reset({
      title: "",
      description: "",
      location: "",
      day: state.selectedDay,
      time: "",
      cost: "",
      category: "activities",
      tripId: parseInt(id || "0"),
    });
    setShowActivityDialog(true);
  };

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    if (sourceIndex === destinationIndex) return;

    const dayActivities = getDayActivities(state.selectedDay);
    const reorderedActivities = Array.from(dayActivities);
    const [movedActivity] = reorderedActivities.splice(sourceIndex, 1);
    reorderedActivities.splice(destinationIndex, 0, movedActivity);

    // Update local state immediately for smooth UX
    const updatedActivities = reorderedActivities.map((activity, index) => ({
      ...activity,
      orderIndex: index,
    }));

    dispatch({
      type: "REORDER_ACTIVITIES",
      payload: { day: state.selectedDay, activities: updatedActivities },
    });

    // Sync with backend
    reorderMutation.mutate({
      day: state.selectedDay,
      activityIds: reorderedActivities.map(a => a.id),
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Please sign in to access trip planner</h1>
        </div>
      </div>
    );
  }

  if (tripLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-travel-blue mx-auto mb-4"></div>
          <p className="text-gray-600">Loading trip details...</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Trip not found</h1>
          <p className="text-gray-600 mb-4">Trip ID: {id}</p>
          <Link href="/dashboard">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate trip duration manually if trip context isn't working
  const tripDuration = trip ? Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1 : 1;
  
  // Get activities for selected day directly from loaded activities
  const dayActivities = activities?.filter(activity => activity.day === state.selectedDay) || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="text-xl" />
              </Button>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">{trip.title}</h1>
          </div>
          <p className="text-gray-600">
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()} • {tripDuration} days
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Itinerary Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>Daily Itinerary</CardTitle>
                  <Button 
                    onClick={handleAddActivity}
                    className="bg-travel-blue hover:bg-travel-deep"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Activity
                  </Button>
                </div>
                <div className="flex space-x-1 mt-4 overflow-x-auto">
                  {Array.from({ length: tripDuration }, (_, i) => i + 1).map((day) => (
                    <Button
                      key={day}
                      variant={state.selectedDay === day ? "default" : "ghost"}
                      size="sm"
                      onClick={() => dispatch({ type: "SET_SELECTED_DAY", payload: day })}
                      className={`whitespace-nowrap ${
                        state.selectedDay === day 
                          ? "bg-travel-blue text-white" 
                          : "text-gray-600 hover:text-travel-blue"
                      }`}
                    >
                      Day {day}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {activitiesLoading ? (
                  <div className="text-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-travel-blue mx-auto mb-2"></div>
                    <p className="text-gray-600">Loading activities...</p>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="activities">
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                          {dayActivities.map((activity, index) => (
                            <Draggable key={activity.id} draggableId={activity.id.toString()} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                >
                                  <ActivityItem
                                    activity={activity}
                                    onEdit={handleEditActivity}
                                    onDelete={handleDeleteActivity}
                                    dragHandleProps={provided.dragHandleProps}
                                  />
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                          {dayActivities.length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                              <p className="mb-4">No activities planned for Day {state.selectedDay}</p>
                              <Button 
                                variant="outline"
                                onClick={handleAddActivity}
                                className="border-dashed"
                              >
                                <Plus className="mr-2 h-4 w-4" />
                                Add First Activity
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <BudgetCard budget={trip.budget} activities={dayActivities} />
            <MapCard activities={dayActivities} />
          </div>
        </div>

        {/* Activity Dialog */}
        <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>
                {editingActivity ? "Edit Activity" : "Add New Activity"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Activity Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Visit Eiffel Tower" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Location</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Paris, France" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 9:00 AM" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="accommodation">🏨 Accommodation</SelectItem>
                          <SelectItem value="food">🍽️ Food & Dining</SelectItem>
                          <SelectItem value="activities">🎫 Activities</SelectItem>
                          <SelectItem value="transportation">🚗 Transportation</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description (optional)</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Add notes or details..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-2 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-travel-blue hover:bg-travel-deep"
                    disabled={createActivityMutation.isPending || updateActivityMutation.isPending}
                  >
                    {createActivityMutation.isPending || updateActivityMutation.isPending 
                      ? "Saving..." 
                      : editingActivity 
                        ? "Update Activity" 
                        : "Add Activity"
                    }
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setShowActivityDialog(false);
                      setEditingActivity(null);
                      form.reset();
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
