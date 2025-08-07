import { useEffect, useRef, ReactNode } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { RepSessionContextProvider } from "../../contexts/RepSessionContext";
import { useRepSessionState } from "../../hooks/use-rep-session";
import { 
  repetitionFunctionDeclarations, 
  DetectRepetitionArgs, 
  EvaluateRepetitionArgs 
} from "../../lib/rep-tools";
import { LiveServerToolCall, TurnCoverage, MediaResolution } from "@google/genai";

interface RepSessionProviderProps {
  children: ReactNode;
}

export function RepSessionProvider({ children }: RepSessionProviderProps) {
  const { config, setConfig, connected, client } = useLiveAPIContext();
  const { 
    session, 
    repLog, 
    recordRep, 
    setDetecting, 
    resetSession, 
    setCurrentDrill 
  } = useRepSessionState();
  
  const periodicCheckRef = useRef<NodeJS.Timeout | null>(null);
  const pendingEvaluation = useRef<{
    description: string;
    confidence: number;
  } | null>(null);

  // Configure rep detection tools and golf instructor system instruction
  useEffect(() => {
    // CLEAR OLD CONFIGURATION TO REMOVE DUPLICATES
    console.log("🔧 Initializing repetition tracking");
    
    // Clear localStorage to remove old duplicate configurations
    localStorage.removeItem('live-api-settings');
    
    // Set configuration with rep detection tools only
    try {
      const newConfig = {
        systemInstruction: {
          parts: [{ 
            text: "You analyze video frames. Say 'Ready to track repetitions!' when first connected. When you receive a '.' message, call 'detect_repetition' to describe what you observe in the recent video frames. In the description field, objectively describe what you see: the person's position, posture, and any movements. Be factual and specific about what is visible. Only set repetition_detected=true if you observe athletic movement that appears to be a complete sports motion. Most observations should result in repetition_detected=false."
          }],
        },
        tools: [
          { functionDeclarations: repetitionFunctionDeclarations }, // Add repetition detection tools
        ],
      };
      
      console.log("🔧 Setting repetition detection config");
      setConfig(newConfig);
      console.log("✅ Repetition detection configured");
    } catch (error) {
      console.error("❌ Error configuring minimal setup:", error);
    }
  }, [setConfig]); // Remove config dependency to force reset

  // Handle function calls from Gemini
  useEffect(() => {
    const onToolCall = (toolCall: LiveServerToolCall) => {
      console.log("🏋️ Repetition function called:", toolCall);
      if (!toolCall.functionCalls) return;

      const responses = toolCall.functionCalls.map((fc) => {
        let output: any = { success: true };

        try {
          switch (fc.name) {
            case "detect_repetition":
              const detectArgs = (fc.args || {}) as unknown as DetectRepetitionArgs;
              console.log("🔍 Repetition detection:", detectArgs);
              
              // Store repetition data for evaluation - with validation
              if (detectArgs.repetition_detected && detectArgs.confidence > 0.7) {
                // Additional validation - reject obvious false positives and hallucinations
                const description = detectArgs.description.toLowerCase();
                const isFalsePositive = description.includes('thumbs') || 
                                      description.includes('gesture') || 
                                      description.includes('wave') || 
                                      description.includes('point') ||
                                      description.includes('sitting') ||
                                      description.includes('chair') ||
                                      description.includes('desk');
                
                // Check for hallucination patterns - overly detailed descriptions that don't match simple actions
                const isLikelyHallucination = detectArgs.repetition_detected && 
                                            description.includes('full golf swing') && 
                                            description.includes('setup position') && 
                                            description.includes('backswing') && 
                                            description.includes('downswing') && 
                                            description.includes('follow-through');
                
                const shouldReject = isFalsePositive || isLikelyHallucination;
                
                if (shouldReject) {
                  const reason = isFalsePositive ? "False positive filter triggered" : "Possible hallucination detected";
                  console.log("🚫 Rejected detection:", detectArgs, "Reason:", reason);
                  output = { 
                    success: true,
                    action: "no_repetition_detected",
                    phase: detectArgs.movement_phase,
                    description: "Rejected - " + reason,
                    reason: reason
                  };
                } else {
                  pendingEvaluation.current = {
                    description: detectArgs.description,
                    confidence: detectArgs.confidence,
                  };
                  
                  output = { 
                    success: true,
                    action: "repetition_detected",
                    confidence: detectArgs.confidence,
                    description: detectArgs.description,
                    next_action: "Please call evaluate_repetition to assess this repetition"
                  };
                }
              } else {
                output = { 
                  success: true,
                  action: "no_repetition_detected",
                  phase: detectArgs.movement_phase,
                  description: detectArgs.description
                };
              }
              break;

            case "evaluate_repetition":
              const evalArgs = (fc.args || {}) as unknown as EvaluateRepetitionArgs;
              console.log("📊 Repetition evaluation:", evalArgs);
              
              if (pendingEvaluation.current) {
                // Record the repetition with evaluation
                const repEntry = recordRep({
                  quality: evalArgs.quality as "good" | "fair" | "poor",
                  form_score: evalArgs.form_score || 50,
                  feedback: evalArgs.feedback || "Repetition completed",
                  description: pendingEvaluation.current.description,
                });
                
                output = { 
                  success: true,
                  action: "repetition_logged",
                  repetition_id: repEntry.id,
                  quality: evalArgs.quality,
                  form_score: evalArgs.form_score || 50,
                  total_repetitions: session.totalReps + 1,
                  feedback: evalArgs.feedback || "Repetition completed"
                };
                
                pendingEvaluation.current = null;
                console.log("✅ Repetition logged:", repEntry);
              } else {
                output = { 
                  success: true,
                  action: "no_pending_repetition",
                  message: "No pending repetition to evaluate"
                };
              }
              break;

            default:
              output = { success: false, error: "Unknown function" };
          }
        } catch (error) {
          console.error("Rep function error:", error);
          output = { success: false, error: String(error) };
        }

        return {
          id: fc.id!,
          name: fc.name!,
          response: { output },
        };
      });

      // Send responses back to Gemini
      client.sendToolResponse({
        functionResponses: responses,
      });
    };

    client.on("toolcall", onToolCall);
    return () => {
      client.off("toolcall", onToolCall);
    };
  }, [client, recordRep, session.totalReps]);

  // Set detecting state and enable periodic rep detection messages
  useEffect(() => {
    setDetecting(connected);
    
    if (connected) {
      console.log("🏋️ Starting periodic rep detection messages");
      // Send periodic "." message to trigger rep detection every 5 seconds
      periodicCheckRef.current = setInterval(() => {
        if (client && connected) {
          console.log("📨 Sending periodic check message");
          client.send([{ text: "." }]);
        }
      }, 5000);
    } else {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
      resetSession();
    }

    return () => {
      if (periodicCheckRef.current) {
        clearInterval(periodicCheckRef.current);
        periodicCheckRef.current = null;
      }
    };
  }, [connected, setDetecting, resetSession, client]);

  return (
    <RepSessionContextProvider 
      value={{
        session,
        repLog,
        recordRep,
        setDetecting,
        resetSession,
        setCurrentDrill,
      }}
    >
      {children}
    </RepSessionContextProvider>
  );
}