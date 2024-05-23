import { useState, useEffect, useRef } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "@/config/supabase";

import { Platform, Alert } from "react-native";

const expoKey = process.env.EXPO_PUBLIC_ACCESS_TOKEN;	
const projectId = "852da2e4-3984-4f5a-950a-c319a03d73af"

export interface PushNotificationState {
	expoPushToken?: string;
	notification?: Notifications.Notification;
  }
  
  export const usePushNotifications = (): PushNotificationState => {
	Notifications.setNotificationHandler({
	  handleNotification: async () => ({
		shouldPlaySound: false,
		shouldShowAlert: true,
		shouldSetBadge: false,
	  }),
	});
  
	const [expoPushToken, setExpoPushToken] = useState<string>();
	const [notification, setNotification] = useState<Notifications.Notification>();
  
	const notificationListener = useRef<Notifications.Subscription>();
	const responseListener = useRef<Notifications.Subscription>();
  
	async function registerForPushNotificationsAsync() {
	  let token;
	  if (Platform.OS !== "web") {
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
		token = (await Notifications.getExpoPushTokenAsync()).data;
	  } else {
		alert("Must use physical device for Push Notifications");
	  }
  
	  if (Platform.OS === "android") {
		Notifications.setNotificationChannelAsync("default", {
		  name: "default",
		  importance: Notifications.AndroidImportance.MAX,
		  vibrationPattern: [0, 250, 250, 250],
		  lightColor: "#FF231F7C",
		});
	  }
  
	  return token;
	}
  
	useEffect(() => {
	  registerForPushNotificationsAsync().then((token) => {
		setExpoPushToken(token);
	  });
  
	  notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
		setNotification(notification);
	  });
  
	  responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
		console.log(response);
	  });
  
	  return () => {
		Notifications.removeNotificationSubscription(notificationListener.current!);
		Notifications.removeNotificationSubscription(responseListener.current!);
	  };
	}, []);
  
	return {
	  expoPushToken,
	  notification,
	};
  };


async function resetNotificationPermissions() {
	const { status } = await Notifications.requestPermissionsAsync();
	if (status !== "granted") {
	  Alert.alert("Failed to get push token for push notification");
	  return;
	}
	const token = await Notifications.getExpoPushTokenAsync({
		projectId: projectId,
	});
	return token;
  }
  
  export async function handleNewUserLogin() {
	const token = await resetNotificationPermissions();
  }

export async function retreiveNotificationToken(){
	try {
		const userToken = await Notifications.getExpoPushTokenAsync({
			projectId: projectId,
		});
		return userToken;
	} catch (error) {
		Alert.alert("An error occurred while fetching the notification token.");
	}
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
	// Retrieve the push token of the user from the database
	const { data: user, error } = await supabase
	  .from("profiles")
	  .select("push_token")
	  .eq("id", receiver)
	  .single();
  
	if (userId === receiver) {
	  alert("You can't send a notification to yourself.");
	  return;
	} else if (!user) {
	  alert("The user is not found.");
	  return;
	}
  
	if (await hasSentNotificationInTheLastHour(userId, receiver)) {
	  alert("A notification was already sent within the last hour.");
	  return;
	}
  
	if (error || !user?.push_token) {
	  console.log("Error retrieving the push token:", error,userId);
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

