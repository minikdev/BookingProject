import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { environment } from "../../environments/environment";

import { BehaviorSubject } from "rxjs";
import { User } from "./user.model";
import { map,tap } from "rxjs/operators";
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  get userId() {
    return this._user.asObservable().pipe(
      map((userData) => {
        if (userData) {
          return userData.id;
        } else {
          return null;
        }
      })
    );
  }

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((userData) => {
        if (userData) {
          return !!userData.token;
        } else {
          return false;
        }
      })
    );
  }
  constructor(private http: HttpClient) {}

  signup(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.fireBaseAPIKey}`,
      { email: email, password: password, returnSecureToken: true }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.fireBaseAPIKey}`,
      { email: email, password: password }
    ).pipe(tap(this.setUserData.bind(this)));
  }

  logout() {
    this._user.next(null);
  }

   private setUserData(userData:AuthResponseData){
    
      const expirationTime = new Date(new Date().getTime()+ (+userData.expiresIn*1000));
      this._user.next(new User(userData.localId,userData.email,userData.idToken,expirationTime));
    
   }

}
