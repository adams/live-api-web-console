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

import { useCallback, useEffect, useState } from "react";
import { useLiveAPIContext } from "../contexts/LiveAPIContext";
import { GolfShotData } from "../lib/golf-functions";
import { useOCRExtraction } from "./use-ocr-extraction";

export function useGolfData() {
  const { client } = useLiveAPIContext();
  const { extractFromCanvas, isProcessing: isOCRProcessing } = useOCRExtraction();
  const [shots, setShots] = useState<GolfShotData[]>([]);
  const [currentShot, setCurrentShot] = useState<Partial<GolfShotData> | null>(null);
  const [isProcessingShot, setIsProcessingShot] = useState(false);

  // Load shots from localStorage on mount
  useEffect(() => {
    const savedShots = localStorage.getItem('golf-shots');
    if (savedShots) {
      try {
        setShots(JSON.parse(savedShots));
      } catch (e) {
        console.error('Error loading saved shots:', e);
      }
    }
  }, []);

  // Save shots to localStorage whenever shots change
  useEffect(() => {
    localStorage.setItem('golf-shots', JSON.stringify(shots));
  }, [shots]);

  // Handle text-based data extraction
  useEffect(() => {
    const parseGolfData = (text: string): Partial<GolfShotData> | null => {
      const lines = text.split('\n');
      const data: Partial<GolfShotData> = {};
      
      for (const line of lines) {
        const ballSpeedMatch = line.match(/Ball Speed:\s*([0-9.]+)/i);
        const clubSpeedMatch = line.match(/Club Speed:\s*([0-9.]+)/i);
        const carryMatch = line.match(/Carry:\s*([0-9.]+)/i);
        const totalMatch = line.match(/Total:\s*([0-9.]+)/i);
        const spinMatch = line.match(/Spin Rate:\s*([0-9.]+)/i);
        const launchMatch = line.match(/Launch Angle:\s*([0-9.]+)/i);
        
        if (ballSpeedMatch) data.ballSpeed = parseFloat(ballSpeedMatch[1]);
        if (clubSpeedMatch) data.clubHeadSpeed = parseFloat(clubSpeedMatch[1]);
        if (carryMatch) data.carryDistance = parseFloat(carryMatch[1]);
        if (totalMatch) data.totalDistance = parseFloat(totalMatch[1]);
        if (spinMatch) data.spinRate = parseFloat(spinMatch[1]);
        if (launchMatch) data.launchAngle = parseFloat(launchMatch[1]);
      }
      
      // Calculate smash factor if we have both speeds
      if (data.ballSpeed && data.clubHeadSpeed) {
        data.smashFactor = data.ballSpeed / data.clubHeadSpeed;
      }
      
      return Object.keys(data).length > 0 ? data : null;
    };

    // Handle AI text responses and look for golf data
    const handleContent = (content: any) => {
      if (content.modelTurn?.parts) {
        content.modelTurn.parts.forEach((part: any) => {
          if (part.text) {
            console.log('🏌️ Golf: AI Response:', part.text);
            
            // Check if this looks like golf data
            if (part.text.includes('GOLF_DATA:')) {
              console.log('🏌️ Golf: Found golf data in response!');
              const golfData = parseGolfData(part.text);
              
              if (golfData) {
                console.log('🏌️ Golf: Parsed data:', golfData);
                setIsProcessingShot(false);
                
                const completeShot: GolfShotData = {
                  timestamp: Date.now(),
                  clubType: 'Driver',
                  shotQuality: 'good',
                  ...golfData
                };
                
                setShots(prev => [completeShot, ...prev]);
                setCurrentShot(completeShot);
                
                setTimeout(() => setCurrentShot(null), 3000);
              }
            }
          }
        });
      }
    };

    client.on('content', handleContent);
    
    return () => {
      client.off('content', handleContent);
    };
  }, [client, currentShot, isProcessingShot]);

  // Clear all shot data
  const clearShots = useCallback(() => {
    setShots([]);
    setCurrentShot(null);
    setIsProcessingShot(false);
    localStorage.removeItem('golf-shots');
  }, []);

  // Export shot data as JSON
  const exportShots = useCallback(() => {
    const dataStr = JSON.stringify(shots, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `golf-shots-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [shots]);

  // Get session statistics
  const getSessionStats = useCallback(() => {
    if (shots.length === 0) return null;
    
    const averages = {
      ballSpeed: 0,
      carryDistance: 0,
      totalDistance: 0,
      clubHeadSpeed: 0,
    };
    
    let count = 0;
    shots.forEach(shot => {
      if (shot.ballSpeed) { averages.ballSpeed += shot.ballSpeed; count++; }
      if (shot.carryDistance) averages.carryDistance += shot.carryDistance;
      if (shot.totalDistance) averages.totalDistance += shot.totalDistance;
      if (shot.clubHeadSpeed) averages.clubHeadSpeed += shot.clubHeadSpeed;
    });
    
    if (count > 0) {
      averages.ballSpeed /= count;
      averages.carryDistance /= count;
      averages.totalDistance /= count;
      averages.clubHeadSpeed /= count;
    }
    
    return {
      totalShots: shots.length,
      averages,
      lastShot: shots[0],
    };
  }, [shots]);

  // OCR-based data extraction from video at full resolution
  const extractData = useCallback(async () => {
    console.log('🔍 OCR: Direct OCR extraction requested');
    setIsProcessingShot(true);
    
    // Get the video element directly, not the downscaled canvas
    const video = document.querySelector('video') as HTMLVideoElement;
    if (video && video.videoWidth > 0) {
      // Create a full-resolution canvas
      const fullResCanvas = document.createElement('canvas');
      fullResCanvas.width = video.videoWidth;
      fullResCanvas.height = video.videoHeight;
      
      const ctx = fullResCanvas.getContext('2d')!;
      ctx.drawImage(video, 0, 0);
      
      console.log('🔍 OCR: Using full resolution:', fullResCanvas.width + 'x' + fullResCanvas.height);
      
      const golfData = await extractFromCanvas(fullResCanvas);
      if (golfData) {
        console.log('🔍 OCR: Successfully extracted:', golfData);
        setShots(prev => [golfData, ...prev]);
        setCurrentShot(golfData);
        setTimeout(() => setCurrentShot(null), 3000);
      } else {
        console.log('🔍 OCR: No data extracted');
      }
    } else {
      console.error('🔍 OCR: No video element found or video not ready');
    }
    
    setIsProcessingShot(false);
  }, [extractFromCanvas]);

  return {
    shots,
    currentShot,
    isProcessingShot: isProcessingShot || isOCRProcessing,
    clearShots,
    exportShots,
    getSessionStats,
    extractData,
  };
}