import { Injectable, OnDestroy, HostListener } from '@angular/core';
import { StorageService } from "./storage.service";

@Injectable()
export class AuthService {


  isLogged: boolean;
  isAdmin: boolean;
  private remember: boolean = false;
  readonly authKey = "User";
  constructor(private storage:StorageService) {
  }

  public setUser(user: string, remember: boolean): void {
    this.remember = remember;
    let userInfo = JSON.stringify({ User: user, Remember: remember });
    this.storage.setItem(this.authKey, userInfo.toString());
    this.isLogged = true;
  }

  public isAuthenticated(): boolean {
      return !!this.storage.getItem(this.authKey);
  }

  public getUser(): string {
    if (this.isAuthenticated()) {
        return JSON.parse(this.storage.getItem(this.authKey)).User;
    }
    return null;
  }

  public isRemember(): boolean {
    return this.remember;
  }
  
  public logOut(): void {
      this.storage.removeItem(this.authKey);
  }

}
