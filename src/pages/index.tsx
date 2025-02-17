import { useState, useEffect } from 'react';
import { BVOVisualization } from '../components/BVOVisualization';
import { CityData, BVOData } from '../types/types';

// Function to transform raw JSON data into our CityData format
const transformData = (rawData: any[]): CityData[] => {
  return rawData.map(city => {
    const periods = Object.entries(city)
      .filter(([key]) => key !== "Gemeentenaam")
      .map(([year, value]) => ({
        year,
        value: Number(value)
      }))
      .sort((a, b) => {
        // Custom sort function to handle the special case of "<1400"
        if (a.year === "<1400") return -1;
        if (b.year === "<1400") return 1;
        return a.year.localeCompare(b.year);
      });

    // Calculate cumulative values
    let cumulative = 0;
    const bvoData: BVOData[] = periods.map(period => {
      cumulative += period.value;
      return {
        year: period.year,
        value: period.value,
        cumulative
      };
    });

    return {
      name: city.Gemeentenaam,
      bvoData
    };
  });
};

export default function Home() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/bvo.json')
      .then(response => {
        if (!response.ok) throw new Error('Failed to fetch data');
        return response.json();
      })
      .then(data => {
        const transformedData = transformData(data);
        setCities(transformedData);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!cities.length) return <div>No data available</div>;

  return (
    <main className="p-4">
      <h1 className="text-2xl font-bold mb-6">Dutch Cities BVO Visualization</h1>
      <BVOVisualization cities={cities} />
    </main>
  );
}
