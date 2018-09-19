import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import * as Authservice from "../../../Services/auth.service";
import AuthService = Authservice.AuthService;
import * as Storageservice from "../../../Services/storage.service";
import StorageService = Storageservice.StorageService;
import { HttpClient, HttpParams } from '@angular/common/http';
import * as ShowSeatsmodel from "../../Models/ShowSeats.model";
import ShowSeats = ShowSeatsmodel.ShowSeats;

@Component({
    selector: 'app-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
/** checkout component*/
export class CheckoutComponent implements OnInit {
  private checkoutForm: FormGroup;
  private fName: string;
  private lName: string;
  private ccn: number;
  private expMonth: number;
  private expYear: number;
  private cv: number;
  private months: number[];
  private years: number[];

  ngOnInit(): void {
    this.checkoutForm = new FormGroup({
      'firstName': new FormControl(this.fName, [
        Validators.required]),
      'lastName': new FormControl(this.lName, [Validators.required]),
      'ccNumber': new FormControl(this.ccn, [Validators.required,
        Validators.minLength(16), Validators.maxLength(16)]),
      'cvv': new FormControl(this.cv, [Validators.required, Validators.minLength(3)]),
    }, { updateOn: 'blur' });

    if (this.auth.isAuthenticated()) {
      this.checkoutForm.controls['firstName'].disable();
      this.checkoutForm.controls['lastName'].disable();
    }
  } /** checkout ctor */

  get firstName() { return this.checkoutForm.get('firstName'); }
  get lastName() { return this.checkoutForm.get('lastName'); }
  get ccNumber() { return this.checkoutForm.get('ccNumber'); }
  get cvv() { return this.checkoutForm.get('cvv'); }


  constructor(private router: Router, public auth: AuthService,
    public storage: StorageService,private httpClient: HttpClient) {
    this.months = Array.from(Array(13).keys()).slice(1);
    this.years = Array.from(Array(2030).keys()).slice(2019);
  }

  private onSubmit() {
    let showSeats = new ShowSeats();
    showSeats.showId = parseInt(this.storage.getShowId());
    showSeats.seatsId = this.storage.getSeats();
    var x = 3;
    this.httpClient.post("api/Resevation/CreateResevation", showSeats).subscribe(_ => {
      this.router.navigate(['']);
    });
  }
}
