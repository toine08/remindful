import { supabase } from "@/config/supabase";
import { PushNotificationState } from "./notifications";
import { ExpoPushToken } from "expo-notifications";
import { DrawerLayoutAndroidBase } from "react-native";

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

export async function updatePushToken(pushToken: ExpoPushToken, userid: string) {
	// Vérifier si le token de notification existe
	if (!pushToken) {
	  console.log("No push token to update");
	  return;
	}
  
	// Récupérer le push token actuellement enregistré pour l'utilisateur
	const { data: existingData, error } = await supabase
	  .from("profiles")
	  .select("push_token")
	  .eq("id", userid)
	  .single();
  
	if (error) {
	  console.log("Error fetching existing push token:", error);
	  return;
	}
  
	// Vérifier si le token actuel est identique au nouveau token
	if (existingData?.push_token === pushToken) {
	  console.log("Push token is already up to date");
	  return;
	}
  
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
  
export function getRandomColor() {
	const letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
	  color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
  }
