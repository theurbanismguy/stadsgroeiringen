import { useState, useEffect } from "react";
import Dropdown from "../components/Dropdown";
import RingChart from "../components/RingChart";
import Legend from "../components/Legend";

export default function Home() {
  const [municipalities, setMunicipalities] = useState<string[]>([]);
  const [selectedMunicipality, setSelectedMunicipality] = useState<string | null>(null);
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activePeriods, setActivePeriods] = useState<Set<string>>(new Set());

  // Fetch dataset from public/bvo.json when component mounts
  useEffect(() => {
    fetch("/bvo.json")
      .then((response) => {
        if (!response.ok) throw new Error("Failed to load data");
        return response.json();
      })
      .then((jsonData) => {
        setData(jsonData);
        const municipalNames = jsonData.map((d: any) => d.Gemeentenaam);
        setMunicipalities(municipalNames);
        setSelectedMunicipality(municipalNames[0]); // Default to first municipality
        setActivePeriods(new Set(Object.keys(jsonData[0]).filter(key => key !== "Gemeentenaam"))); // Initialize legend toggle
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Get selected municipality's data
  const selectedData = data.find((d) => d.Gemeentenaam === selectedMunicipality) || {};

  // Toggle active periods in the legend
  const togglePeriod = (period: string) => {
    setActivePeriods((prev) => {
      const updated = new Set(prev);
      if (updated.has(period)) updated.delete(period);
      else updated.add(period);
      return updated;
    });
  };

  return (
    <div>
      <h1>Stadsgroeiringen</h1>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && municipalities.length > 0 && (
        <>
          <Dropdown
            municipalities={municipalities}
            selectedMunicipality={selectedMunicipality!}
            setSelectedMunicipality={setSelectedMunicipality}
          />

          <Legend
            periods={Object.keys(selectedData).filter((key) => key !== "Gemeentenaam")}
            activePeriods={activePeriods}
            togglePeriod={togglePeriod}
          />

          <RingChart data={selectedData} width={500} height={500} activePeriods={activePeriods} />
        </>
      )}
    </div>
  );
}
