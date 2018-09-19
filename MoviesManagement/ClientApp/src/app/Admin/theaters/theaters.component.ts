import { Component, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators/map';
import { Router } from '@angular/router';
import { Theater } from '../../Models/theater.model';

interface Item {
  text: string,
  value: number
}

@Component({
  selector: 'app-theaters-data',
  templateUrl: './theaters.component.html'
})
export class TheatersComponent {
  private theaters: Theater[];
  private editedRowIndex: number;
  private editedTheater: Theater;
  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl) {
    http.get<Theater[]>(baseUrl + 'api/Theaters/GetTheaters').subscribe(result => {
      this.theaters = result;
    });
  }

  public doSomething(item:any) {
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
    var theaterId = dataItem.id;
    if (isNew) {
      this.http.post(this.baseUrl + 'api/Theaters/AddTheater', dataItem as Theater).subscribe(result => {
        this.theaters.push(result as Theater);
      });
    } else {
      this.http.put(this.baseUrl + 'api/Theaters/UpdateTheater', dataItem as Theater).subscribe(_ => {
        var x = "3";
      });
    }
    sender.closeRow(rowIndex);

    this.editedRowIndex = undefined;
    this.editedTheater = undefined;
  }

  public removeHandler({ dataItem }) {
    if (!dataItem)
      return;
    const index: number = this.theaters.indexOf(dataItem);
    if (index !== -1) {
      this.theaters.splice(index, 1);
      this.http.delete(this.baseUrl + 'api/Theaters/DeleteTheater/' + dataItem.id.toString()).subscribe(_ => {
      });
    }       
  }

  public addHandler({ sender }, formInstance) {
  //  formInstance.reset();
    this.closeEditor(sender);

    sender.addRow(new Theater());
  }
}
