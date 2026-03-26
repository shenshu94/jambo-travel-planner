export interface City {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export const cities: City[] = [
  { id: 'edmonton', name: 'Edmonton', country: 'Canada', lat: 53.5461, lon: -113.4938 },
  { id: 'toronto', name: 'Toronto', country: 'Canada', lat: 43.6532, lon: -79.3832 },
  { id: 'london', name: 'London', country: 'United Kingdom', lat: 51.5072, lon: -0.1276 },
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', lat: 35.6762, lon: 139.6503 },
  { id: 'paris', name: 'Paris', country: 'France', lat: 48.8566, lon: 2.3522 },
];
