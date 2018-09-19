import { Component, HostListener } from '@angular/core';
import * as Navigationservice from "../Services/navigation.service";
import NavigationService = Navigationservice.NavigationService;
import { Router } from '@angular/router';
import * as Core from "@angular/core";
import * as Core1 from "@angular/core";
import * as Authservice from "../Services/auth.service";
import AuthService = Authservice.AuthService;
import * as Userservice from "../Services/user.service";
import UserService = Userservice.UserService;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  constructor(public nav: NavigationService, private router: Router, private auth: AuthService,
    private user: UserService) { }

  public isAdmin(): boolean {
    return this.nav.isAdmin(this.router.url);
  }
  //@HostListener('window:unload', ['$event'])
  //unloadHandler(event) {
  //  if (!this.auth.isRemember()) {
  //    this.auth.logOut();
  //  } 
  //}
  //ngDoCheck() {
  //  if (this.auth.isAuthenticated() && this.user.IsGuest()) {
  //    this.user.UpdateUser();
  //  }
  //  else if (!this.auth.isAuthenticated() && this.user.GetUser()) {
  //    this.user.UpdateUser();
  //    this.router.navigate(['']);
  //  }
  //}
}
