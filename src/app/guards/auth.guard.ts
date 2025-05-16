import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(authService.currentUser);

  if (!user) {
    router.navigateByUrl('/login');
    return false;
  }

  return true;
};

export const authRedirectGuard: CanActivateFn = async (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const user = await firstValueFrom(authService.currentUser);

  if (user) {
    router.navigateByUrl("/profile");
    return false;
  }
  return true;
};
