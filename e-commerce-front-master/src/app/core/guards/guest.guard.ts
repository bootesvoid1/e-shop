// guest.guard.ts
import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

export const guestGuard: CanActivateFn = (route, state) => {
  const cookiesService = inject(CookieService);
  const router = inject(Router);

  const token = cookiesService.get('token');

  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const exp = decoded.exp;

      if (Date.now() < exp * 1000) {
        return router.createUrlTree(['/shop']);
      }
    } catch (e) {
      console.error('Invalid token in guestGuard:', e);
    }
  }

  return true;
};
