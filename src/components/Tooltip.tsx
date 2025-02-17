import React from "react";

interface TooltipProps {
  year: string;
  bvo: number;
  x: number;
  y: number;
  visible: boolean;
}

const Tooltip: React.FC<TooltipProps> = ({ year, bvo, x, y, visible }) => {
  if (!visible) return null;

  return (
    <div
      className="tooltip"
      style={{
        position: "absolute",
        left: x + 10,
        top: y + 10,
        background: "white",
        border: "1px solid black",
        padding: "5px",
        borderRadius: "4px",
      }}
    >
      <strong>{year}</strong>: {bvo.toLocaleString()} m² BVO
    </div>
  );
};

export default Tooltip;
