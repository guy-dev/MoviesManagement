using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Owin.Security.Provider;
using MoviesManagement.Models;
using MoviesManagement.RealTime;

namespace MoviesManagement
{
	public class ChatHub : Hub
	{

		public ChatHub()
		{

		}

		#region Private Methods

		private void SendToAll(int showId, string methodName, object[] parameters)
		{
			var id = Context.ConnectionId;
			if (ChatUserManager.RegisteredUsers.ContainsKey(showId))
			{
				foreach (var user in ChatUserManager.RegisteredUsers[showId])
				{
					if (user.Key == id)
					{
						continue;
					}
					Clients.Client(user.Key).SendAsync(methodName, parameters);
				}

			}

			if (ChatUserManager.NonRegisteredUsers.ContainsKey(showId))
			{
				foreach (var user in ChatUserManager.NonRegisteredUsers[showId])
				{
					if (user.Key == id)
					{
						continue;
					}
					Clients.Client(user.Key).SendAsync(methodName, parameters);
				}
			}
		}

		private void SendToUser(string userId, string methodName, object[] parameters)
		{
			Clients.Client(userId).SendAsync(methodName, parameters);
		}

		private void sendTakenSeatsToRegistered(int showId, string id)
		{
			if (UserSeatManager.takenSeats.ContainsKey(showId))
			{
				var takenSeats = UserSeatManager.takenSeats[showId];
				var methodNameSendTakenSeats = "showTakenSeats";
				SendToUser(id, methodNameSendTakenSeats, new object[] { takenSeats });
			}
		}

		private void releaseTakenSeats(string userId, int showId)
		{
			var takenSeatsArr = UserSeatManager.ReleaseTakenSeats(showId, userId);
			if (takenSeatsArr != null)
			{
				var methodName = "releaseTakenSeats";
				SendToAll(showId, methodName, new object[] { takenSeatsArr });
			}

		}

		#endregion


		public void SendMessage(int showId, string message, string username)
		{
			var parameters = new object[] { message, username };
			var methodName = "messageReceived";
			SendToAll(showId, methodName, parameters);
		}

		private void connectionEventMessageNotify(bool connect, int showId, string userName, string senderId)
		{
			var connectionFuncClient = connect ? "connectedUser" : "disconnectedUser";
			SendToAll(showId, connectionFuncClient, new object[] { userName });
		}
		#region Hub Functions
		public override Task OnConnectedAsync()
		{
			return base.OnConnectedAsync();
		}

		public override Task OnDisconnectedAsync(Exception exception)
		{
			var id = Context.ConnectionId;
			KeyValuePair<int, string> info = new KeyValuePair<int, string>();
			if (ChatUserManager.UserInfo.ContainsKey(id))
			{
				info = ChatUserManager.UserInfo[id];
				connectionEventMessageNotify(false, info.Key, info.Value, id);
				releaseTakenSeats(id,info.Key);
				ChatUserManager.RemoveUser(info.Key, id);
			}

			return base.OnDisconnectedAsync(exception);
		}

#endregion

		public string RegisterGuest(int showId)
		{
			var id = Context.ConnectionId;
			var guestName = ChatUserManager.RegisterGuest(showId, id);
			connectionEventMessageNotify(true, showId, guestName, id);
			sendTakenSeatsToRegistered(showId, id);
			return guestName;
		}

		public bool RegisterUser(int showId, string userName)
		{
			var id = Context.ConnectionId;
			bool succuessRegister = ChatUserManager.RegisterUser(showId, id, userName);
			if (succuessRegister)
			{
				connectionEventMessageNotify(true, showId, userName, id);
			}
			sendTakenSeatsToRegistered(showId, id);
			return succuessRegister;
		}

		public void AddTakenSeat(int showId, int seatId, string userName)
		{
			var id = Context.ConnectionId;
			UserSeatManager.AddTakenSeat(showId, seatId, id);
			var methodName = "recievedAddedTakenSeat";

			SendToAll(showId, methodName, new object[] { seatId, userName });
		}

		public void ReleaseTakenSeat(int showId, int seatId, string userName)
		{
			var id = Context.ConnectionId;
			UserSeatManager.ReleaseTakenSeat(showId, seatId, id);
			var methodName = "recievedReleasedTakenSeat";
			SendToAll(showId, methodName, new object[] { seatId, userName });
		}

	}

}
