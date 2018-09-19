import { Injectable } from '@angular/core';
import * as Authservice from "./auth.service";
import AuthService = Authservice.AuthService;
import * as User1 from "../app/Models/user";
import User = User1.User;
import { StorageService } from "./storage.service";

@Injectable()
export class UserService {
  private user:User;
  private userName: string;
  private isGuest: boolean = true;
  constructor(private auth: AuthService,private storage:StorageService) {
    if (!auth.isAuthenticated()) {
      this.userName = "Guest";
    } else {
   //   this.user = this.GetUser();
      this.user = this.GetUser();
    }
    this.isGuest = !auth.isAuthenticated();
  }

  public setUser(user: User) {
    this.user = user;
    this.isGuest = false;
    this.userName = user.username;
    if (typeof window !== 'undefined') {
      localStorage.setItem("UserInfo", JSON.stringify(this.user));
    }
  }


  public IsGuest(): boolean {
    return this.isGuest;
  }

  public setUserName(name: string): void {
    this.userName = name;
    if (this.user) {
      this.user.username = name;
    }  
  }

  public resetUserInfo(): void {
    this.user.username = "Guest";
    this.isGuest = true;
      this.storage.removeItem("UserInfo");
  }

  public GetUserName(): string {
    if (this.IsGuest() || !this.user && (!this.auth.isAuthenticated())) {
      return this.userName;
    }
    return this.GetUser() && this.GetUser().username;
  }

  public GetUser(): User {
    if (!this.auth.isAuthenticated() && !this.user)
      return null;
    if (this.user) {
      return this.user;
    }
    var userJson = this.storage.getItem("UserInfo");
    var user = null;
    if (userJson) {
      user = JSON.parse(userJson) as User;
    }
    return user;
  }

  public UpdateUser(): void {
    var userJson = this.storage.getItem("UserInfo");
    if (userJson) {
      this.user = JSON.parse(userJson) as User;
      this.userName = this.user.username;
    } else {
      this.user = null;
      this.userName = "Guest";
    }
  }

  public isAdmin(): boolean {
    var user = this.GetUser();
    return user && user.admin;
  }

}
