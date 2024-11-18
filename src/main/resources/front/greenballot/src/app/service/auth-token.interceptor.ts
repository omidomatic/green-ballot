import { HttpInterceptorFn } from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import {inject} from "@angular/core";
import {Router} from "@angular/router";

export const authTokenInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('access_token');

  // Skip certain endpoints
  if (req.url.includes('api/v1/captcha') || req.url.includes('api/v1/auth')) {
    return next(req);
  }

  // If token exists, clone the request and add the Authorization header
  if (token) {
    const clonedRequest = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    console.log('Auth token added via interceptor');
    console.log(localStorage.getItem('access_token'))
    return next(clonedRequest).pipe(
      catchError((error) => {
        if (error.status === 403) {
          // Redirect to login page on 403 error
          router.navigate(['/login']);
        }
        return throwError(error);
      })
    );
  }

  // Otherwise, pass the request as is and handle errors
  return next(req).pipe(
    catchError((error) => {
      if (error.status === 403) {
        // Redirect to login page on 403 error
        router.navigate(['/login']);
      }
      return throwError(error);
    })
  );
};
