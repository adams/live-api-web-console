import { memo } from "react";
import "./rep-logger.scss";

export interface RepLogEntry {
  id: string;
  timestamp: Date;
  quality: "good" | "fair" | "poor";
  form_score: number;
  feedback: string;
  description: string;
}

interface RepLoggerProps {
  entries: RepLogEntry[];
  maxVisible?: number;
}

const RepLogger = memo(({ entries, maxVisible = 20 }: RepLoggerProps) => {
  // Show most recent entries, up to maxVisible
  const visibleEntries = entries.slice(-maxVisible);
  
  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "good": return "green";
      case "fair": return "yellow"; 
      case "poor": return "red";
      default: return "gray";
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "good": return "check_circle";
      case "fair": return "warning";
      case "poor": return "error";
      default: return "help";
    }
  };

  return (
    <div className="rep-logger">
      <div className="rep-logger-header">
        <h3>Repetition Logger</h3>
        <span className="rep-count">{entries.length} repetitions</span>
      </div>
      
      <div className="rep-timeline">
        {visibleEntries.length === 0 ? (
          <div className="empty-state">
            <span className="material-symbols-outlined">fitness_center</span>
            <p>No repetitions detected yet</p>
          </div>
        ) : (
          <div className="rep-indicators">
            {visibleEntries.map((entry, index) => (
              <div
                key={entry.id}
                className={`rep-indicator ${getQualityColor(entry.quality)}`}
                title={`Repetition ${index + 1}: ${entry.quality} (${entry.form_score}%) - ${entry.feedback}`}
              >
                <span className="material-symbols-outlined filled">
                  {getQualityIcon(entry.quality)}
                </span>
                <span className="rep-number">{entries.length - visibleEntries.length + index + 1}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {entries.length > 0 && (
        <div className="rep-summary">
          <div className="quality-stats">
            <div className="stat good">
              <span className="material-symbols-outlined">check_circle</span>
              <span>{entries.filter(e => e.quality === "good").length}</span>
            </div>
            <div className="stat fair">
              <span className="material-symbols-outlined">warning</span>
              <span>{entries.filter(e => e.quality === "fair").length}</span>
            </div>
            <div className="stat poor">
              <span className="material-symbols-outlined">error</span>
              <span>{entries.filter(e => e.quality === "poor").length}</span>
            </div>
          </div>
          
          {entries.length > 0 && (
            <div className="latest-feedback">
              <strong>Latest:</strong> {entries[entries.length - 1].feedback}
            </div>
          )}
        </div>
      )}
    </div>
  );
});

export default RepLogger;