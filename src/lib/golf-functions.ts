/**
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { type FunctionDeclaration, Type } from "@google/genai";

export interface GolfShotData {
  timestamp: number;
  ballSpeed?: number;
  clubHeadSpeed?: number;
  smashFactor?: number;
  launchAngle?: number;
  carryDistance?: number;
  totalDistance?: number;
  spinRate?: number;
  clubType?: string;
  side?: 'left' | 'right' | 'center';
  shotQuality?: 'excellent' | 'good' | 'fair' | 'poor';
}

export const detectShotDataChange: FunctionDeclaration = {
  name: "detect_shot_data_change",
  description: "Analyzes golf simulator screen for changes in shot data fields after a golf shot",
  parameters: {
    type: Type.OBJECT,
    properties: {
      data_fields_changed: {
        type: Type.BOOLEAN,
        description: "Whether shot data fields have changed from previous frame"
      },
      change_confidence: {
        type: Type.NUMBER,
        description: "Confidence level (0-1) that data has actually changed"
      }
    },
    required: ["data_fields_changed", "change_confidence"]
  }
};

export const extractShotData: FunctionDeclaration = {
  name: "extract_shot_data",
  description: "Extracts numerical golf shot data from simulator display when new shot data is detected",
  parameters: {
    type: Type.OBJECT,
    properties: {
      ball_speed: {
        type: Type.NUMBER,
        description: "Ball speed in mph"
      },
      club_head_speed: {
        type: Type.NUMBER,
        description: "Club head speed in mph"
      },
      smash_factor: {
        type: Type.NUMBER,
        description: "Smash factor (ball speed / club head speed)"
      },
      launch_angle: {
        type: Type.NUMBER,
        description: "Launch angle in degrees"
      },
      carry_distance: {
        type: Type.NUMBER,
        description: "Carry distance in yards"
      },
      total_distance: {
        type: Type.NUMBER,
        description: "Total distance in yards"
      },
      spin_rate: {
        type: Type.NUMBER,
        description: "Spin rate in RPM"
      },
      club_type: {
        type: Type.STRING,
        description: "Type of golf club used (Driver, 7 Iron, Wedge, etc.)"
      },
      side: {
        type: Type.STRING,
        description: "Shot direction: left, right, or center"
      }
    },
    required: []
  }
};

export const analyzeShotQuality: FunctionDeclaration = {
  name: "analyze_shot_quality",
  description: "Analyzes the quality of a golf shot based on extracted data",
  parameters: {
    type: Type.OBJECT,
    properties: {
      quality_rating: {
        type: Type.STRING,
        description: "Overall shot quality: excellent, good, fair, or poor"
      },
      feedback: {
        type: Type.STRING,
        description: "Brief feedback on shot performance and areas for improvement"
      },
      key_metrics: {
        type: Type.ARRAY,
        items: {
          type: Type.STRING
        },
        description: "List of standout metrics (positive or negative)"
      }
    },
    required: ["quality_rating", "feedback"]
  }
};

export const detectSimulatorState: FunctionDeclaration = {
  name: "detect_simulator_state",
  description: "Detects the current state of the golf simulator (ready for shot, showing results, etc.)",
  parameters: {
    type: Type.OBJECT,
    properties: {
      simulator_state: {
        type: Type.STRING,
        description: "Current simulator state: ready_for_shot, showing_results, loading, or error"
      },
      hole_number: {
        type: Type.NUMBER,
        description: "Current hole number if visible"
      },
      course_name: {
        type: Type.STRING,
        description: "Golf course name if visible"
      }
    },
    required: ["simulator_state"]
  }
};

// Function declarations array for easy import
export const golfFunctionDeclarations = [
  detectShotDataChange,
  extractShotData,
  analyzeShotQuality,
  detectSimulatorState
];