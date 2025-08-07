import { createContext, useContext } from "react";
import { RepLogEntry } from "../components/rep-logger/RepLogger";

export interface RepSession {
  totalReps: number;
  sessionStartTime: Date | null;
  currentDrill: string;
  isDetecting: boolean;
}

export interface RepSessionContextValue {
  session: RepSession;
  repLog: RepLogEntry[];
  recordRep: (evaluation: {
    quality: "good" | "fair" | "poor";
    form_score: number;
    feedback: string;
    description: string;
  }) => void;
  setDetecting: (detecting: boolean) => void;
  resetSession: () => void;
  setCurrentDrill: (drill: string) => void;
}

export const RepSessionContext = createContext<RepSessionContextValue | undefined>(undefined);

export const RepSessionContextProvider = RepSessionContext.Provider;

export const useRepSession = () => {
  const context = useContext(RepSessionContext);
  if (!context) {
    throw new Error("useRepSession must be used within a RepSessionProvider");
  }
  return context;
};