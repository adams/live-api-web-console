import { useCallback, useEffect, useState } from "react";
import Select from "react-select";
import { useLiveAPIContext } from "../../contexts/LiveAPIContext";

const turnCoverageOptions = [
  { value: "TURN_INCLUDES_ONLY_ACTIVITY", label: "Only during speech" },
  { value: "TURN_INCLUDES_ALL_INPUT", label: "All input (continuous)" },
];

export default function TurnCoverageSelector() {
  const { config, setConfig } = useLiveAPIContext();

  const [selectedOption, setSelectedOption] = useState<{
    value: string;
    label: string;
  } | null>(turnCoverageOptions[0]); // Default to "Only during speech"

  // Sync with loaded config
  useEffect(() => {
    if (config.realtimeInputConfig?.turnCoverage) {
      const turnCoverage = config.realtimeInputConfig.turnCoverage;
      if (turnCoverage !== selectedOption?.value) {
        const option = turnCoverageOptions.find(opt => opt.value === turnCoverage);
        if (option) {
          setSelectedOption(option);
        }
      }
    }
  }, [config.realtimeInputConfig?.turnCoverage, selectedOption?.value]);

  const updateConfig = useCallback(
    (turnCoverage: "TURN_INCLUDES_ONLY_ACTIVITY" | "TURN_INCLUDES_ALL_INPUT") => {
      setConfig({
        ...config,
        realtimeInputConfig: {
          ...config.realtimeInputConfig,
          turnCoverage: turnCoverage as any,
        },
      });
    },
    [config, setConfig]
  );

  return (
    <div className="form-row">
      <label htmlFor="turnCoverageSelector">Turn Coverage</label>
      <div className="form-control">
        <Select
          id="turnCoverageSelector"
          className="react-select-container"
          classNamePrefix="react-select"
          styles={{
            control: (styles, { isFocused }) => ({
              ...styles,
              backgroundColor: "var(--Neutral-10)",
              borderColor: isFocused
                ? "var(--Blue-500)"
                : "var(--Neutral-30)",
              color: "var(--Neutral-90)",
              boxShadow: isFocused ? "0 0 0 1px var(--Blue-500)" : "none",
              "&:hover": {
                borderColor: isFocused
                  ? "var(--Blue-500)"
                  : "var(--Neutral-30)",
              },
            }),
            singleValue: (styles) => ({
              ...styles,
              color: "var(--Neutral-90)",
            }),
            option: (styles, { isFocused, isSelected }) => ({
              ...styles,
              backgroundColor: isSelected
                ? "var(--Blue-500)"
                : isFocused
                ? "var(--Neutral-20)"
                : "var(--Neutral-10)",
              color: isSelected ? "white" : "var(--Neutral-90)",
            }),
            menu: (styles) => ({
              ...styles,
              backgroundColor: "var(--Neutral-10)",
              border: "1px solid var(--Neutral-30)",
            }),
          }}
          value={selectedOption}
          options={turnCoverageOptions}
          onChange={(e) => {
            setSelectedOption(e);
            if (e) {
              updateConfig(e.value as any);
            }
          }}
        />
        <div className="help-text">
          <strong>Only during speech:</strong> AI processes audio/video only when you're speaking
          <br />
          <strong>All input (continuous):</strong> AI processes all audio/video input continuously
        </div>
      </div>
    </div>
  );
}