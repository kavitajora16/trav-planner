import { users, trips, activities, type User, type Trip, type Activity, type InsertUser, type InsertTrip, type InsertActivity } from "@shared/schema";
import { db } from "./db";
import { eq, asc } from "drizzle-orm";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Trip operations
  getUserTrips(userId: number): Promise<Trip[]>;
  getTrip(id: number): Promise<Trip | undefined>;
  createTrip(trip: InsertTrip): Promise<Trip>;
  updateTrip(id: number, trip: Partial<InsertTrip>): Promise<Trip | undefined>;
  deleteTrip(id: number): Promise<boolean>;

  // Activity operations
  getTripActivities(tripId: number): Promise<Activity[]>;
  getActivity(id: number): Promise<Activity | undefined>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: number, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: number): Promise<boolean>;
  reorderActivities(tripId: number, day: number, activityIds: number[]): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByFirebaseUid(firebaseUid: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.firebaseUid, firebaseUid));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  private demoTrips: Trip[] = [
    {
      id: 1,
      userId: 999,
      title: "Weekend in Paris",
      destination: "Paris, France",
      startDate: "2024-07-15",
      endDate: "2024-07-17",
      budget: "1500",
      status: "planning",
      imageUrl: "https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800",
      createdAt: new Date("2024-06-01"),
    },
    {
      id: 2,
      userId: 999,
      title: "Tokyo Adventure",
      destination: "Tokyo, Japan",
      startDate: "2024-09-10",
      endDate: "2024-09-20",
      budget: "3000",
      status: "upcoming",
      imageUrl: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800",
      createdAt: new Date("2024-06-05"),
    }
  ];

  async getUserTrips(userId: number): Promise<Trip[]> {
    // Handle demo user with dynamic data
    if (userId === 999) {
      return [...this.demoTrips];
    }
    return await db.select().from(trips).where(eq(trips.userId, userId));
  }

  async getTrip(id: number): Promise<Trip | undefined> {
    // Handle demo trips - check in memory storage first
    const demoTrip = this.demoTrips.find(trip => trip.id === id);
    if (demoTrip) {
      return demoTrip;
    }
    
    const [trip] = await db.select().from(trips).where(eq(trips.id, id));
    return trip || undefined;
  }

  async createTrip(insertTrip: InsertTrip): Promise<Trip> {
    // Handle demo user - create in-memory trip
    if (insertTrip.userId === 999) {
      const demoTrip: Trip = {
        id: Date.now(), // Use timestamp as ID for demo
        ...insertTrip,
        createdAt: new Date(),
      };
      this.demoTrips.push(demoTrip);
      console.log("Created demo trip:", demoTrip);
      console.log("Total demo trips:", this.demoTrips.length);
      return demoTrip;
    }
    
    const [trip] = await db
      .insert(trips)
      .values(insertTrip)
      .returning();
    return trip;
  }

  async updateTrip(id: number, updateData: Partial<InsertTrip>): Promise<Trip | undefined> {
    const [trip] = await db
      .update(trips)
      .set(updateData)
      .where(eq(trips.id, id))
      .returning();
    return trip || undefined;
  }

  async deleteTrip(id: number): Promise<boolean> {
    // First delete all activities for this trip
    await db.delete(activities).where(eq(activities.tripId, id));
    
    // Then delete the trip
    const result = await db.delete(trips).where(eq(trips.id, id));
    return (result.rowCount || 0) > 0;
  }

  async getTripActivities(tripId: number): Promise<Activity[]> {
    // Handle demo trip activities
    if (tripId === 1) {
      return [
        {
          id: 1,
          tripId: 1,
          title: "Visit Eiffel Tower",
          description: "Iconic landmark and symbol of Paris",
          location: "Champ de Mars, Paris",
          day: 1,
          time: "10:00 AM",
          cost: "25",
          category: "activities",
          orderIndex: 0,
          createdAt: new Date("2024-06-01"),
        },
        {
          id: 2,
          tripId: 1,
          title: "Lunch at Café de Flore",
          description: "Historic café in Saint-Germain",
          location: "172 Boulevard Saint-Germain, Paris",
          day: 1,
          time: "1:00 PM",
          cost: "45",
          category: "food",
          orderIndex: 1,
          createdAt: new Date("2024-06-01"),
        }
      ];
    }
    if (tripId === 2) {
      return [
        {
          id: 3,
          tripId: 2,
          title: "Senso-ji Temple",
          description: "Ancient Buddhist temple in Asakusa",
          location: "Asakusa, Tokyo",
          day: 1,
          time: "9:00 AM",
          cost: "0",
          category: "activities",
          orderIndex: 0,
          createdAt: new Date("2024-06-05"),
        }
      ];
    }
    
    return await db
      .select()
      .from(activities)
      .where(eq(activities.tripId, tripId))
      .orderBy(asc(activities.day), asc(activities.orderIndex));
  }

  async getActivity(id: number): Promise<Activity | undefined> {
    const [activity] = await db.select().from(activities).where(eq(activities.id, id));
    return activity || undefined;
  }

  async createActivity(insertActivity: InsertActivity): Promise<Activity> {
    // Handle demo user - create in-memory activity
    if (insertActivity.tripId === 1 || insertActivity.tripId === 2) {
      const demoActivity: Activity = {
        id: Date.now(), // Use timestamp as ID for demo
        ...insertActivity,
        createdAt: new Date(),
      };
      console.log("Created demo activity:", demoActivity);
      return demoActivity;
    }
    
    const [activity] = await db
      .insert(activities)
      .values(insertActivity)
      .returning();
    return activity;
  }

  async updateActivity(id: number, updateData: Partial<InsertActivity>): Promise<Activity | undefined> {
    // Handle demo activities
    if (id === 1 || id === 2 || id === 3) {
      console.log("Updated demo activity:", id, updateData);
      // Return a mock updated activity for demo
      return {
        id,
        tripId: 1,
        title: updateData.title || "Demo Activity",
        description: updateData.description || "",
        location: updateData.location || "",
        day: updateData.day || 1,
        time: updateData.time || "",
        cost: updateData.cost || "0",
        category: updateData.category || "activities",
        orderIndex: 0,
        createdAt: new Date(),
      };
    }
    
    const [activity] = await db
      .update(activities)
      .set(updateData)
      .where(eq(activities.id, id))
      .returning();
    return activity || undefined;
  }

  async deleteActivity(id: number): Promise<boolean> {
    // Handle demo activities
    if (id === 1 || id === 2 || id === 3) {
      console.log("Deleted demo activity:", id);
      return true;
    }
    
    const result = await db.delete(activities).where(eq(activities.id, id));
    return (result.rowCount || 0) > 0;
  }

  async reorderActivities(tripId: number, day: number, activityIds: number[]): Promise<void> {
    // Update order index for each activity
    for (let i = 0; i < activityIds.length; i++) {
      await db
        .update(activities)
        .set({ orderIndex: i })
        .where(eq(activities.id, activityIds[i]));
    }
  }
}

export const storage = new DatabaseStorage();
