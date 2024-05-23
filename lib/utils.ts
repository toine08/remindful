import { supabase } from "@/config/supabase";
import { PushNotificationState } from "./notifications";
import { ExpoPushToken } from "expo-notifications";
import { Alert, DrawerLayoutAndroidBase } from "react-native";

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

export async function updatePushToken(
	pushToken: string,
	userid: string,
) {
	console.log("User ID is present:", userid);
	// Vérifier si le token de notification existe
	if (!pushToken) {
		console.log("No push token to update");
		return;
	}

	// Récupérer le push token actuellement enregistré pour l'utilisateur
	let expoPushNotificationTokenSupabase =  await getPushTokenFromSupabase(userid);

	if (expoPushNotificationTokenSupabase === pushToken) {
		console.log("Push token is the same. No need to update.");
		return;
	}else{
			// Mettre à jour le push token uniquement s'il a changé
	const { data, error } = await supabase
	.from("profiles")
	.update({ push_token: pushToken })
	.eq("id", userid);

if (error) {
	console.log("Error updating push token:", error);
} else {
	console.log("Successfully updated push token:", data);
}
	}

}

export async function getPushTokenFromSupabase(userId: string) {
	if (userId) {
		const pushNotif = await supabase
		.from("profiles")
		.select("push_token")
		.eq("id",userId)
		.single();
		return pushNotif?.data?.push_token;

	  } else {
		console.log("User ID is missing.")
		return Alert.alert("User ID is missing.");
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
