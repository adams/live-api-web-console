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

import { useState } from "react";
import { GolfShotData } from "../../lib/golf-functions";

interface ManualShotEntryProps {
  onShotAdded: (shot: GolfShotData) => void;
}

export function ManualShotEntry({ onShotAdded }: ManualShotEntryProps) {
  const [formData, setFormData] = useState({
    ballSpeed: '',
    clubHeadSpeed: '',
    carryDistance: '',
    totalDistance: '',
    spinRate: '',
    launchAngle: '',
    smashFactor: '',
    clubType: 'Driver',
    side: 'center' as 'left' | 'right' | 'center'
  });

  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const shot: GolfShotData = {
      timestamp: Date.now(),
      ballSpeed: formData.ballSpeed ? parseFloat(formData.ballSpeed) : undefined,
      clubHeadSpeed: formData.clubHeadSpeed ? parseFloat(formData.clubHeadSpeed) : undefined,
      carryDistance: formData.carryDistance ? parseFloat(formData.carryDistance) : undefined,
      totalDistance: formData.totalDistance ? parseFloat(formData.totalDistance) : undefined,
      spinRate: formData.spinRate ? parseFloat(formData.spinRate) : undefined,
      launchAngle: formData.launchAngle ? parseFloat(formData.launchAngle) : undefined,
      smashFactor: formData.smashFactor ? parseFloat(formData.smashFactor) : undefined,
      clubType: formData.clubType,
      side: formData.side,
      shotQuality: 'good' // Default quality
    };

    onShotAdded(shot);
    
    // Reset form
    setFormData({
      ballSpeed: '',
      clubHeadSpeed: '',
      carryDistance: '',
      totalDistance: '',
      spinRate: '',
      launchAngle: '',
      smashFactor: '',
      clubType: 'Driver',
      side: 'center'
    });
    
    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) {
    return (
      <button 
        className="add-shot-btn"
        onClick={() => setIsOpen(true)}
      >
        + Add Shot Manually
      </button>
    );
  }

  return (
    <div className="manual-entry-form">
      <div className="form-header">
        <h3>Add Shot Data</h3>
        <button onClick={() => setIsOpen(false)}>×</button>
      </div>
      
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="form-group">
            <label>Ball Speed (mph)</label>
            <input
              type="number"
              step="0.1"
              value={formData.ballSpeed}
              onChange={(e) => handleInputChange('ballSpeed', e.target.value)}
              placeholder="116.1"
            />
          </div>
          
          <div className="form-group">
            <label>Club Speed (mph)</label>
            <input
              type="number"
              step="0.1"
              value={formData.clubHeadSpeed}
              onChange={(e) => handleInputChange('clubHeadSpeed', e.target.value)}
              placeholder="81.5"
            />
          </div>
          
          <div className="form-group">
            <label>Carry (yds)</label>
            <input
              type="number"
              step="0.1"
              value={formData.carryDistance}
              onChange={(e) => handleInputChange('carryDistance', e.target.value)}
              placeholder="135"
            />
          </div>
          
          <div className="form-group">
            <label>Total (yds)</label>
            <input
              type="number"
              step="0.1"
              value={formData.totalDistance}
              onChange={(e) => handleInputChange('totalDistance', e.target.value)}
              placeholder="141"
            />
          </div>
          
          <div className="form-group">
            <label>Spin Rate (rpm)</label>
            <input
              type="number"
              value={formData.spinRate}
              onChange={(e) => handleInputChange('spinRate', e.target.value)}
              placeholder="5139"
            />
          </div>
          
          <div className="form-group">
            <label>Launch Angle (°)</label>
            <input
              type="number"
              step="0.1"
              value={formData.launchAngle}
              onChange={(e) => handleInputChange('launchAngle', e.target.value)}
              placeholder="12.5"
            />
          </div>
          
          <div className="form-group">
            <label>Club Type</label>
            <select
              value={formData.clubType}
              onChange={(e) => handleInputChange('clubType', e.target.value)}
            >
              <option value="Driver">Driver</option>
              <option value="3 Wood">3 Wood</option>
              <option value="5 Wood">5 Wood</option>
              <option value="3 Iron">3 Iron</option>
              <option value="4 Iron">4 Iron</option>
              <option value="5 Iron">5 Iron</option>
              <option value="6 Iron">6 Iron</option>
              <option value="7 Iron">7 Iron</option>
              <option value="8 Iron">8 Iron</option>
              <option value="9 Iron">9 Iron</option>
              <option value="PW">Pitching Wedge</option>
              <option value="SW">Sand Wedge</option>
              <option value="LW">Lob Wedge</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Direction</label>
            <select
              value={formData.side}
              onChange={(e) => handleInputChange('side', e.target.value)}
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
        </div>
        
        <div className="form-actions">
          <button type="button" onClick={() => setIsOpen(false)}>
            Cancel
          </button>
          <button type="submit">
            Add Shot
          </button>
        </div>
      </form>
    </div>
  );
}