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

import { useCallback, useRef, useState } from 'react';
import Tesseract from 'tesseract.js';
import { GolfShotData } from '../lib/golf-functions';

export function useOCRExtraction() {
  const [isProcessing, setIsProcessing] = useState(false);
  const workerRef = useRef<Tesseract.Worker | null>(null);

  const initWorker = useCallback(async () => {
    if (!workerRef.current) {
      console.log('🔍 OCR: Initializing Tesseract worker...');
      const worker = await Tesseract.createWorker('eng', 1, {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`🔍 OCR: ${Math.round(m.progress * 100)}%`);
          }
        }
      });
      
      await worker.setParameters({
        tessedit_char_whitelist: '0123456789.-',
        tessedit_pageseg_mode: Tesseract.PSM.SINGLE_BLOCK,
        preserve_interword_spaces: '0'
      });
      
      workerRef.current = worker;
      console.log('🔍 OCR: Worker ready!');
    }
    return workerRef.current;
  }, []);

  const extractFromCanvas = useCallback(async (canvas: HTMLCanvasElement): Promise<GolfShotData | null> => {
    setIsProcessing(true);
    
    try {
      console.log('🔍 OCR: Starting text extraction...');
      const worker = await initWorker();
      
      // Focus on the left side where golf data appears - but larger region and higher contrast
      const leftRegion = document.createElement('canvas');
      leftRegion.width = Math.floor(canvas.width * 0.25); // Left 25% of screen
      leftRegion.height = Math.floor(canvas.height * 0.8); // Top 80% (skip bottom controls)
      
      const leftCtx = leftRegion.getContext('2d')!;
      
      // Draw the left region from the original canvas
      leftCtx.drawImage(canvas, 
        0, 0, leftRegion.width, leftRegion.height, // source
        0, 0, leftRegion.width, leftRegion.height  // destination
      );
      
      // Scale up the region for better OCR
      const scaledRegion = document.createElement('canvas');
      scaledRegion.width = leftRegion.width * 3; // Scale up 3x
      scaledRegion.height = leftRegion.height * 3;
      const scaledCtx = scaledRegion.getContext('2d')!;
      
      // Use smooth scaling
      scaledCtx.imageSmoothingEnabled = true;
      scaledCtx.imageSmoothingQuality = 'high';
      scaledCtx.drawImage(leftRegion, 0, 0, scaledRegion.width, scaledRegion.height);
      
      // Enhance contrast on the scaled image
      const imageData = scaledCtx.getImageData(0, 0, scaledRegion.width, scaledRegion.height);
      const data = imageData.data;
      
      // Better contrast enhancement
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        const avg = (r + g + b) / 3;
        
        // More nuanced thresholding for text
        const enhanced = avg > 140 ? 255 : avg < 60 ? 0 : avg;
        data[i] = data[i + 1] = data[i + 2] = enhanced;
      }
      
      scaledCtx.putImageData(imageData, 0, 0);
      
      console.log('🔍 OCR: Processing scaled region:', scaledRegion.width, 'x', scaledRegion.height);
      
      const { data: { text } } = await worker.recognize(scaledRegion);
      console.log('🔍 OCR: Extracted text:', text);
      
      // Parse the extracted text for golf data
      const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      console.log('🔍 OCR: Text lines:', lines);
      
      const golfData: Partial<GolfShotData> = {
        timestamp: Date.now(),
        clubType: 'Driver',
        shotQuality: 'good'
      };
      
      let foundData = false;
      
      // Look for specific patterns in the text to better identify golf data
      for (const line of lines) {
        const cleanLine = line.trim();
        console.log('🔍 OCR: Processing line:', cleanLine);
        
        // Look for numbers with decimal points for more accurate matching
        const numbers = cleanLine.match(/\d+\.?\d*/g);
        if (numbers) {
          for (const num of numbers) {
            const value = parseFloat(num);
            
            // Based on your simulator, adjust ranges to what we actually see
            if (value >= 40 && value <= 80 && !golfData.carryDistance) {
              // Carry distance (like 50.1 in your debug)
              golfData.carryDistance = value;
              foundData = true;
              console.log('🔍 OCR: Found carry distance:', value);
            } else if (value >= 50 && value <= 90 && !golfData.totalDistance && value !== golfData.carryDistance) {
              // Total distance (like 56.3 in your debug)
              golfData.totalDistance = value;
              foundData = true;
              console.log('🔍 OCR: Found total distance:', value);
            } else if (value >= 45 && value <= 70 && !golfData.clubHeadSpeed && value !== golfData.carryDistance && value !== golfData.totalDistance) {
              // Club speed (like 54.0 in your debug)
              golfData.clubHeadSpeed = value;
              foundData = true;
              console.log('🔍 OCR: Found club speed:', value);
            } else if (value >= 45 && value <= 70 && !golfData.ballSpeed && value !== golfData.clubHeadSpeed && value !== golfData.carryDistance && value !== golfData.totalDistance) {
              // Ball speed (like 53.6 in your debug)
              golfData.ballSpeed = value;
              foundData = true;
              console.log('🔍 OCR: Found ball speed:', value);
            } else if (value >= 3000 && value <= 8000 && !golfData.spinRate) {
              // Spin rate (like 5150 in your debug)
              golfData.spinRate = value;
              foundData = true;
              console.log('🔍 OCR: Found spin rate:', value);
            } else if (value >= 10 && value <= 50 && value !== golfData.carryDistance && value !== golfData.totalDistance && !golfData.launchAngle) {
              // Launch/descent angle (like 32.6 in your debug)
              golfData.launchAngle = value;
              foundData = true;
              console.log('🔍 OCR: Found angle:', value);
            }
          }
        }
      }
      
      // Calculate smash factor if we have both speeds
      if (golfData.ballSpeed && golfData.clubHeadSpeed) {
        golfData.smashFactor = Math.round((golfData.ballSpeed / golfData.clubHeadSpeed) * 100) / 100;
      }
      
      if (foundData) {
        console.log('🔍 OCR: Extracted golf data:', golfData);
        return golfData as GolfShotData;
      } else {
        console.log('🔍 OCR: No golf data found in text');
        return null;
      }
      
    } catch (error) {
      console.error('🔍 OCR: Error:', error);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [initWorker]);

  const cleanup = useCallback(async () => {
    if (workerRef.current) {
      console.log('🔍 OCR: Terminating worker...');
      await workerRef.current.terminate();
      workerRef.current = null;
    }
  }, []);

  return {
    extractFromCanvas,
    isProcessing,
    cleanup
  };
}