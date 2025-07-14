export interface HistoricalDataPoint {
  time: string;
  surfaceTemp: number;
  voltage: number;
  power: number;
}

export interface PumpLog {
  id: number;
  timestamp: string;
  preCoolTemp: number;
  postCoolTemp: number;
  duration: string;
}
