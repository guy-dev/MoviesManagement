using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MoviesManagement.Models
{
	public static class ChatUserManager
	{

		static ConcurrentDictionary<int, Dictionary<string, string>> registeredUsers = new ConcurrentDictionary<int, Dictionary<string, string>>();

		static ConcurrentDictionary<int, Dictionary<string, int>> nonRegisteredUsers = new ConcurrentDictionary<int, Dictionary<string, int>>();

		static Dictionary<string, KeyValuePair<int, string>> userInfo = new Dictionary<string, KeyValuePair<int, string>>();
		static ConcurrentDictionary<string, int> registeredUsersCount = new ConcurrentDictionary<string, int>();
		static ConcurrentQueue<int> nonRegisteredFreeSlots = new ConcurrentQueue<int>();
		
		// Key1: Show Id, Key2: List of user id's.
		public static ConcurrentDictionary<string, int> RegisteredUsersCount
		{
			get => registeredUsersCount;
			set => registeredUsersCount = value;
		}
		public static ConcurrentDictionary<int, Dictionary<string, string>> RegisteredUsers
		{
			get => registeredUsers;
			set => registeredUsers = value;
		}
		// Key1: show id, key2: guest id's value:guest index 
		public static ConcurrentDictionary<int, Dictionary<string, int>> NonRegisteredUsers
		{
			get => nonRegisteredUsers;
			set => nonRegisteredUsers = value;
		}
		// Key1: connection id, key2: show id, value: name
		public static Dictionary<string, KeyValuePair<int, string>> UserInfo
		{
			get => userInfo;
			set => userInfo = value;
		}

		public static void RemoveUser(int showId, string userId)
		{

			UserInfo.Remove(userId);
			var username = string.Empty;
			if (RegisteredUsers.ContainsKey(showId) && RegisteredUsers[showId].ContainsKey(userId))
			{
				username = RegisteredUsers[showId][userId];
				RegisteredUsers[showId].Remove(userId);
			}
			if (NonRegisteredUsers.ContainsKey(showId) && NonRegisteredUsers[showId].ContainsKey(userId))
			{
				nonRegisteredFreeSlots.Enqueue(NonRegisteredUsers[showId][userId]);
				NonRegisteredUsers[showId].Remove(userId);
			}

			if (!string.IsNullOrEmpty(username) && registeredUsersCount.ContainsKey(username))
			{
				registeredUsersCount[username]--;
			}

		}

		public static string RegisterGuest(int showId, string userId)
		{

			int guestIndex = 1;
			if (!NonRegisteredUsers.ContainsKey(showId))
			{
				NonRegisteredUsers.TryAdd(showId, new Dictionary<string, int>() { { userId, guestIndex } });
			}
			else
			{
				if (nonRegisteredFreeSlots.Count > 0)
				{
					nonRegisteredFreeSlots.TryDequeue(out guestIndex);
				}
				else
				{
					guestIndex = NonRegisteredUsers[showId].Values.Last() + 1;
				}
				NonRegisteredUsers[showId].Add(userId, guestIndex);
			}

			var guestName = FormGuestName(guestIndex);
			UserInfo[userId] = new KeyValuePair<int, string>(showId, guestName);
			return guestName;

		}

		public static bool RegisterUser(int showId, string userId, string userName)
		{
			if (!RegisteredUsers.ContainsKey(showId))
			{
				RegisteredUsers.TryAdd(showId, new Dictionary<string, string>());
			}
			RegisteredUsers[showId].TryAdd(userId, userName);
			if (!RegisteredUsersCount.ContainsKey(userName))
			{
				registeredUsersCount.TryAdd(userName, 1);
			}
			else
			{
				registeredUsersCount[userName]++;
			}
			UserInfo[userId] = new KeyValuePair<int, string>(showId, userName);
			return true;
		}

		public static string FormGuestName(int guestId)
		{
			return "Guest" + (guestId < 10 ? "0" + guestId.ToString() : guestId.ToString());
		}

		public static string GetName(int showId, string userId)
		{
			var name = string.Empty;
			if (registeredUsers.ContainsKey(showId) && registeredUsers[showId].ContainsKey(userId))
			{
				name = registeredUsers[showId][userId];
			}
			else if (nonRegisteredUsers.ContainsKey(showId) && nonRegisteredUsers[showId].ContainsKey(userId))
			{
				name = FormGuestName(nonRegisteredUsers[showId][userId]);
			}

			return name;
		}

		#region Private Methods

		#endregion

	}
}
