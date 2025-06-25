import { createContext, useContext, useReducer } from "react";
import { Trip, Activity } from "@shared/schema";

interface TripState {
  selectedTrip: Trip | null;
  selectedDay: number;
  activities: Activity[];
}

type TripAction = 
  | { type: "SET_SELECTED_TRIP"; payload: Trip | null }
  | { type: "SET_SELECTED_DAY"; payload: number }
  | { type: "SET_ACTIVITIES"; payload: Activity[] }
  | { type: "ADD_ACTIVITY"; payload: Activity }
  | { type: "UPDATE_ACTIVITY"; payload: { id: number; activity: Partial<Activity> } }
  | { type: "DELETE_ACTIVITY"; payload: number }
  | { type: "REORDER_ACTIVITIES"; payload: { day: number; activities: Activity[] } };

const initialState: TripState = {
  selectedTrip: null,
  selectedDay: 1,
  activities: [],
};

function tripReducer(state: TripState, action: TripAction): TripState {
  switch (action.type) {
    case "SET_SELECTED_TRIP":
      return { ...state, selectedTrip: action.payload, selectedDay: 1 };
    case "SET_SELECTED_DAY":
      return { ...state, selectedDay: action.payload };
    case "SET_ACTIVITIES":
      return { ...state, activities: action.payload };
    case "ADD_ACTIVITY":
      return { ...state, activities: [...state.activities, action.payload] };
    case "UPDATE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.map(activity =>
          activity.id === action.payload.id
            ? { ...activity, ...action.payload.activity }
            : activity
        ),
      };
    case "DELETE_ACTIVITY":
      return {
        ...state,
        activities: state.activities.filter(activity => activity.id !== action.payload),
      };
    case "REORDER_ACTIVITIES":
      return {
        ...state,
        activities: state.activities.map(activity => {
          if (activity.day === action.payload.day) {
            const reorderedActivity = action.payload.activities.find(a => a.id === activity.id);
            return reorderedActivity || activity;
          }
          return activity;
        }),
      };
    default:
      return state;
  }
}

interface TripContextType {
  state: TripState;
  dispatch: React.Dispatch<TripAction>;
  getDayActivities: (day: number) => Activity[];
  getTripDuration: () => number;
}

const TripContext = createContext<TripContextType | undefined>(undefined);

export function TripProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(tripReducer, initialState);

  const getDayActivities = (day: number) => {
    return state.activities
      .filter(activity => activity.day === day)
      .sort((a, b) => (a.orderIndex || 0) - (b.orderIndex || 0));
  };

  const getTripDuration = () => {
    if (!state.selectedTrip) return 0;
    const start = new Date(state.selectedTrip.startDate);
    const end = new Date(state.selectedTrip.endDate);
    return Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;
  };

  return (
    <TripContext.Provider value={{ state, dispatch, getDayActivities, getTripDuration }}>
      {children}
    </TripContext.Provider>
  );
}

export function useTrip() {
  const context = useContext(TripContext);
  if (context === undefined) {
    throw new Error("useTrip must be used within a TripProvider");
  }
  return context;
}
