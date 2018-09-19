import { Component, OnChanges, SimpleChanges, DoCheck } from '@angular/core';
import * as Authservice from "../../../Services/auth.service";
import AuthService = Authservice.AuthService;
import * as Userservice from "../../../Services/user.service";
import UserService = Userservice.UserService;
import { Router } from '@angular/router';

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrls: ['./nav-menu.component.scss']
})
/** nav-menu component*/
export class NavMenuComponent {
  //ngOnChanges(changes: SimpleChanges): void {
  //  var x = 3;
  //} /** nav-menu ctor */

  //ngDoCheck() {
  //  if (this.auth.isAuthenticated() && !this.userService.GetUser()) {
  //    this.userService.setUser();
  //  }
  //}
  public onLogin(): void {
    this.router.navigate(['login',this.router.url]);
  }

    constructor(public auth: AuthService,private userService:UserService,private router: Router) {
    }
  isExpanded = false;

  collapse() {
    this.isExpanded = false;
  }

  toggle() {
    this.isExpanded = !this.isExpanded;
  }

  private logoutUser(): void {
    this.auth.logOut();
    this.userService.resetUserInfo();
  }
}
