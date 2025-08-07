import React from 'react';
import { useDrill } from '../../contexts/DrillContext';
import { DrillKey, availableDrills } from '../../lib/drill-data';
import './drill-picker.scss';

const DrillPicker: React.FC = () => {
  const { currentDrillKey, setCurrentDrill } = useDrill();

  const handleDrillChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newDrillKey = event.target.value as DrillKey;
    setCurrentDrill(newDrillKey);
  };

  // Get display names for the drills
  const getDrillDisplayName = (drillKey: DrillKey): string => {
    const drill = availableDrills[drillKey];
    return drill.title;
  };

  return (
    <div className="drill-picker">
      <label htmlFor="drill-select" className="drill-picker-label">
        Choose Your Drill:
      </label>
      <select
        id="drill-select"
        value={currentDrillKey}
        onChange={handleDrillChange}
        className="drill-picker-select"
      >
        {Object.keys(availableDrills).map((drillKey) => (
          <option key={drillKey} value={drillKey}>
            {getDrillDisplayName(drillKey as DrillKey)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DrillPicker;