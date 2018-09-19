import { Component } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import user = require("../../Models/user");
import User = user.User;
import Authservice = require("../../../Services/auth.service");
import AuthService = Authservice.AuthService;
import Userservice = require("../../../Services/user.service");
import UserService = Userservice.UserService;

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.css']
})
/** log-in component*/
export class LogInComponent {
  /** log-in ctor */
  private returnUrl: string;
  private username: string;
  private password: string;
  private rememberMe: boolean;
  constructor(private route: ActivatedRoute, private router: Router, private httpClient: HttpClient,
    private auth: AuthService, private userService: UserService) {
    this.rememberMe = false;
    this.route.params.subscribe(params => {
      this.returnUrl = params['url'];
    });
    if (!this.returnUrl) {
      this.returnUrl = '';
    }
  }

  private onSubmit(): void {
    let user = new User();
    user.username = this.username;
    user.password = this.password;
    let resultUser = null;
    this.httpClient.post("api/Account/Login/", user).subscribe(result => {
      resultUser = result as User;
      if (resultUser) {
        this.auth.setUser(this.username, this.rememberMe);
        this.userService.setUser(resultUser);
        this.router.navigate([this.returnUrl]);
      }
    }
    );
  }
}
