import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
// Type definition for the response from the current city API
export type CurrentCityResponse = {
  detectedCity: string;
  matchedCityId: string;
  source: string;
};

@Injectable({ providedIn: 'root' })
export class LocationService {
  private readonly http = inject(HttpClient);
  private readonly currentCityUrl = `${environment.apiBaseUrl}/location/current-city`;

  // Fetch the user's current city based on their IP address
  getCurrentCity(): Observable<CurrentCityResponse> {
    return this.http.get<CurrentCityResponse>(this.currentCityUrl);
  }
}
