import { HttpInterceptorFn } from '@angular/common/http';

// Interceptor to add the access token to outgoing HTTP requests
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('accessToken');

  // If no token is found, proceed with the original request
  if (!token) {
    return next(req);
  }

  return next(
    req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    })
  );
};
