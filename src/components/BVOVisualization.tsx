import React, { useState, useEffect, useMemo } from 'react';
import { BVOData, CityData, LegendState } from '../types/types';
import styles from './BVOVisualization.module.css';

interface Props {
  cities: CityData[];
}

export const BVOVisualization: React.FC<Props> = ({ cities }) => {
  // State management
  const [selectedCity, setSelectedCity] = useState<string>(cities[0]?.name || '');
  const [legendStates, setLegendStates] = useState<LegendState[]>([]);
  const [hoveredRing, setHoveredRing] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ year: string; value: number; x: number; y: number } | null>(null);

  // Calculate the maximum radius across all cities for scaling
  const maxRadius = useMemo(() => {
    return Math.max(...cities.map(city => 
      Math.sqrt(city.bvoData[city.bvoData.length - 1].cumulative)
    ));
  }, [cities]);

  // Initialize legend states when selected city changes
  useEffect(() => {
    const cityData = cities.find(city => city.name === selectedCity);
    if (cityData) {
      const newLegendStates = cityData.bvoData.map(data => ({
        year: data.year,
        isVisible: true,
        isActive: data.value > 0
      }));
      setLegendStates(newLegendStates);
    }
  }, [selectedCity, cities]);

  // Calculate ring dimensions
  const calculateRingDimensions = (data: BVOData) => {
    const radius = (Math.sqrt(data.cumulative) / maxRadius) * 200; // Scale to 400px max diameter
    return radius;
  };

  // Render rings
  const renderRings = () => {
    const cityData = cities.find(city => city.name === selectedCity);
    if (!cityData) return null;

    // Sort data from newest to oldest
    const sortedData = [...cityData.bvoData].reverse();
    
    return sortedData.map((data, index) => {
      const radius = calculateRingDimensions(data);
      const isVisible = legendStates[legendStates.length - 1 - index]?.isVisible;
      
      if (!isVisible) return null;

      return (
        <circle
          key={data.year}
          cx="250"
          cy="250"
          r={radius}
          className={styles.ring}
          style={{
            opacity: hoveredRing === data.year ? 1 : 0.7,
            fill: `hsl(${(index * 360) / sortedData.length}, 70%, 50%)`
          }}
          onMouseEnter={() => setHoveredRing(data.year)}
          onMouseLeave={() => setHoveredRing(null)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setTooltip({
              year: data.year,
              value: data.value,
              x: rect.left + window.scrollX,
              y: rect.top + window.scrollY
            });
          }}
        />
      );
    });
  };

  return (
    <div className={styles.container}>
      <select 
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
        className={styles.citySelect}
      >
        {cities.map(city => (
          <option key={city.name} value={city.name}>
            {city.name}
          </option>
        ))}
      </select>

      <div className={styles.visualizationContainer}>
        <svg width="500" height="500" className={styles.svg}>
          {renderRings()}
        </svg>
        
        {tooltip && (
          <div 
            className={styles.tooltip}
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            <p>Year: {tooltip.year}</p>
            <p>BVO Added: {tooltip.value.toLocaleString()} m²</p>
            <button onClick={() => setTooltip(null)}>Close</button>
          </div>
        )}
      </div>

      <div className={styles.legend}>
        {legendStates.map((state, index) => (
          <div 
            key={state.year}
            className={`${styles.legendItem} ${!state.isActive ? styles.inactive : ''}`}
          >
            <input
              type="checkbox"
              checked={state.isVisible}
              onChange={() => {
                const newStates = [...legendStates];
                newStates[index].isVisible = !newStates[index].isVisible;
                setLegendStates(newStates);
              }}
              disabled={!state.isActive}
            />
            <span style={{
              backgroundColor: `hsl(${(index * 360) / legendStates.length}, 70%, 50%)`
            }}>
              {state.year}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}; 