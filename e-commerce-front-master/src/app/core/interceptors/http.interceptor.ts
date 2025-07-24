import { HttpEvent, HttpHandlerFn, HttpRequest } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { LoaderService } from '../services/loader.service';
import { inject } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

export function LoaderInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const loaderService = inject(LoaderService);
  const cookieService = inject(CookieService);
  loaderService.show();
  const token = cookieService.get('token');

  // Add Authorization header if token exists
  const authReq = token
    ? req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`),
      })
    : req;

  return next(authReq).pipe(finalize(() => loaderService.hide()));
}
