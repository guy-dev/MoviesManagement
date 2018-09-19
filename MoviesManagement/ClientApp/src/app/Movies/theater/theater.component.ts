import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as Moviemodel from "../../Models/movie.model";
import Movie = Moviemodel.Movie;
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Theatermodel from "../../Models/theater.model";
import Theater = Theatermodel.Theater;
import * as Showmodel1 from "../../Models/show.model";
import Show = Showmodel1.Show;

@Component({
    selector: 'app-theater',
    templateUrl: './theater.component.html',
    styleUrls: ['./theater.component.scss']
})
/** Theater component*/
export class TheaterComponent {
    /** Theater ctor */
  private movieId: string;
  private movie: Movie = new Movie();
  private shows: Show[];
  constructor(private route: ActivatedRoute, private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) {
    this.route.params.subscribe(params => {
      this.movieId = params['id'];
    });
    let params = new HttpParams();
    params = params.set('id', this.movieId);
    this.setMovie(params);
    this.setTheaters(params);
  }
  ngOnInit() {
  }
  private setMovie(params) : void {
    this.http.get<Movie>(this.baseUrl + 'api/Movies/GetMovie', { params: params }).subscribe(result => {
      this.movie = result;
    });
  }

  private setTheaters(params): void {
    this.http.get<Show[]>(this.baseUrl + 'api/Movies/GetMovieShows', { params: params }).subscribe(result => {
      this.shows = result;
    });
  }
}
