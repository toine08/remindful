import React, { useState,useEffect } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import AddFriend from "../../components/friends/addFriend";

import FriendList from "@/components/friends/friendList";
import FriendRequests from "@/components/friends/friendRequest";
import tw from "@/lib/tailwind";
import { usePushNotifications } from "@/lib/notifications";
import { updatePushToken, getPushTokenFromSupabase} from "@/lib/utils";
import { useSupabase } from "@/hooks/useSupabase";
import { ExpoPushToken } from "expo-notifications";


export default function Index() {
	const {user} = useSupabase();

	const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

	const { expoPushToken, notification } = usePushNotifications();
	async function checkAndUpdateToken() {
		if (expoPushToken) {
		  const supabaseResponse = await getPushTokenFromSupabase(user?.id || ""); // Fetch the token from Supabase
  
	  // Check if data exists in the response and extract the push_token
	  const supabaseToken = supabaseResponse.data ? supabaseResponse.data.push_token : null;
  
	  if (expoPushToken && expoPushToken !== supabaseToken) {
		await updatePushToken(expoPushToken, user?.id || ""); // Update the token if it's different
	  }
	}
  }
  
  checkAndUpdateToken();

  useEffect(() => {
    if (notification) {
      console.log("Notification received:", notification);
    }

  }, [notification]);


	const toggleAddFriendModalVisibility = () => {
		setAddFriendModalVisible(!isAddFriendModalVisible);
	};

	const handleBackgroundPress = () => {
		setAddFriendModalVisible(false);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView
				style={tw`pt-12 flex-1 items-start w-full justify-start bg-foreground dark:bg-stone-950`}
			>
				<View style={tw`flex-1 w-full items-center m-2 p-2`}>
					<View style={tw`flex-row justify-end w-full `}>
						<TouchableOpacity
							style={tw`flex-row items-center rounded-full h-8 w-8 mr-6 justify-center bg-primary dark:bg-dark-primary text-foreground dark:text-foreground`}
							onPress={toggleAddFriendModalVisibility}
						>
							<Icon
								name="plus"
								size={20}
							/>
						</TouchableOpacity>
					</View>
					<View style={tw`flex-1 w-full`}>
						<FriendList />
						<FriendRequests />
					</View>
				</View>
				<Modal
					animationType="slide"
					transparent
					visible={isAddFriendModalVisible}
					onRequestClose={toggleAddFriendModalVisibility}
				>
					<TouchableWithoutFeedback onPress={handleBackgroundPress}>
						<View style={tw`flex-1 justify-end items-center`}>
							<View
								style={tw`bg-foreground  dark:bg-dark-foreground p-4 h-50 h-150 pb-10 rounded-lg justify-between shadow-lg w-full`}
							>
								<AddFriend />
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}