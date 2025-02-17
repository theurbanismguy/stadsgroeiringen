import React from "react";

interface LegendProps {
  periods: string[];
  activePeriods: Set<string>;
  togglePeriod: (period: string) => void;
}

const Legend: React.FC<LegendProps> = ({ periods, activePeriods, togglePeriod }) => {
  return (
    <div className="legend">
      {periods.map((period) => (
        <button
          key={period}
          className={`legend-item ${activePeriods.has(period) ? "active" : "inactive"}`}
          onClick={() => togglePeriod(period)}
        >
          {period}
        </button>
      ))}
    </div>
  );
};

export default Legend;
