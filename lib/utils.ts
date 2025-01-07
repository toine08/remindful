import { supabase } from "@/config/supabase";
import { PushNotificationState } from "./notifications";
import { ExpoPushToken } from "expo-notifications";
import { Alert, DrawerLayoutAndroidBase } from "react-native";
import * as Notifications from 'expo-notifications';


export async function handleFriendRequest(
	action: "accepted" | "rejected",
	friendRequestId: number,
) {
	const { error } = await supabase
		.from("friends")
		.update({ state: action })
		.eq("friend_request_id", friendRequestId);

	if (error) {
		console.log("Error updating friend request:", error.message);
	} else {
		alert(`Friend request ${action}!`);
	}
}

export async function getUsername(userId: string): Promise<string | null> {
	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", userId)
		.single();

	if (error) {
		console.log("Error fetching username:", error.message);
		return null;
	}

	return profiles?.username || null;
}

export async function getConnectedUsername(userId: string | undefined) {
	const response = await getUsername(userId || "");
	const usernameCapitalized = response
		? response.charAt(0).toUpperCase() + response.slice(1)
		: "";
	return usernameCapitalized; // accéder à la propriété username de l'objet retourné
}
export async function updatePushToken(pushToken: ExpoPushToken, userId: string) {
	console.log("Updating push token:", { pushToken: pushToken.data, userId });
	
	if (!pushToken) {
	  console.log("No push token to update");
	  return;
	}
  
	if (!userId) {
	  console.log("No user ID provided for updating push token");
	  return;
	}
  
	try {
	  const { data, error } = await supabase
		.from('profiles')
		.update({ push_token: pushToken.data })
		.eq('id', userId);
  
	  if (error) {
		console.error("Error updating push token:", error);
	  } else {
		console.log("Successfully updated push token:", data);
	  }
	} catch (error) {
	  console.error("Error in updatePushToken:", error);
	}
  }

export async function getPushTokenFromSupabase(userId: string) {
	if (!userId) {
		console.error("User ID is missing.");
		return null;
	}

	try {
		const { data, error } = await supabase
			.from("profiles")
			.select("push_token")
			.eq("id", userId)
			.single();

		if (error) {
			console.error("Error fetching push token:", error.message);
			return null;
		}

		return data?.push_token || null;
	} catch (error) {
		console.error("Error in getPushTokenFromSupabase:", error);
		return null;
	}
}

export function getRandomColor() {
	const letters = "0123456789ABCDEF";
	let color = "#";
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
