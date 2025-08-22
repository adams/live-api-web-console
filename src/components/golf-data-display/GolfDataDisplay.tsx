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

import { memo, useEffect } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";
import { useGolfData } from "../../hooks/use-golf-data";
import { golfFunctionDeclarations } from "../../lib/golf-functions";
import "./golf-data-display.scss";

export const GolfDataDisplay = memo(() => {
  const { setConfig, setModel, connected, client } = useLiveAPIContext();
  const { 
    shots, 
    currentShot, 
    isProcessingShot, 
    clearShots, 
    exportShots, 
    getSessionStats,
    extractData
  } = useGolfData();

  // Configure the Live API for simple text-based data extraction
  useEffect(() => {
    console.log('🏌️ Golf: Setting up simple text extraction...');
    
    setModel("models/gemini-2.0-flash-exp");
    setConfig({
      systemInstruction: {
        parts: [
          {
            text: `You are analyzing a golf simulator screen. When asked, extract shot data from the visible display.

            IMPORTANT: Only respond when directly asked. Don't analyze every frame.
            
            When asked for shot data, respond in this exact format:
            GOLF_DATA:
            Ball Speed: [number] mph
            Club Speed: [number] mph  
            Carry: [number] yds
            Total: [number] yds
            Spin Rate: [number] rpm
            Launch Angle: [number] degrees
            
            Only include data that is clearly visible. Use "N/A" if not visible.`,
          },
        ],
      },
    });
    
    console.log('🏌️ Golf: Simple text extraction configured!');
  }, [setConfig, setModel]);

  // Debug connection status
  useEffect(() => {
    console.log('🏌️ Golf: Connection status changed:', connected);
  }, [connected]);

  const sessionStats = getSessionStats();

  const formatNumber = (num?: number) => {
    return num ? num.toFixed(1) : '-';
  };

  return (
    <div className="golf-data-display">
      <div className="golf-header">
        <h2>Golf Shot Analyzer</h2>
        <div className="connection-status">
          <span className={`status-indicator ${connected ? 'connected' : 'disconnected'}`}>
            {connected ? '● Connected' : '○ Disconnected'}
          </span>
        </div>
        <div className="golf-actions">
          <button 
            onClick={extractData}
            disabled={!connected || isProcessingShot}
          >
            {isProcessingShot ? '🔍 Processing...' : '📊 Extract with OCR'}
          </button>
          <button 
            onClick={() => {
              console.log('🤖 AI: Testing AI vision with full resolution');
              client.send({ text: "Look at this golf simulator screen and extract the shot data. I can see numerical data on the left side. Please respond with: GOLF_DATA: Ball Speed: [number] mph, Club Speed: [number] mph, Carry: [number] yds, Total: [number] yds, Spin Rate: [number] rpm, Launch Angle: [number] degrees. Only include numbers you can clearly see." });
            }}
            disabled={!connected}
          >
            🤖 Try AI Vision
          </button>
          <button 
            onClick={() => {
              const video = document.querySelector('video') as HTMLVideoElement;
              if (video) {
                console.log('🔍 Debug: Video element size:', video.videoWidth, 'x', video.videoHeight);
                console.log('🔍 Debug: Video src:', video.currentSrc || video.src);
                
                const canvas = document.createElement('canvas');
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                const ctx = canvas.getContext('2d')!;
                ctx.drawImage(video, 0, 0);
                
                // Show the debug region
                const leftRegion = document.createElement('canvas');
                leftRegion.width = Math.floor(canvas.width * 0.25);
                leftRegion.height = Math.floor(canvas.height * 0.8);
                const leftCtx = leftRegion.getContext('2d')!;
                leftCtx.drawImage(canvas, 0, 0, leftRegion.width, leftRegion.height, 0, 0, leftRegion.width, leftRegion.height);
                
                // Also show the full resolution for comparison
                const debugWindow = window.open();
                if (debugWindow) {
                  debugWindow.document.write(`
                    <h3>Full Video (${canvas.width}x${canvas.height})</h3>
                    <img src="${canvas.toDataURL()}" style="border: 2px solid blue; max-width: 800px;" />
                    <h3>OCR Debug Region (${leftRegion.width}x${leftRegion.height})</h3>
                    <img src="${leftRegion.toDataURL()}" style="border: 2px solid red;" />
                  `);
                }
              }
            }}
            disabled={!connected}
          >
            🔍 Debug
          </button>
          <button onClick={exportShots} disabled={shots.length === 0}>
            Export Data
          </button>
          <button onClick={clearShots} disabled={shots.length === 0}>
            Clear All
          </button>
        </div>
      </div>

      <div className="golf-content">
        <div className="current-shot-panel">
          <h3>Current Shot {isProcessingShot && <span className="processing">Processing...</span>}</h3>
          {currentShot ? (
            <div className="shot-data">
              <div className="data-row">
                <span>Ball Speed:</span>
                <span>{formatNumber(currentShot.ballSpeed)} mph</span>
              </div>
              <div className="data-row">
                <span>Club Speed:</span>
                <span>{formatNumber(currentShot.clubHeadSpeed)} mph</span>
              </div>
              <div className="data-row">
                <span>Smash Factor:</span>
                <span>{formatNumber(currentShot.smashFactor)}</span>
              </div>
              <div className="data-row">
                <span>Launch Angle:</span>
                <span>{formatNumber(currentShot.launchAngle)}°</span>
              </div>
              <div className="data-row">
                <span>Carry:</span>
                <span>{formatNumber(currentShot.carryDistance)} yds</span>
              </div>
              <div className="data-row">
                <span>Total:</span>
                <span>{formatNumber(currentShot.totalDistance)} yds</span>
              </div>
              <div className="data-row">
                <span>Spin Rate:</span>
                <span>{formatNumber(currentShot.spinRate)} rpm</span>
              </div>
              {currentShot.clubType && (
                <div className="data-row">
                  <span>Club:</span>
                  <span>{currentShot.clubType}</span>
                </div>
              )}
              {currentShot.shotQuality && (
                <div className="data-row quality">
                  <span>Quality:</span>
                  <span className={`quality-${currentShot.shotQuality}`}>
                    {currentShot.shotQuality}
                  </span>
                </div>
              )}
            </div>
          ) : (
            <div className="no-shot">
              {isProcessingShot ? "Analyzing shot..." : "Waiting for shot data..."}
            </div>
          )}
        </div>

        <div className="session-stats-panel">
          <h3>Session Statistics</h3>
          {sessionStats ? (
            <div className="stats-data">
              <div className="stat-item">
                <span className="stat-label">Total Shots:</span>
                <span className="stat-value">{sessionStats.totalShots}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Ball Speed:</span>
                <span className="stat-value">{formatNumber(sessionStats.averages.ballSpeed)} mph</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Carry:</span>
                <span className="stat-value">{formatNumber(sessionStats.averages.carryDistance)} yds</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Avg Total:</span>
                <span className="stat-value">{formatNumber(sessionStats.averages.totalDistance)} yds</span>
              </div>
            </div>
          ) : (
            <div className="no-stats">No shots recorded yet</div>
          )}
        </div>

        <div className="shot-history-panel">
          <h3>Shot History ({shots.length})</h3>
          <div className="shot-history">
            {shots.length > 0 ? (
              shots.slice(0, 10).map((shot, index) => (
                <div key={shot.timestamp} className="shot-item">
                  <div className="shot-number">#{shots.length - index}</div>
                  <div className="shot-summary">
                    <span className="distance">
                      {shot.totalDistance ? `${shot.totalDistance.toFixed(0)} yds` : '-'}
                    </span>
                    <span className="ball-speed">
                      {shot.ballSpeed ? `${shot.ballSpeed.toFixed(0)} mph` : '-'}
                    </span>
                    {shot.shotQuality && (
                      <span className={`quality quality-${shot.shotQuality}`}>
                        {shot.shotQuality}
                      </span>
                    )}
                  </div>
                  <div className="shot-time">
                    {new Date(shot.timestamp).toLocaleTimeString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="no-history">No shots in history</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});