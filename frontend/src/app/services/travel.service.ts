import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Type definition for the travel information response
export type TravelInfo = {
  city: {
    id: string;
    name: string;
    country: string;
    description: string;
  };
  weather: {
    current: {
      temperatureC: number;
      condition: string;
      windKph: number;
      humidity: number;
    };
    weekly: Array<{
      date: string;
      minC: number;
      maxC: number;
      condition: string;
    }>;
  };
};

// Type definition for the forecast by date response
export type DateForecast = {
  date: string;
  forecast: {
    minC: number;
    maxC: number;
    condition: string;
  };
};

@Injectable({ providedIn: 'root' })
export class TravelService {
  private readonly http = inject(HttpClient);
  private readonly travelBaseUrl = `${environment.apiBaseUrl}/travel`;

  // Fetch travel information for a specific city by its ID
  getTravelInfo(cityId: string): Observable<TravelInfo> {
    return this.http.get<TravelInfo>(`${this.travelBaseUrl}/cities/${cityId}`);
  }

  // Fetch the weather forecast for a specific city on a given date
  getForecastByDate(cityId: string, date: string): Observable<DateForecast> {
    return this.http.get<DateForecast>(
      `${this.travelBaseUrl}/cities/${cityId}/forecast?date=${date}`,
    );
  }
}
