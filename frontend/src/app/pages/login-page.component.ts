import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [FormsModule],
  template: `
    <main class="page">
      <form class="card" (ngSubmit)="submit()">
        <div class="heading">
          <p class="eyebrow">Jambo Travel Planner</p>
          <h1>Sign in</h1>
          <p class="subtext">Use the demo account to access the planner.</p>
        </div>

        <label>
          <span>Username</span>
          <input name="username" [(ngModel)]="username" type="text">
        </label>

        <label>
          <span>Password</span>
          <input name="password" [(ngModel)]="password" type="password">
        </label>

        <button type="submit" [disabled]="isSubmitting">
          {{ isSubmitting ? 'Signing in...' : 'Sign in' }}
        </button>

        @if (errorMessage) {
          <p class="error">{{ errorMessage }}</p>
        }
      </form>
    </main>
  `,
  styles: [
    `
      .page {
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 24px;
        background: linear-gradient(180deg, #f6f8fb 0%, #eef3f8 100%);
      }

      .card {
        width: min(100%, 360px);
        display: grid;
        gap: 18px;
        padding: 28px;
        background: #ffffff;
        border: 1px solid #d9e2ec;
        border-radius: 16px;
        box-shadow: 0 18px 40px rgba(15, 23, 42, 0.08);
      }

      .heading {
        display: grid;
        gap: 6px;
      }

      .heading h1,
      .heading p {
        margin: 0;
      }

      .eyebrow {
        font-size: 12px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        color: #355070;
      }

      .subtext {
        color: #52606d;
      }

      label {
        display: grid;
        gap: 6px;
        color: #243b53;
        font-size: 14px;
      }

      input {
        padding: 12px 14px;
        font: inherit;
        border: 1px solid #bcccdc;
        border-radius: 10px;
        background: #f8fbff;
      }

      input:focus {
        outline: 2px solid #9fb3c8;
        outline-offset: 1px;
        border-color: #829ab1;
      }

      button {
        padding: 12px 14px;
        font: inherit;
        border: 0;
        border-radius: 10px;
        background: #1f3c88;
        color: #ffffff;
        font-weight: 600;
        cursor: pointer;
      }

      button:disabled {
        cursor: default;
        opacity: 0.7;
      }

      .error {
        margin: 0;
        padding: 12px 14px;
        border-radius: 10px;
        background: #fff1f0;
        color: #b42318;
      }
    `
  ]
})
export class LoginPageComponent {
  username = 'demo';
  password = 'demo123';
  errorMessage = '';
  isSubmitting = false;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  // Handle login submission
  submit(): void {
    this.errorMessage = '';
    this.isSubmitting = true;

    this.authService.login(this.username, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.accessToken);
        void this.router.navigate(['/planner']);
      },
      error: () => {
        this.errorMessage = 'Login failed. Please check your credentials.';
        this.isSubmitting = false;
      },
      complete: () => {
        this.isSubmitting = false;
      }
    });
  }
}
