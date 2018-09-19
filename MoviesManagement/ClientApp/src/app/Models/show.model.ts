import Theatermodel = require("./theater.model");
import Theater = Theatermodel.Theater;

export class Show{
  public id: number;
  public movieId: number;
  public theater: Theater;
  public theaterId: number;
  public MovieStartDate: Date;
}
