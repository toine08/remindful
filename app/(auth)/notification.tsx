import React, { useState, useEffect} from "react";
import { View, Text, SafeAreaView, FlatList, TouchableWithoutFeedback } from "react-native";

import tw from "@/lib/tailwind";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { getUsername } from "@/lib/utils";
import { Button } from "@/components/ui";

type Notification = {
	sender_id: string;
	sender_username: string;
	receiver_id: string;
	sent_at: string;
};
  
function NotificationsList() {
	const { user } = useSupabase();
	const [notifications, setNotifications] = useState<Notification[]>([]);
  
	useEffect(() => {
	  getNotifications();
	}, []);
  
	async function getNotifications() {
		const { data: notifications, error } = await supabase
		  .from("notifications")
		  .select("*")
		  .eq("receiver_id", user?.id);
	  
		if (error) {
		  console.log("Error fetching notifications:", error.message);
		} else if (notifications) {
			console.log("notifications", notifications)
		  const notificationsWithUsernames = await Promise.all(
			notifications.map(async (notification) => {
			  const username = await getUsername(notification.sender_id);
			  return { ...notification, sender_username: username };
			})
		  );
	  
		  setNotifications(notificationsWithUsernames);
		}
	  }
  
	  return (
		<SafeAreaView style={tw`flex-1 items-center bg-foreground dark:bg-dark-foreground`}>
		  <FlatList
			data={notifications}
			keyExtractor={(item) => `${item.sender_id}-${item.sent_at}`}
			renderItem={({ item: notification, index }) => (
			  <View
				style={tw`${index === 0 ? "border-t" : ""} border-list`}
			  >
				<TouchableWithoutFeedback onPress={() => console.log("Pressed!")}>
				  <View style={tw`flex-row justify-between w-full`}>
					<Text style={tw`text-xl text-dark-foreground dark:text-foreground mb-2 font-bold w-5/6`}>
					  {`Notification from ${notification.sender_username} at ${new Date(notification.sent_at).toLocaleString()}`}
					</Text>
				  </View>
				</TouchableWithoutFeedback>
			  </View>
			)}
			ListFooterComponent={<View style={{ height: 100 }} />}
		  />
		</SafeAreaView>
	  );
		 }
  
  export default React.memo(NotificationsList);