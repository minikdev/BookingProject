import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  CanLoad,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { AuthService } from "./auth.service";
import { take, tap } from 'rxjs/operators';

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanLoad {
  constructor(private authService: AuthService, private router: Router) {}

  canLoad(
    route: import("@angular/router").Route,
    segments: import("@angular/router").UrlSegment[]
  ): boolean | Observable<boolean> | Promise<boolean> {
   

    return this.authService.userIsAuthenticated.pipe(take(1),tap(isAuthenticated=>{
      if (!isAuthenticated) {
        this.router.navigateByUrl("/auth");
      }
    }));
  }
}
