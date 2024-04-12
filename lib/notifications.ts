import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { useState } from 'react';


import { supabase } from "@/config/supabase";

const expoKey = process.env.EXPO_PUBLIC_ACCESS_TOKEN;

export function usePushNotifications() {
	const [token, setToken] = useState<string | null>(null);
  
	const registerForPushNotifications = async () => {
	  if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== "granted") {
		  const { status } = await Notifications.requestPermissionsAsync();
		  finalStatus = status;
		}
		if (finalStatus !== "granted") {
		  alert("Failed to get push token for push notification!");
		  return;
		}
		const tokenData = (await Notifications.getExpoPushTokenAsync()).data;
		setToken(tokenData);
	  } else {
		alert("Must use physical device for Push Notifications");
	  }
  
	  if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
		  name: "default",
		  importance: Notifications.AndroidImportance.DEFAULT,
		  vibrationPattern: [0, 250, 250, 250],
		});
	  }
	};
  
	return { token, registerForPushNotifications };
  }

export async function hasSentNotificationInTheLastHour(sender: string, receiver: string) {
	const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
	tenMinAgo.setHours(tenMinAgo.getHours() - 1); // adjust for UTC+1
  
	const { data: notifications } = await supabase
	  .from("notifications")
	  .select("*")
	  .eq("sender_id", sender)
	  .eq("receiver_id", receiver)
	  .gte("sent_at", tenMinAgo);
  
	// Check if notifications is null or undefined before accessing its properties
	if (notifications === null || notifications === undefined) {
	  return false;
	}
  
	return notifications.length > 0;
  }
export async function sendPushNotification(
	userId: string,
	title: string,
	body: string,
	receiver: string,
	type: string,
) {
	// Récupérer le jeton de notification push de l'utilisateur
	const { data: user, error } = await supabase
		.from("profiles")
		.select("push_token")
		.eq("id", userId)
		.single();

	if(userId === receiver) {
		alert("You can't send a notification to yourself.");
		return;

	}else if(userId=== null){
		alert("The user is not found.");
		return;
	}

	//check notifications time
	if (await hasSentNotificationInTheLastHour(userId, receiver)) {
		alert("A notification was already sent within the last hour.");
		return;
	}

	if (error || !user?.push_token) {
		console.log("Erreur lors de la récupération du jeton push :", error);
		return;
	}

	const message = {
		to: user.push_token,
		sound: "default",
		title,
		body,
		data: { someData: "goes here" },
	};

	try {
		const response = await fetch("https://exp.host/--/api/v2/push/send", {
			method: "POST",
			headers: {
				host: "exp.host",
				accept: "application/json",
				"accept-encoding": "gzip, deflate",
				"content-type": "application/json",
				authorization: `Bearer ${expoKey}`,
			},
			body: JSON.stringify(message),
		});
		if (response.ok) {
			const { data, error } = await supabase
				.from("notifications")
				.insert([{ sender_id: userId, receiver_id: receiver, type: type }])
				.select();
			console.log("data insert in notif", new Date())
		}

		if (!response.ok) {
			const text = await response.text();
			alert("Failed to send push notification");
			throw new Error(`HTTP error! status: ${response.status} ${text}`);
		}

		const receipt = await response.json();
		console.log("Notification envoyée avec succès :", receipt);
	} catch (error) {
		console.log("Erreur lors de l'envoi de la notification :", error);
	}
}
