import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import Theatermodel = require("../../Models/theater.model");
import Theater = Theatermodel.Theater;
import Moviemodel = require("../../Models/movie.model");
import Movie = Moviemodel.Movie;
import { HttpClient } from '@angular/common/http';
import { UploadEvent } from '@progress/kendo-angular-upload';

@Component({
    selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.scss']
})
/** Home component*/
export class MoviesComponent {
    /** Home ctor */
  public fileUploaded:boolean = false;
  uploadSaveUrl = this.baseUrl + "api/Movies/"; // should represent an actual API endpoint
  //uploadRemoveUrl = 'removeUrl'; // should represent an actual API endpoint
  public movies: Movie[];
  private editedRowIndex: number;
  private editedTheater: Theater;
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl) {
    http.get<Movie[]>(baseUrl + 'api/Movies/GetAllMovies').subscribe(result => {
      this.movies = result;
    });
  }

  uploadEventHandler(e: UploadEvent) {
    this.fileUploaded = true;
    //e.data = {
    //  description: 'File description'
    //};
  }
  
  //uploadEventHandler(e: UploadEvent) {
  //  let image = e.files[0];
  //  let _formData = new FormData();
  // // _formData.append("Name", this.Name);
  // // _formData.append("MyFile", this.myFile);
  //  this.http.post(this.baseUrl + "api/Movies", _formData).subscribe(_ => {

  //  });
  //  this.fs.uploadFile(e.files).subscribe(result => { console.log('result', result); });

  //}

  public doSomething(item: any) {
    var x = item;
  }
  public editHandler({ sender, rowIndex, dataItem }) {
    this.closeEditor(sender);

    this.editedRowIndex = rowIndex;
    this.editedTheater = Object.assign({}, dataItem);

    sender.editRow(rowIndex);
  }
  private closeEditor(grid, rowIndex = this.editedRowIndex) {
    grid.closeRow(rowIndex);
    //  this.editService.resetItem(this.editedProduct);
    this.editedRowIndex = undefined;
    this.editedTheater = undefined;
  }
  public cancelHandler({ sender, rowIndex }) {
    this.closeEditor(sender, rowIndex);
  }

  public saveHandler({ sender, rowIndex, dataItem, isNew }) {
    //   this.editService.save(dataItem, isNew);
    var movieId = dataItem.id;
    if (this.fileUploaded) {
      this.http.put(this.baseUrl + 'api/Movies/', movieId).subscribe(result => {
        // this.movies.push(result as Movie);
      });
    }
    if (isNew) {
      this.http.post(this.baseUrl + 'api/Movies/AddMovie', dataItem as Movie).subscribe(result => {
        this.movies.push(result as Movie);
      });
    } else {
      this.http.put(this.baseUrl + 'api/Movies/UpdateMovie', dataItem as Movie).subscribe(_ => {
      });
    }
    sender.closeRow(rowIndex);
    
    this.editedRowIndex = undefined;
    this.editedTheater = undefined;
    this.fileUploaded = false;
  }

  public removeHandler({ dataItem }) {
    if (!dataItem)
      return;
    const index: number = this.movies.indexOf(dataItem);
    if (index !== -1) {
      this.movies.splice(index, 1);
      this.http.delete(this.baseUrl + 'api/Movies/DeleteMovie/' + dataItem.id.toString()).subscribe(_ => {
      });
    }
  //  formInstance.reset();
  }

  public addHandler({ sender }, formInstance) {
  //  formInstance.reset();
    this.closeEditor(sender);

    sender.addRow(new Movie());
  }
}
