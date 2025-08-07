import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { DrillData, DrillKey, availableDrills } from '../lib/drill-data';
import { generateSystemInstruction, getDefaultSystemInstruction, generateGreetingMessage } from '../lib/system-instructions';
import { useLiveAPIContext } from './LiveAPIContext';

interface DrillContextValue {
  currentDrill: DrillData;
  currentDrillKey: DrillKey;
  systemInstruction: string;
  setCurrentDrill: (drillKey: DrillKey) => void;
}

const DrillContext = createContext<DrillContextValue | undefined>(undefined);

interface DrillProviderProps {
  children: ReactNode;
}

export function DrillProvider({ children }: DrillProviderProps) {
  const [currentDrillKey, setCurrentDrillKey] = useState<DrillKey>('towelDrill');
  const [systemInstruction, setSystemInstruction] = useState<string>(getDefaultSystemInstruction());
  const { setConfig, client } = useLiveAPIContext();
  
  const currentDrill = availableDrills[currentDrillKey];

  // Update system instruction when drill changes
  useEffect(() => {
    const newSystemInstruction = generateSystemInstruction(currentDrill);
    setSystemInstruction(newSystemInstruction);
    
    // Update the LiveAPI config with the new system instruction
    setConfig({
      systemInstruction: {
        parts: [{ text: newSystemInstruction }]
      }
    });
  }, [currentDrill, setConfig]);

  // Send greeting message when session is set up
  useEffect(() => {
    const onSetupComplete = () => {
      const greetingMessage = generateGreetingMessage(currentDrill);
      console.log('🎯 Sending drill greeting:', greetingMessage);
      client.send([{ text: greetingMessage }]);
    };

    client.on('setupcomplete', onSetupComplete);
    
    return () => {
      client.off('setupcomplete', onSetupComplete);
    };
  }, [client, currentDrill]);

  const setCurrentDrill = (drillKey: DrillKey) => {
    setCurrentDrillKey(drillKey);
  };

  return (
    <DrillContext.Provider value={{
      currentDrill,
      currentDrillKey,
      systemInstruction,
      setCurrentDrill
    }}>
      {children}
    </DrillContext.Provider>
  );
}

export function useDrill() {
  const context = useContext(DrillContext);
  if (!context) {
    throw new Error('useDrill must be used within a DrillProvider');
  }
  return context;
}