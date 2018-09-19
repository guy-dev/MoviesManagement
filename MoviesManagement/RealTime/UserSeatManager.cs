using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.ComTypes;
using System.Threading.Tasks;
using MoviesManagement.Models;

namespace MoviesManagement.RealTime
{
    public static class UserSeatManager
    {
	    public static ConcurrentDictionary<int, Dictionary<string,List<int>>> takenSeats = new ConcurrentDictionary<int, Dictionary<string,List<int>>>();

	    public static void AddTakenSeat(int showId, int seatId, string userId)
	    {
		    var username = string.Empty;
		    if (ChatUserManager.RegisteredUsers.ContainsKey(showId) &&
		        ChatUserManager.RegisteredUsers[showId].ContainsKey(userId))
		    {
			    username = ChatUserManager.RegisteredUsers[showId][userId];
		    }
			else if (ChatUserManager.NonRegisteredUsers.ContainsKey(showId) &&
			         ChatUserManager.NonRegisteredUsers[showId].ContainsKey(userId))
		    {
			    username = ChatUserManager.FormGuestName(ChatUserManager.NonRegisteredUsers[showId][userId]);
		    }
			if (takenSeats.ContainsKey(showId) && takenSeats[showId].ContainsKey(username) &&
		        takenSeats[showId][username] != null && takenSeats[showId][username].Contains(seatId))
		    {
			    return;
		    }
		    if (!takenSeats.ContainsKey(showId))
		    {
				List<int> seatIds = new List<int>(){seatId};
				 var userSeats =  new Dictionary<string,List<int>> {{ username, seatIds } };
			    takenSeats.TryAdd(showId, userSeats);
		    }
			else if (takenSeats.ContainsKey(showId) && !takenSeats[showId].ContainsKey(username))
		    {
				List<int> seatIds = new List<int>() { seatId };
				takenSeats[showId].Add(username,seatIds);
		    }
			else if (takenSeats.ContainsKey(showId) && takenSeats[showId].ContainsKey(username))
		    {
			    var seatIds = takenSeats[showId][username];
			    seatIds?.Add(seatId);
		    }
		}

	    public static void ReleaseTakenSeat(int showId, int seatId, string userId)
	    {
		    var username = ChatUserManager.GetName(showId, userId);
			if (takenSeats.ContainsKey(showId) && takenSeats[showId].ContainsKey(username) &&
		        takenSeats[showId][username].Contains(seatId))
		    {
			    takenSeats[showId][username].Remove(seatId);
		    }
		}

	    public static List<int> ReleaseTakenSeats(int showId, string userId)
	    {
		    List<int> takenSeatsList = null;
		    var username = ChatUserManager.GetName(showId, userId);
		    if (takenSeats.ContainsKey(showId) && takenSeats[showId].ContainsKey(username))
		    {
			    takenSeatsList = new List<int>(takenSeats[showId][username]);
				takenSeats[showId][username].Clear();
		    }

		    return takenSeatsList;
	    }


	}
}
