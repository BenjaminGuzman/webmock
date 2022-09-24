import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import { Observable } from 'rxjs';
import {SessionService} from "./session.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  private readonly forbiddenUrl: UrlTree;

  constructor(private jwtService: SessionService, private router: Router) {
    this.forbiddenUrl = router.parseUrl("/forbidden");
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (this.jwtService.jwt)
      return true;

    return this.forbiddenUrl;
  }

}
