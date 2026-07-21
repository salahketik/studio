export interface DeadAirSettings {
  threshold: number; // dB threshold for silence (e.g., -40)
  minSilenceDuration: number; // ms to be considered silence
  padding: number; // ms to keep around voice
}

export const defaultDeadAirSettings: DeadAirSettings = {
  threshold: -45,
  minSilenceDuration: 300,
  padding: 100,
};

export interface AudioStats {
  originalDuration: number;
  newDuration: number;
  segmentsRemoved: number;
}
