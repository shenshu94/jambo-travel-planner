import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Type definition for a city object
export type City = {
  id: string;
  name: string;
  country: string;
  lat: number;
  lon: number;
};

@Injectable({ providedIn: 'root' })
export class CityService {
  private readonly http = inject(HttpClient);
  private readonly citiesUrl = `${environment.apiBaseUrl}/cities`;

  // Fetch the list of cities from the backend API
  getCities(): Observable<City[]> {
    return this.http.get<City[]>(this.citiesUrl);
  }
}
