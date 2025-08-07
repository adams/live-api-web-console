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

import React from "react";
import "./right-sidebar.scss";

const RightSidebar: React.FC = () => {
  // Hardcoded Towel Drill content
  const sessionTitle = "The Towel Drill";
  const videoId = "vGJCGo22qbs";
  
  const sessionInstructions = [
    "Place a towel under your trailing armpit before taking your grip",
    "The goal is to keep the towel in place throughout your swing",
    "This drill helps maintain proper connection between your arms and body",
    "Focus on rotating your body rather than lifting your arms independently",
    "Start with slow, controlled swings to feel the proper motion",
    "If the towel falls, you're likely disconnecting your arms from your body",
    "Practice this drill regularly to improve swing consistency and power"
  ];

  return (
    <div className="right-sidebar">
      <div className="sidebar-content">
        <div className="session-header">
          <h2>{sessionTitle}</h2>
          <p className="session-subtitle">Practice Session Instructions</p>
        </div>

        <div className="video-section">
          <div className="video-container">
            <iframe
              width="360"
              height="640"
              src={`https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&showinfo=0`}
              title="YouTube Shorts player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        <div className="instructions-section">
          <h3>Drill Instructions</h3>
          <ol className="instruction-list">
            {sessionInstructions.map((instruction, index) => (
              <li key={index} className="instruction-item">
                {instruction}
              </li>
            ))}
          </ol>
        </div>

        <div className="tips-section">
          <h3>Tips for Success</h3>
          <ul className="tips-list">
            <li>Start with practice swings without a ball</li>
            <li>Focus on the feeling of connection</li>
            <li>Ask the AI to watch for towel drops during your swings</li>
            <li>Record yourself to review your progress</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;