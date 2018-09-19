import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
declare let $: any;
import * as signalR from "@aspnet/signalr";
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import * as Params from "@angular/common/http/src/params";
import * as Showmodel from "../../Models/show.model";
import Show = Showmodel.Show;
import * as Theatermodel from "../../Models/theater.model";
import Theater = Theatermodel.Theater;
import * as Authservice from "../../../Services/auth.service";
import AuthService = Authservice.AuthService;
import * as Storageservice from "../../../Services/storage.service";
import StorageService = Storageservice.StorageService;
import * as Userservice from "../../../Services/user.service";
import UserService = Userservice.UserService;
import { ChatModule, Message, User, Action, ExecuteActionEvent, SendMessageEvent } from '@progress/kendo-angular-conversational-ui';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { from } from 'rxjs/observable/from';
import { merge } from 'rxjs/observable/merge';
import { scan } from 'rxjs/operators/scan';
import { take } from 'rxjs/operators/take';
import { tap } from 'rxjs/operators/tap';

@Component({
  selector: 'app-theater-seats',
  templateUrl: './theater-seats.component.html',
  styleUrls: ['./theater-seats.component.css']
})
/** theaterSeats component*/
export class TheaterSeatsComponent implements OnInit, OnDestroy {


  ////Constants /////////
  private cConnectedMsg = " has connected to the chat";
  private cDisconnectedMsg = " has disconnected from the chat";

  ///////////////////////
  private connection;
  public sc: any;
  public show: Show;
  private message: string;
  private username: string;
  private seatNumber: number;
  public totalPrice: number = 0;
  public seats: any[];
  private bookedSeats: number[];
  private rows: number;
  private columns: number;
  private sessionExpired: boolean;
  public feed: Observable<Message[]>;
  private local: Subject<Message> = new Subject<Message>();
  private others: Subject<Message> = new Subject<Message>();
  private system: Subject<Message> = new Subject<Message>();
  private userSentMsgHistory: Message[] = new Array();
  ///Chat Users ///
  public readonly mainUser: User = {
    id: 0
  };
  /////////////////

  public readonly otherUser: User = {
    id: 1
  };
  public readonly systemUser: User = {
    id: 2
  }
  /** theaterSeats ctor */
  constructor(@Inject("BASE_URL") baseUrl, private route: ActivatedRoute, private httpClient: HttpClient,
    private auth: AuthService, private router: Router, private storage: StorageService, private user: UserService) {
    this.initChat();
    this.initReceiveEvents();
  }

  private checkIfOwner(username: string): boolean {
    if (this.user.GetUserName() === username) {
      return true;
    }
    return false;
  }

  private seatIdToLocationString(seatId: number): string {
    let row = Math.floor(seatId / this.columns);
    if (seatId % this.columns !== 0)
      row++;
    let col = seatId % this.columns == 0 ? this.columns : seatId % this.columns;
    var location = row.toString() + '_' + col.toString();
    return location;
  }

  /////////////////
  public ngOnInit() {
    let showId = 0;
    let params = new HttpParams();
    this.route.params.subscribe(params => {
      showId = params['id'];
    });
    params = params.set('id', showId.toString());
    this.httpClient.get<Show>("api/Shows/GetShow", { params: params }).subscribe(async result => {
      this.show = result;
      var firstSeatLabel = 1;
      this.seatNumber = 5;
      var self = this;
      this.seats = new Array();
      let seatsMap = [];
      this.rows = this.show.theater.rows;
      this.columns = this.show.theater.columns;
      for (var i = 0; i < this.rows; i++) {
        seatsMap[i] = 'e'.repeat(this.columns);
      }
      ////
      this.connection.start().then(() => {
        if (this.auth.isAuthenticated()) {
          self.connection.invoke("registerUser", showId, this.user.GetUserName());
        } else {
          self.connection.invoke("registerGuest", showId).then(result => {
            this.user.setUserName(result);
          });
        }
      });
      ////
      $().ready(function () {
        let seats = [];
        var $cart = $('#selected-seats'),
          $counter = $('#counter'),
          $total = $('#total');
        self.sc = $('#seat-map').seatCharts({
          map: seatsMap,
          seats: {
            s: {
              price: 100,
              classes: 'selected', //your custom CSS class
              category: 'Selected Seats'
            },
            o: {
              price: 100,
              classes: 'selectedOthers', //your custom CSS class
              category: 'Selected Seats'
            },
            e: {
              price: 40,
              classes: 'economy-class', //your custom CSS class
              category: 'Available seats'
            }

          },
          naming: {
            top: false,
            getLabel: function (character, row, column) {
              return firstSeatLabel++;
            },
          },
          legend: {
            node: $('#legend'),
            items: [
              ['e', 'available', 'Available Seats'],
              ['s', 'available', 'Selected Seats'],
              ['o', 'lalaothers', 'Selected By Others'],
              ['f', 'unavailable', 'Already Booked']
            ]
          },
          click: function () {
            if (this.status() == 'available') {
              var x = $(this);
          //    this.settings.$node.attr('title', 'works?');
              self.sendAddTakenSeat(parseInt(this.settings.label));
              self.seats.push(this.settings.label);
              self.totalPrice += this.data().price;
              //let's create a new <li> which we'll add to the cart items
              $('<li>' +
                this.data().category +
                ' Seat # ' +
                this.settings.label +
                ': <b>$' +
                this.data().price +
                '</b><a class="cancel-cart-item" style = "cursor:pointer">[cancel]</a></li>')
                .attr('id', 'cart-item-' + this.settings.id)
                .data('seatId', this.settings.id)
                .appendTo($cart);

              /*
               * Lets update the counter and total
               *
               * .find function will not find the current seat, because it will change its stauts only after return
               * 'selected'. This is why we have to add 1 to the length and the current seat price to the total.
               */
              $counter.text(self.sc.find('selected').length + 1);
              $total.text(recalculateTotal(self.sc) + this.data().price);;
              return 'selected';
            } else if (this.status() == 'selected') {
              self.sendReleasedTakenSeat(parseInt(this.settings.label));
              self.totalPrice -= this.data().price;
              self.seats.splice($.inArray(this.settings.label, self.seats), 1);
              //update the counter
              $counter.text(self.sc.find('selected').length - 1);
              //and total
              $total.text(recalculateTotal(self.sc) - this.data().price);

              //remove the item from our cart
              $('#cart-item-' + this.settings.id).remove();
              $('#dodo').text(self.seats);
              //seat has been vacated
              return 'available';
            } else if (this.status() == 'unavailable') {
              //seat has been already booked
              return 'unavailable';
            }
            else if (this.status() == 'selectedOthers') {
              //seat has been already booked
              return 'selectedOthers';
            }
            else {
              return this.style();
            }
          }
        });

        //this will handle "[cancel]" link clicks
        $('#selected-seats').on('click',
          '.cancel-cart-item',
          function () {
            //let's just trigger Click event on the appropriate seat, so we don't have to repeat the logic here
            self.sc.get($(this).parents('li:first').data('seatId')).click();
          });
        self.httpClient.get("api/Shows/GetBookedSeats?id=" + self.show.id).subscribe(result => {
          self.bookedSeats = result as number[];
          if (self.bookedSeats.length > 0) {
            for (var booked of self.bookedSeats) {
              let row = Math.floor(booked / self.columns);
              if (booked % self.columns !== 0)
                row++;
              let col = booked % self.columns == 0 ? self.columns : booked % self.columns;
              var location = row.toString() + '_' + col.toString();
              self.sc.get(location).status('unavailable');
            }
          }
        });
      });

      function recalculateTotal(sc) {
        var totalPrice = 0;

        //basically find every selected seat and sum its price
        sc.find('selected').each(function () {
          totalPrice += this.data().price;
        });

        return totalPrice;
      }

    });
  }

  ///////Chat Methods ////////////////////

  private initChat(): void {
    const hello: Message = {
      author: this.systemUser,
      text: "System: Welcome " + this.user.GetUserName() + "!"
    }
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("/chat")
      .build();

    this.feed = merge(
      [hello],
      this.local,
      this.others,
      this.system
    ).pipe(
      // ... and emit an array of all messages
      (scan((acc, x) => [...acc, x], [])) as any
    );
  }

  private addChatMessage(message: string, chatUser: User, category: Subject<Message>): void {
    var msg = {
      author: chatUser,
      text: message
    };
    var sme = new SendMessageEvent(msg);
    category.next(sme.message);
  }

  ///////SIGNALR Chat Send Events /////////////////////

  public sendAddTakenSeat(seatId: number) {
    this.connection.send("addTakenSeat", this.show.id, seatId, this.user.GetUserName());
  }

  public sendReleasedTakenSeat(seatId: number) {
    this.connection.send("releaseTakenSeat", this.show.id, seatId, this.user.GetUserName());
  }

  public sendMessage(e: SendMessageEvent): void {
    var username = null;
    if (this.auth.isAuthenticated()) {
      username = this.auth.getUser();
    } else {
      username = this.user.GetUserName();
    }
    e.message.text = username + ": " + e.message.text;
    this.local.next(e.message);
    this.userSentMsgHistory.push(e.message);
    this.connection.send("sendMessage", this.show.id, e.message.text, username);
  }



  /////////////////////////////////////////////////

  //////SIGNALR Chat Receive Events ////////////////////

  private initReceiveEvents(): void {
    this.connection.on("messageReceived", (parameters: any[]) => {
      let message = parameters[0];
      let username = parameters[1];
      if (this.checkIfOwner(username) &&
        ((this.userSentMsgHistory.length === 0) ||
        (this.userSentMsgHistory.length > 0 &&
          message !== this.userSentMsgHistory[this.userSentMsgHistory.length - 1].text))) {
        this.addChatMessage(message, this.mainUser, this.local);
      } else {
        if (!this.checkIfOwner(username)) {
          this.addChatMessage(message, this.otherUser, this.others);
        }
      }
    });

    this.connection.on("recievedAddedTakenSeat", (parameters:any[]) => {
      let seatId = parameters[0];
      let userName = parameters[1];
      var msg = "System: The user " + userName + " has selected seat #" + seatId.toString();
      var location = this.seatIdToLocationString(seatId);
      if (this.sc.get(location).status() === "available") {
        if (!this.checkIfOwner(userName)) {
          this.addChatMessage(msg, this.systemUser, this.system);
          this.sc.get(location).status('selectedOthers');
          this.sc.get(location).settings.$node.attr('title', userName);
        } else {
          this.sc.get(location).status('selected');
        }
      }
    });


    this.connection.on("recievedReleasedTakenSeat", (parameters: any[]) => {
      let seatId = parameters[0];
      let userName = parameters[1];
      var location = this.seatIdToLocationString(seatId);
      if (!this.checkIfOwner(userName)) {
        var msg = "System: The user " + userName + " has released seat #" + seatId.toString();
        if (this.sc.get(location).status() === "selectedOthers") {
          this.addChatMessage(msg, this.systemUser, this.system);
        }
      }
      this.sc.get(location).status('available');
    });

    this.connection.on("releaseTakenSeats",
      (parameters: any[]) => {
        let seatsArr = parameters[0];
        if (!seatsArr) {
          return;
        }
        for (var seat of seatsArr) {
          var location = this.seatIdToLocationString(seat);
          this.sc.get(location).status('available');
        }
      });

    this.connection.on("showTakenSeats",
      (parameters: any[]) => {
        var takenSeats = parameters[0];
        for (var seat in takenSeats) {
          var username = seat;
          var status = this.checkIfOwner(username) ? "selected" : "selectedOthers";
          var seatArr = takenSeats[seat];
          for (var seatId of seatArr) {
            this.sc.get(this.seatIdToLocationString(seatId)).status(status);
          }
        }
      });

    this.connection.on("connectedUser",
      (parameters: any[]) => {
        let username = parameters[0];
        if (this.user.GetUserName() === username) {
          return;
        }
        var connectedMsg = username + this.cConnectedMsg;
        this.addChatMessage(connectedMsg, this.systemUser, this.system);
      });

    this.connection.on("disconnectedUser",
      (parameters: any[]) => {
        let username = parameters[0];
        if (this.user.GetUserName() === username) {
          return;
        }
        var disconnectedMsg = username + this.cDisconnectedMsg;
        this.addChatMessage(disconnectedMsg, this.systemUser, this.system);
      });
  }




  //////////////////////////////////////////////////


  ////////////////////////////////////////////////




  private OnCheckout(): void {
    if (this.seats.length < 1) {
      return;
    }
    this.storage.setSeats(this.seats);
    this.storage.setShowId(this.show.id);
    this.storage.setTotalPrice(this.totalPrice);
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['login', 'checkout']);
    } else {
      this.sessionExpired = false;
      this.httpClient.get<boolean>("api/Account/SessionStatus").subscribe(result => {
        this.sessionExpired = result;
        if (this.sessionExpired) {
          let interval = setInterval(() => {
            this.auth.logOut();
            this.router.navigate(['login', 'checkout']);
            clearInterval(interval);
          },
            1500);
        } else {
          this.router.navigate(['checkout']);
        }
      });
    }
  }

  ngOnDestroy(): void {
    this.connection.stop();
  }
}

  ///////////////////



