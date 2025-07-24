import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { jwtDecode } from 'jwt-decode';

export const roleGuard: CanActivateFn = (route, state) => {
  const cookiesService = inject(CookieService);
  const router = inject(Router);

  const token = cookiesService.get('token');
  const userStr = cookiesService.get('user');

  // ✅ Allow everyone (even unauthenticated) to access /shop
  if (state.url.startsWith('/shop')) {
    return true;
  }

  // ❌ If no token or user, redirect to /authentication
  if (!token || !userStr) {
    return router.createUrlTree(['/authentication']);
  }

  try {
    const decoded: any = jwtDecode(token);
    const exp = decoded.exp;

    if (Date.now() >= exp * 1000) {
      return router.createUrlTree(['/authentication']);
    }

    const user = JSON.parse(userStr);
    const role = user?.role;

    if (role === 'admin') {
      return true; // ✅ Admin can access everything
    }

    if (state.url.startsWith('/admin')) {
      return router.createUrlTree(['/shop']); // ❌ Non-admin can't access /admin
    }

    return true;
  } catch (e) {
    console.error('Error decoding JWT', e);
    return router.createUrlTree(['/authentication']);
  }
};
