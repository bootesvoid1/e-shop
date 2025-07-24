import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

export const authGuard: CanActivateFn = (route, state) => {
  const cookiesService = inject(CookieService);
  const router = inject(Router);

  const token = cookiesService.get('token');

  if (!token) {
    return router.createUrlTree(['/authentication']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;

    if (Date.now() >= exp * 1000) {
      return router.createUrlTree(['/authentication']);
    }

    const user = JSON.parse(cookiesService.get('user'));
    const role = user?.role;

    // ✅ Authenticated user accessing /authentication → redirect based on role
    if (state.url.startsWith('/authentication')) {
      if (role === 'admin') {
        return router.createUrlTree(['/admin']);
      } else {
        return router.createUrlTree(['/shop']);
      }
    }

    return true;
  } catch (error) {
    console.error('JWT Decode error:', error);
    return router.createUrlTree(['/authentication']);
  }
};
