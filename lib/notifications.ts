import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { useState, useEffect, useRef } from "react";
import { Platform, Alert } from "react-native";
import { supabase } from "@/config/supabase";

const expoKey = process.env.EXPO_PUBLIC_ACCESS_TOKEN;
const projectId = "852da2e4-3984-4f5a-950a-c319a03d73af";

export interface PushNotificationState {
  expoPushToken?: string;
  notification?: Notifications.Notification;
}

type NotificationPayload = {
  senderId: string;
  receiverId: string;
  message: string;
  type: "thought" | "friend_request"; // Add different types as needed
};

export const usePushNotifications = (): PushNotificationState => {
	registerForPushNotificationsAsync().then((token) => {
		setExpoPushToken(token);
		console.log("Expo Push Token saved to state:", token);
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldShowAlert: true,
      shouldSetBadge: false,
    }),
  });

  const [expoPushToken, setExpoPushToken] = useState<string>();
  const [notification, setNotification] =
    useState<Notifications.Notification>();

  const notificationListener = useRef<Notifications.Subscription>();
  const responseListener = useRef<Notifications.Subscription>();

  async function registerForPushNotificationsAsync() {
    let token;
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      console.log("Existing notification permission status:", existingStatus);

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
      console.log("Generated Expo Push Token:", token);
    } else {
      alert("Must use physical device for Push Notifications");
      console.log("Error: Not a physical device, cannot register for push notifications.");
    }

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
      console.log("Android notification channel set up.");
    }

    return token;
  }

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      console.log("Expo Push Token saved to state:", token);
    });

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("Notification response received:", response);
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current!
      );
      Notifications.removeNotificationSubscription(responseListener.current!);
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
};

export async function updatePushTokenIfNull(userId: string, expoPushToken: string) {
	if (!userId || !expoPushToken) {
	  console.log("Missing userId or expoPushToken");
	  return;
	}
  
	try {
	  const { data, error } = await supabase
		.from('profiles')
		.select('push_token')
		.eq('id', userId)
		.single();
  
	  if (error) {
		console.error("Error checking push token:", error);
		return;
	  }
  
	  if (data && data.push_token === null) {
		const { data: updateData, error: updateError } = await supabase
		  .from('profiles')
		  .update({ push_token: expoPushToken })
		  .eq('id', userId);
  
		if (updateError) {
		  console.error("Error updating push token:", updateError);
		} else {
		  console.log("Push token updated successfully");
		}
	  } else {
		console.log("Push token already exists, no update needed");
	  }
	} catch (error) {
	  console.error("Error in updatePushTokenIfNull:", error);
	}
  }

async function resetNotificationPermissions() {
  const { status } = await Notifications.requestPermissionsAsync();
  console.log("Resetting notification permissions, status:", status);

  if (status !== "granted") {
    Alert.alert("Failed to get push token for push notification");
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync({
    projectId: projectId,
  });
  console.log("New push token after resetting permissions:", token);

  return token;
}

export async function handleNewUserLogin() {
  const token = await resetNotificationPermissions();
  console.log("Token retrieved after user login:", token);
}

export async function retreiveNotificationToken() {
  try {
    const userToken = await Notifications.getExpoPushTokenAsync({
      projectId: projectId,
    });
    console.log("Retrieved notification token:", userToken);
    return userToken;
  } catch (error) {
    console.error("An error occurred while fetching the notification token:", error);
    Alert.alert("An error occurred while fetching the notification token.");
  }
}

export async function hasSentNotificationInTheLastHour(
  sender: string,
  receiver: string
) {
  const tenMinAgo = new Date(Date.now() - 10 * 60 * 1000);
  tenMinAgo.setHours(tenMinAgo.getHours() - 1);

  const { data: notifications, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("sender_id", sender)
    .eq("receiver_id", receiver)
    .gte("sent_at", tenMinAgo);

  console.log("Notifications in the last hour check result:", notifications);

  if (error) {
    console.error("Error querying notifications:", error);
    return false;
  }

  return notifications && notifications.length > 0;
}

export async function sendPushNotification({
	senderId,
	receiverId,
	message,
	type = "thought",
  }: {
	senderId: string;
	receiverId: string;
	message: string;
	type: "thought" | "friend_request";
  }) {
	try {
	  console.log("Preparing to send notification with details:", {
		senderId,
		receiverId,
		message,
		type,
	  });
  
	  // Make the request to the edge function
	  const { data, error } = await supabase.functions.invoke("sendNotif", {
		body: JSON.stringify({
		  type: "INSERT",
		  table: "notifications",
		  schema: "public",
		  record: {
			sender_id: senderId,
			receiver_id: receiverId,
			body: message,
			type,
		  },
		  old_record: null,
		}),
	  });
  
	  if (error) {
		console.error("Error invoking edge function:", error);
		return { success: false, message: `Failed to invoke edge function: ${error.message}` };
	  }
  
	  console.log("Edge function invoked successfully:", data);
	  return { success: true, message: "Notification sent successfully" };
	} catch (error: any) {
	  console.error("Error in sendPushNotification:", error.message);
	  return { success: false, message: `Failed to send push notification: ${error.message}` };
	}
  }