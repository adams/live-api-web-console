import { useCallback, useEffect, useState } from "react";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

export default function ProactiveAudioSelector() {
  const { config, setConfig } = useLiveAPIContext();
  const [isEnabled, setIsEnabled] = useState<boolean>(true); // Default to enabled for golf instruction

  // Sync with loaded config
  useEffect(() => {
    if (config.proactivity?.proactiveAudio !== undefined) {
      setIsEnabled(config.proactivity.proactiveAudio);
    }
  }, [config.proactivity?.proactiveAudio]);

  const updateConfig = useCallback(
    (enabled: boolean) => {
      setConfig({
        ...config,
        proactivity: {
          ...config.proactivity,
          proactiveAudio: enabled,
        },
      });
    },
    [config, setConfig]
  );

  const handleToggle = useCallback(() => {
    const newValue = !isEnabled;
    setIsEnabled(newValue);
    updateConfig(newValue);
  }, [isEnabled, updateConfig]);

  return (
    <div className="form-row">
      <label htmlFor="proactiveAudioToggle">Proactive Audio</label>
      <div className="form-control">
        <div className="toggle-control">
          <input
            id="proactiveAudioToggle"
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="toggle-input"
          />
          <label htmlFor="proactiveAudioToggle" className="toggle-label">
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-text">
            {isEnabled ? "Enabled" : "Disabled"}
          </span>
        </div>
        <div className="help-text">
          <strong>When enabled:</strong> AI can choose not to respond to irrelevant content
          <br />
          <strong>Perfect for:</strong> TV background noise, driving range sounds, or busy environments
        </div>
      </div>
    </div>
  );
}