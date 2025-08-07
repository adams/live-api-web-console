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

import { useRef, useState } from "react";
import "./App.scss";
import { LiveAPIProvider } from "./contexts/LiveAPIContext";
import { RepSessionProvider } from "./components/rep-session/RepSessionProvider";
import { useRepSession } from "./contexts/RepSessionContext";
import SidePanel from "./components/side-panel/SidePanel";
import { Altair } from "./components/altair/Altair";
import ControlTray from "./components/control-tray/ControlTray";
import RightSidebar from "./components/right-sidebar/RightSidebar";
import RepLogger from "./components/rep-logger/RepLogger";
import cn from "classnames";
import { LiveClientOptions } from "./types";

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY as string;
if (typeof API_KEY !== "string") {
  throw new Error("set REACT_APP_GEMINI_API_KEY in .env");
}

const apiOptions: LiveClientOptions = {
  apiKey: API_KEY,
};

function MainContent() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const { repLog } = useRepSession();

  return (
    <div className="streaming-console">
      <SidePanel />
      <main>
        <div className="main-app-area">
          {/* APP goes here */}
          <Altair />
          
          {/* Floating RepLogger */}
          <div className="rep-logger-overlay">
            <RepLogger entries={repLog} />
          </div>
          
          {/* Instructional message when camera/mic not ready */}
          {!videoStream && (
            <div className="session-setup-message">
              <div className="setup-content">
                <div className="setup-icon">
                  <span className="material-symbols-outlined">videocam</span>
                  <span className="material-symbols-outlined">mic</span>
                </div>
                <h2>Ready to Start Your Rep Session?</h2>
                <p>Enable your camera below to begin drill tracking</p>
                <div className="setup-steps">
                  <div className="step">
                    <span className="step-number">1</span>
                    <span>Turn on your camera</span>
                  </div>
                  <div className="step">
                    <span className="step-number">2</span>
                    <span>Optional: Enable microphone</span>
                  </div>
                  <div className="step">
                    <span className="step-number">3</span>
                    <span>Click "Start Session"</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <video
            className={cn("stream", {
              hidden: !videoRef.current || !videoStream,
            })}
            ref={videoRef}
            autoPlay
            playsInline
          />
        </div>

        <ControlTray
          videoRef={videoRef}
          supportsVideo={true}
          onVideoStreamChange={setVideoStream}
          enableEditingSettings={true}
        >
          {/* put your own buttons here */}
        </ControlTray>
      </main>
      <RightSidebar />
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <LiveAPIProvider options={apiOptions}>
        <RepSessionProvider>
          <MainContent />
        </RepSessionProvider>
      </LiveAPIProvider>
    </div>
  );
}

export default App;
