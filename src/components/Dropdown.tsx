import React from "react";

interface DropdownProps {
  municipalities: string[];
  selectedMunicipality: string;
  setSelectedMunicipality: (value: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({
  municipalities,
  selectedMunicipality,
  setSelectedMunicipality,
}) => {
  return (
    <div>
      <label htmlFor="municipality-select">Select a municipality: </label>
      <select
        id="municipality-select"
        value={selectedMunicipality}
        onChange={(e) => setSelectedMunicipality(e.target.value)}
      >
        {municipalities.map((municipality) => (
          <option key={municipality} value={municipality}>
            {municipality}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Dropdown;
