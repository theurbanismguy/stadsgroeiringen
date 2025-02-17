import React, { useState } from "react";
import Tooltip from "./Tooltip";

interface RingChartProps {
  data: { [year: string]: number };
  width: number;
  height: number;
  activePeriods: Set<string>;  // ✅ Add this to fix the TypeScript error
}

const RingChart: React.FC<RingChartProps> = ({ data, width, height, activePeriods }) => {
  const [tooltip, setTooltip] = useState({ visible: false, x: 0, y: 0, year: "", bvo: 0 });

  // Convert raw data into cumulative BVO while filtering out inactive periods
  let cumulativeBVO = 0;
  const rings = Object.entries(data)
    .filter(([year]) => activePeriods.has(year))  // ✅ Only include active periods
    .map(([year, bvo]) => {
      cumulativeBVO += bvo;
      return { year, bvo, radius: Math.sqrt(cumulativeBVO) };
    })
    .reverse(); // Draw latest first, oldest on top

  return (
    <svg width={width} height={height}>
      {rings.map(({ year, radius, bvo }, index) => (
        <circle
          key={year}
          cx={width / 2}
          cy={height / 2}
          r={radius}
          fill="none"
          stroke="black"
          strokeWidth="2"
          onMouseEnter={(e) =>
            setTooltip({ visible: true, x: e.clientX, y: e.clientY, year, bvo })
          }
          onMouseLeave={() => setTooltip({ visible: false, x: 0, y: 0, year: "", bvo: 0 })}
        />
      ))}
      <Tooltip {...tooltip} />
    </svg>
  );
};

export default RingChart;
