import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private _jwt: string | null = null;

  constructor() { }

  /**
   * Loads the JWT from local storage
   * @private
   */
  private loadJWT() {
    this._jwt = localStorage.getItem("jwt");
  }

  get jwt(): string | null {
    if (!this._jwt)
      this.loadJWT();

    return this._jwt;
  }

  set jwt(jwt: string | null) {
    this._jwt = jwt;

    if (jwt !== null)
      localStorage.setItem("jwt", jwt);
    else
      localStorage.removeItem("jwt");
  }

  /**
   * Set the JWT to null (close session)
   */
  public clear() {
    this.jwt = null;
  }
}
