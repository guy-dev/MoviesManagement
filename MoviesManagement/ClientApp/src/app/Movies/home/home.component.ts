import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms'
import { GridDataResult } from '@progress/kendo-angular-grid';
import { State, process } from '@progress/kendo-data-query';
import * as Moviemodel from "../../Models/movie.model";
import Movie = Moviemodel.Movie;
import * as Authservice from "../../../Services/auth.service";
import AuthService = Authservice.AuthService;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  private totalMovies: Movie[];
  private gridMovies: Movie[];
  private popularMovies: Movie[];
  constructor(http: HttpClient, @Inject('BASE_URL') baseUrl: string, private router: Router, authService: AuthService) {
    let testAuth = authService.isAuthenticated();
    let testUser = authService.getUser();
    let testRemember = authService.isRemember();
    testRemember = authService.isRemember();
    let mov = new Movie();
    mov.id = 1;
    mov.description = "test";
    mov.director = "dir";
  //  let test = JSON.parse(mov as any);
    //localStorage.setItem("dada", JSON.stringify(mov as any));
    //let x = localStorage.getItem("dada");
    //let lala = JSON.parse(x) as Movie;
    //var bb = "3";
    http.get(baseUrl + 'api/Movies/GetPopularMovies').subscribe(result => {
      this.popularMovies = <Movie[]>result;
    });
    http.get(baseUrl + 'api/Movies/GetAllMovies').subscribe(result => {
      this.totalMovies = <Movie[]>result;
      this.gridMovies = this.totalMovies;
    });
  }
  public onClick(e): void {
    this.router.navigate(['admin'], { queryParams: { page: 1 } });
  }
  public onFocus(e): void {
    var x = e;
  }

  public filterChange(filter: string): void {
    this.gridMovies = this.totalMovies.filter(c => c.name.toLowerCase().startsWith(filter.toLowerCase()));
  }


  public onSelectedChange(e): void {
    var x = e;
    var l = x;
  }

  public saveHandler({ sender, rowIndex, dataItem, isNew }) {

  }

  public movieNameSelectionChange(movieItem: Movie): void {
    if (!movieItem) {
      this.gridMovies = this.totalMovies;
    } else {
      this.gridMovies = new Array(this.totalMovies.find(c => c.id === movieItem.id));
    }
  }
}
