import { Injectable } from "@angular/core";

@Injectable()
export class StorageService {
  private seatsId: number[];
  private showId: number;
  private totalPrice: number;
  constructor() { this.seatsId = []; }

  public getItem(key: string): any {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
  }

  public setItem(key: string,value:any): void {
    if (typeof window !== 'undefined') {
       localStorage.setItem(key,value);
    }
  }

  public removeItem(key: string): void {
    if (typeof window !== 'undefined') {
       localStorage.removeItem(key);
    }
  }

  public getSeats(): string {
    return this.getItem("seats");
  }
  public getTotalPrice(): string {
    return this.getItem("totalPrice");
  }
  public getShowId(): string {
    return this.getItem("showId")
  }

  public setSeats(seats: number[]) {
    this.setItem("seats", seats.toString());
  }
  public setShowId(showId: number) {
    this.setItem("showId", showId);
  }
  public setTotalPrice(totalPrice: number) {
    this.setItem("totalPrice", totalPrice.toString());
  }
}
