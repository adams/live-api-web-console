import { useState, useCallback } from "react";
import { RepSession } from "../contexts/RepSessionContext";
import { RepLogEntry } from "../components/rep-logger/RepLogger";

export const useRepSessionState = () => {
  const [session, setSession] = useState<RepSession>({
    totalReps: 0,
    sessionStartTime: null,
    currentDrill: "Golf Practice",
    isDetecting: false,
  });

  const [repLog, setRepLog] = useState<RepLogEntry[]>([]);

  const recordRep = useCallback((evaluation: {
    quality: "good" | "fair" | "poor";
    form_score: number;
    feedback: string;
    description: string;
  }) => {
    const newEntry: RepLogEntry = {
      id: `rep-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      ...evaluation,
    };

    setRepLog(prev => [...prev, newEntry]);
    
    setSession(prev => ({
      ...prev,
      totalReps: prev.totalReps + 1,
      sessionStartTime: prev.sessionStartTime || new Date(),
    }));

    return newEntry;
  }, []);

  const setDetecting = useCallback((detecting: boolean) => {
    setSession(prev => ({
      ...prev,
      isDetecting: detecting,
    }));
  }, []);

  const resetSession = useCallback(() => {
    setSession({
      totalReps: 0,
      sessionStartTime: null,
      currentDrill: "Golf Practice",
      isDetecting: false,
    });
    setRepLog([]);
  }, []);

  const setCurrentDrill = useCallback((drill: string) => {
    setSession(prev => ({
      ...prev,
      currentDrill: drill,
    }));
  }, []);

  return {
    session,
    repLog,
    recordRep,
    setDetecting,
    resetSession,
    setCurrentDrill,
  };
};