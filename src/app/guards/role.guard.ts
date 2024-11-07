import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { FireService } from '../services/fire.service';
import { Observable } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  constructor(private fireService: FireService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    const requiredRole = route.data['role']; // El rol necesario definido en la ruta
    return this.fireService.getUserData().pipe(
      take(1),
      map(user => typeof user === 'object' && user !== null && 'role' in user && user.role === requiredRole),
      tap(isAuthorized => {
        if (!isAuthorized) {
          this.router.navigate(['/login']); // Redirige si no tiene acceso
        }
      })
    );
  }
}
