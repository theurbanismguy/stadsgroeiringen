// Define the structure for our BVO data
export interface BVOData {
  year: string;        // Year/century (e.g., "1400s", "1990")
  value: number;       // BVO value for that period
  cumulative: number;  // Cumulative BVO up to this period
}

export interface CityData {
  name: string;        // Name of the municipality
  bvoData: BVOData[]; // Array of BVO data for each period
}

// Type for the legend item state
export interface LegendState {
  year: string;
  isVisible: boolean;
  isActive: boolean;   // For municipalities where value > 0
} 