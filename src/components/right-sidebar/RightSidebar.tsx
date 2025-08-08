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
import { useDrill } from "../../contexts/DrillContext";
import DrillPicker from "../drill-picker/DrillPicker";

const RightSidebar: React.FC = () => {
  // Using drill context to get current drill data
  const { currentDrill } = useDrill();
  const { title: sessionTitle, videoId, instructions: sessionInstructions, tips } = currentDrill;

  return (
    <div className="right-sidebar">
      <div className="sidebar-content">
        <DrillPicker />
        
        <div className="session-header">
          <h2>{sessionTitle}</h2>
          <p className="session-subtitle">Practice Session Instructions</p>
        </div>

        {videoId && (
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
        )}

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
            {tips.map((tip, index) => (
              <li key={index}>{tip}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;