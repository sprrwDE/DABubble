import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../shared/services/user.service';

export const authGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService); // Überprüfe auf ein Login-Token
  const router = inject(Router);

  if (userService.isLoggedIn()) {
    return true; // Zugriff gewähren
  } else {
    router.navigate(['/login']); // Umleitung zur Login-Seite
    return false; // Zugriff verweigern
  }
};
