import { FunctionDeclaration, Type } from "@google/genai";

// Function to detect repetitions of drill movements in video
export const detectRepetitionDeclaration: FunctionDeclaration = {
  name: "detect_repetition",
  description: "Analyze video frames to determine if a repetition occurred. Observe the person's position, movements, and actions in the video.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      repetition_detected: {
        type: Type.BOOLEAN,
        description: "True if a complete drill repetition was observed, false otherwise",
      },
      confidence: {
        type: Type.NUMBER,
        description: "Confidence level 0-1 that this was a real repetition (1 = very confident)",
      },
      movement_phase: {
        type: Type.STRING,
        description: "Primary movement observed: 'none', 'partial', 'complete'",
      },
      description: {
        type: Type.STRING,
        description: "Objective description of what you observe in the video: person's position, posture, and any visible movements or actions.",
      },
    },
    required: ["repetition_detected", "confidence", "movement_phase", "description"],
  },
};

// Function to evaluate the quality of a detected repetition
export const evaluateRepetitionDeclaration: FunctionDeclaration = {
  name: "evaluate_repetition",
  description: "Provides expert evaluation of a detected drill repetition's quality and form.",
  parameters: {
    type: Type.OBJECT,
    properties: {
      quality: {
        type: Type.STRING,
        description: "Overall quality assessment: 'good', 'fair', 'poor'",
      },
      form_score: {
        type: Type.NUMBER,
        description: "Technical form score from 0-100 (100 = perfect form)",
      },
      feedback: {
        type: Type.STRING,
        description: "Brief expert feedback on what was good or needs improvement",
      },
      key_points: {
        type: Type.STRING,
        description: "Key technical points observed (comma-separated if multiple)",
      },
    },
    required: ["quality", "form_score", "feedback", "key_points"],
  },
};

// Export all repetition function declarations
export const repetitionFunctionDeclarations = [
  detectRepetitionDeclaration,
  evaluateRepetitionDeclaration,
];

// Type definitions for function arguments
export interface DetectRepetitionArgs {
  repetition_detected: boolean;
  confidence: number;
  movement_phase: string;
  description: string;
}

export interface EvaluateRepetitionArgs {
  quality: string;
  form_score: number;
  feedback: string;
  key_points: string;
}