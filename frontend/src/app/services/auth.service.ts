import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

// Type definition for the response from the login API
type LoginResponse = {
  accessToken: string;
  user: {
    username: string;
  };
};

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly tokenKey = 'accessToken';
  private readonly loginUrl = `${environment.apiBaseUrl}/auth/login`;

  // Perform login by sending credentials to the backend API
  login(username: string, password: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.loginUrl, { username, password });
  }

  // Save the access token in local storage for later use
  saveToken(token: string): void {
    localStorage.setItem(this.tokenKey, token);
  }

  // Retrieve the access token from local storage
  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  // Remove the access token from local storage to log out the user
  logout(): void {
    localStorage.removeItem(this.tokenKey);
  }
}
