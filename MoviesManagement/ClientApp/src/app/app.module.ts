import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { ChatModule } from '@progress/kendo-angular-conversational-ui';
import { AppComponent } from './app.component';
import { UploadModule } from '@progress/kendo-angular-upload';


// Import the Animations module
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DropDownsModule } from '@progress/kendo-angular-dropdowns';
// Import the ButtonsModule
import { ButtonsModule } from '@progress/kendo-angular-buttons';

import { GridModule } from '@progress/kendo-angular-grid';
//////////////////// ADMIN ////////////////
import * as AdminNavmenucomponent from "./Admin/nav-menu/nav-menu.component";
import AdminNavMenuComponent = AdminNavmenucomponent.NavMenuComponent;

///////////////////////////////////////////

////////////////////MOVIES/////////////////
import * as Navmenucomponent from "./Movies/nav-menu/nav-menu.component";
import NavMenuComponent = Navmenucomponent.NavMenuComponent;
import * as Homecomponent from "./Movies/home/home.component";
import HomeComponent = Homecomponent.HomeComponent;
import * as Countercomponent from "./Admin/counter/counter.component";
import CounterComponent = Countercomponent.CounterComponent;

///////////////////////////////////////////

///////////////////Services////////////////
import * as Navigationservice from "../Services/navigation.service";
import NavigationService = Navigationservice.NavigationService;
import * as Authservice from "../Services/auth.service";
import AuthService = Authservice.AuthService;
import * as Guardservice from "../Services/guard.service";
import GuardService = Guardservice.GuardService;
import * as Storageservice from "../Services/storage.service";
import StorageService = Storageservice.StorageService;
import * as Userservice from "../Services/user.service";
import UserService = Userservice.UserService;
//////////////////////////////////////////
import * as Theatercomponent from "./Movies/theater/theater.component";
import TheaterComponent = Theatercomponent.TheaterComponent;
import * as Theaterseatscomponent from "./Movies/theater-seats/theater-seats.component";
import TheaterSeatsComponent = Theaterseatscomponent.TheaterSeatsComponent;
import * as Logincomponent from "./Movies/log-in/log-in.component";
import LogInComponent = Logincomponent.LogInComponent;
import * as Registercomponent from "./Movies/register/register.component";
import RegisterComponent = Registercomponent.RegisterComponent;
import * as Checkoutcomponent from "./Movies/checkout/checkout.component";
import CheckoutComponent = Checkoutcomponent.CheckoutComponent;
import * as Theaterscomponent from "./Admin/theaters/theaters.component";
import TheatersComponent = Theaterscomponent.TheatersComponent;
import * as Moviescomponent from "./Admin/home/movies.component";
import MoviesComponent = Moviescomponent.MoviesComponent;


///////////////////////////////////////////

@NgModule(({
  declarations: [
    AppComponent,
    AdminNavMenuComponent,
    MoviesComponent,
    HomeComponent,
    NavMenuComponent,
    CounterComponent,
    TheatersComponent,
    TheaterComponent,
    TheaterSeatsComponent,
    LogInComponent,
    RegisterComponent,
    CheckoutComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    ButtonsModule,
    UploadModule,
    GridModule,
    BrowserAnimationsModule,
    DropDownsModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ChatModule,
    RouterModule.forRoot([
      { path: '', component: HomeComponent, pathMatch: 'full' },
      { path: 'admin', component: MoviesComponent, canActivate: [GuardService] },
      { path: 'admin/theaters', component: TheatersComponent },
      { path: 'theater/:id', component: TheaterComponent },
      { path: 'theater-seats/:id', component: TheaterSeatsComponent },
      { path: 'login', component: LogInComponent },
      { path: 'login/:url', component: LogInComponent },
      { path: 'register', component: RegisterComponent },
      { path: 'checkout', component: CheckoutComponent }
    ])
  ],
  providers: [NavigationService, AuthService, GuardService, StorageService,UserService],
  bootstrap: [AppComponent]
}) as any)
export class AppModule { }
