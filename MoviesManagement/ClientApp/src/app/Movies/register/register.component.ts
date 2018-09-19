import { Component, OnInit } from '@angular/core';
import * as user from "../../Models/user";
import User = user.User;
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss']
})
/** register component*/
export class RegisterComponent implements OnInit {
 private heroForm : FormGroup;
  private user: User;
  private cPassword: string;
  private successfulSave: Boolean;
  private errors : string[];
  constructor(private httpClient: HttpClient, private router: Router) {
    this.cPassword = '';
    this.errors = new Array();
    this.user = new User();
  }
  
  ngOnInit(): void {
    this.heroForm = new FormGroup({
      'username': new FormControl(this.user.username, [
        Validators.required,
        Validators.minLength(4)
      ]),
      'password': new FormControl(this.user.password, [Validators.required,
        Validators.minLength(6)]),
      'confirmPassword': new FormControl(this.cPassword, [Validators.required,
        Validators.minLength(6), this.validatePassword]),
      'firstName': new FormControl(this.user.firstName, [Validators.required]),
      'lastName': new FormControl(this.user.lastName, [Validators.required])
    }, { updateOn: 'blur' });
  }

  private validatePassword(control: AbstractControl) {
    if (!control.value || !control.parent.controls["password"])
      return null;
    if (control.value !== control.parent.controls["password"].value) {
      return { validPassword: true };
    }
    return null;
  }

  get username() { return this.heroForm.get('username'); }
  get firstName() { return this.heroForm.get('firstName'); }
  get lastName() { return this.heroForm.get('lastName'); }
  get password() { return this.heroForm.get('password'); }
  get confirmPassword() { return this.heroForm.get('confirmPassword'); }

  private onSubmit(): void {
    var x = 3;
    this.httpClient.post("api/Account/Register", this.user).subscribe(result => {
      this.errors = [];
      this.successfulSave = true;
        setTimeout(_ => {
          this.router.navigate(['login']);
        },1000);
      },
      error => {
        this.errors = [];
        let validationErrorDictionary = error.error;
        for (var fieldName in validationErrorDictionary) {
          if (validationErrorDictionary.hasOwnProperty(fieldName)) {
            this.errors.push(validationErrorDictionary[fieldName]);
          }
        }
      });
  }
}
