import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { City, CityService } from '../services/city.service';
import { AuthService } from '../services/auth.service';
import { LocationService } from '../services/location.service';
import { DateForecast, TravelInfo, TravelService } from '../services/travel.service';

@Component({
  selector: 'app-planner-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="page">
      <section class="planner">
        <header class="hero card">
          <div>
            <p class="eyebrow">Travel Planner</p>
            <h1>Plan around live city details</h1>
            <p class="subtext">Browse supported cities and review current conditions before planning.</p>
          </div>
          <button type="button" class="secondary-button" (click)="logout()">Logout</button>
        </header>

        <section class="card controls">
          <div class="control-grid">
            <label>
              <span>Select a city</span>
              <select [(ngModel)]="selectedCityId" (ngModelChange)="onCityChange($event)">
                <option value="">Choose a city</option>
                @for (city of cities; track city.id) {
                  <option [value]="city.id">{{ city.name }} ({{ city.country }})</option>
                }
              </select>
            </label>

            <label>
              <span>Select a date</span>
              <input
                type="date"
                [(ngModel)]="selectedDate"
                [min]="minDate"
                [max]="maxDate"
                [disabled]="!selectedCityId"
                (ngModelChange)="onDateChange($event)"
              >
            </label>
          </div>
        </section>

        @if (isLoadingTravel) {
          <p class="message info">Loading travel info...</p>
        }

        @if (travelInfo) {
          <section class="content-grid">
            <section class="card section-card">
              <h2>{{ travelInfo.city.name }}</h2>
              <p class="muted">{{ travelInfo.city.country }}</p>
              <p>{{ travelInfo.city.description }}</p>
            </section>

            <section class="card section-card">
              <h3>Current Weather</h3>
              <div class="weather-grid">
                <p><strong>Temperature</strong><span>{{ travelInfo.weather.current.temperatureC.toFixed(0) }} &deg;C</span></p>
                <p><strong>Condition</strong><span>{{ travelInfo.weather.current.condition }}</span></p>
                <p><strong>Wind</strong><span>{{ travelInfo.weather.current.windKph.toFixed(2) }} kph</span></p>
                <p><strong>Humidity</strong><span>{{ travelInfo.weather.current.humidity }}%</span></p>
              </div>
            </section>

            <section class="card section-card">
              <h3>Forecast for Selected Date</h3>

              @if (dateForecast) {
                <div class="date-forecast">
                  <p><strong>Date</strong><span>{{ dateForecast.date }}</span></p>
                  <p><strong>Condition</strong><span>{{ dateForecast.forecast.condition }}</span></p>
                  <p><strong>Min</strong><span>{{ dateForecast.forecast.minC.toFixed(0) }} &deg;C</span></p>
                  <p><strong>Max</strong><span>{{ dateForecast.forecast.maxC.toFixed(0) }} &deg;C</span></p>
                </div>
              }

              @if (!dateForecast && !dateForecastError) {
                <p class="muted">Choose a date to load a daily forecast.</p>
              }

              @if (dateForecastError) {
                <p class="message error">{{ dateForecastError }}</p>
              }
            </section>

            <section class="card section-card">
              <h3>Weekly Forecast</h3>
              <ul class="forecast">
                @for (day of travelInfo.weather.weekly; track day.date) {
                  <li>
                    <span class="forecast-date">{{ day.date }}</span>
                    <span>{{ day.condition }}</span>
                    <span>{{ day.minC.toFixed(0) }} &deg;C to {{ day.maxC.toFixed(0) }} &deg;C</span>
                  </li>
                }
              </ul>
            </section>
          </section>
        }

        @if (!travelInfo && !isLoadingTravel && !errorMessage && cities.length > 0) {
          <p class="message">Select a city to view travel info.</p>
        }

        @if (errorMessage) {
          <p class="message error">{{ errorMessage }}</p>
        }
      </section>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        padding: 24px;
        background: linear-gradient(180deg, #f6f8fb 0%, #eef3f8 100%);
      }

      .planner {
        width: min(100%, 920px);
        margin: 0 auto;
        display: grid;
        gap: 18px;
      }

      .card {
        background: #ffffff;
        border: 1px solid #d9e2ec;
        border-radius: 16px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }

      .hero {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        gap: 16px;
        padding: 24px;
      }

      .hero h1,
      .hero p {
        margin: 0;
      }

      .eyebrow {
        margin: 0 0 8px;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #355070;
      }

      .subtext,
      .muted {
        color: #52606d;
      }

      .controls,
      .section-card {
        padding: 20px 24px;
      }

      .controls {
        display: grid;
        gap: 12px;
      }

      .control-grid {
        display: grid;
        gap: 12px;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
      }

      label {
        display: grid;
        gap: 6px;
        color: #243b53;
        font-size: 14px;
      }

      select,
      input[type='date'] {
        padding: 12px 14px;
        font: inherit;
        border: 1px solid #bcccdc;
        border-radius: 10px;
        background: #f8fbff;
      }

      button {
        padding: 12px 14px;
        font: inherit;
        border-radius: 10px;
        cursor: pointer;
      }

      .secondary-button {
        border: 1px solid #bcccdc;
        background: #ffffff;
        color: #102a43;
        font-weight: 600;
      }

      .content-grid {
        display: grid;
        gap: 18px;
      }

      .section-card {
        display: grid;
        gap: 12px;
      }

      .section-card h2,
      .section-card h3,
      .section-card p {
        margin: 0;
      }

      .weather-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
      }

      .weather-grid p,
      .date-forecast p {
        margin: 0;
        display: grid;
        gap: 4px;
        padding: 12px 14px;
        background: #f8fbff;
        border: 1px solid #d9e2ec;
        border-radius: 12px;
      }

      .weather-grid span {
        color: #243b53;
      }

      .date-forecast {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
        gap: 12px;
      }

      .date-forecast span {
        color: #243b53;
      }

      .forecast {
        list-style: none;
        margin: 0;
        padding: 0;
        display: grid;
        gap: 10px;
      }

      .forecast li {
        display: grid;
        gap: 4px;
        padding: 12px 14px;
        background: #f8fbff;
        border: 1px solid #d9e2ec;
        border-radius: 12px;
      }

      .forecast-date {
        font-weight: 600;
        color: #102a43;
      }

      .message {
        margin: 0;
        padding: 14px 16px;
        border-radius: 12px;
        background: #ffffff;
        border: 1px solid #d9e2ec;
        color: #334e68;
      }

      .info {
        background: #f8fbff;
      }

      .error {
        background: #fff1f0;
        border-color: #f7c6c2;
        color: #b42318;
      }

      @media (max-width: 640px) {
        .page {
          padding: 16px;
        }

        .hero {
          flex-direction: column;
        }
      }
    `
  ]
})
export class PlannerPageComponent implements OnInit {
  cities: City[] = [];
  selectedCityId = '';
  selectedDate = '';
  travelInfo: TravelInfo | null = null;
  dateForecast: DateForecast | null = null;
  dateForecastError = '';
  errorMessage = '';
  isLoadingTravel = false;
  minDate = this.formatDate(new Date());
  maxDate = this.getMaxDate();

  private readonly authService = inject(AuthService);
  private readonly cityService = inject(CityService);
  private readonly locationService = inject(LocationService);
  private readonly router = inject(Router);
  private readonly travelService = inject(TravelService);

  ngOnInit(): void {
    //Redirect unauthenticated users before any protected planner requests run.
    if (!this.authService.getToken()) {
      void this.router.navigate(['/login']);
      return;
    }

    //Load cities and select the default city based on the user's location.
    this.cityService.getCities().subscribe({
      next: (cities) => {
        this.cities = cities;
        if (cities.length > 0) {
          this.selectDefaultCity();
        }
      },
      error: () => {
        this.errorMessage = 'Unable to load cities.';
      }
    });
  }

  // When the city changes, load the new city's travel info
  onCityChange(cityId: string): void {
    this.loadTravelInfo(cityId);

    if (this.selectedDate) {
      this.loadDateForecast(cityId, this.selectedDate);
    }
  }

  // When the date changes, load the new date's forecast but only if a city is already selected
  onDateChange(date: string): void {
    this.dateForecast = null;
    this.dateForecastError = '';

    if (!date || !this.selectedCityId) {
      return;
    }

    this.loadDateForecast(this.selectedCityId, date);
  }

  // Clear user session and redirect to login page.
  logout(): void {
    this.authService.logout();
    void this.router.navigate(['/login']);
  }

  // Prefer the backend's IP-based match, but keep a predictable first-city fallback.
  private selectDefaultCity(): void {
    this.locationService.getCurrentCity().subscribe({
      next: (response) => {
        const matchedCity = this.cities.find((city) => city.id === response.matchedCityId);

        if (matchedCity) {
          this.selectedCityId = matchedCity.id;
          this.loadTravelInfo(this.selectedCityId);
          return;
        }

        this.selectFirstCity();
      },
      error: () => {
        this.selectFirstCity();
      }
    });
  }

  /*
   * Load travel information for the selected city.
   * Clear stale travel info and errors as soon as a new city request begins.
   */
  private loadTravelInfo(cityId: string): void {
    if (!cityId) {
      this.travelInfo = null;
      return;
    }

    this.travelInfo = null;
    this.isLoadingTravel = true;
    this.errorMessage = '';

    this.travelService.getTravelInfo(cityId).subscribe({
      next: (travelInfo) => {
        this.travelInfo = travelInfo;
      },
      error: () => {
        this.travelInfo = null;
        this.errorMessage = 'Unable to load travel info.';
        this.isLoadingTravel = false;
      },
      complete: () => {
        this.isLoadingTravel = false;
      }
    });
  }

  // If the user's location doesn't match any supported cities, select the first city in the list and load its info.
  private selectFirstCity(): void {
    this.selectedCityId = this.cities[0].id;
    this.loadTravelInfo(this.selectedCityId);

    if (this.selectedDate) {
      this.loadDateForecast(this.selectedCityId, this.selectedDate);
    }
  }

  /*
   * Load the forecast for the selected date, but only if a city is already selected.
   * Clear stale forecast content and errors as soon as a new date request begins.
  */
  private loadDateForecast(cityId: string, date: string): void {
    this.dateForecast = null;
    this.dateForecastError = '';

    this.travelService.getForecastByDate(cityId, date).subscribe({
      next: (forecast) => {
        this.dateForecast = forecast;
      },
      error: () => {
        this.dateForecastError = 'Unable to load forecast for the selected date.';
      }
    });
  }

  /**
   * Returns the latest selectable date using the same "today + 5 days"
   * rule enforced by the backend forecast endpoint.
   */
  private getMaxDate(): string {
    const date = new Date();
    date.setDate(date.getDate() + 5);
    return this.formatDate(date);
  }

  /**
   * Formats a Date as YYYY-MM-DD for the native date input and API query.
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}
