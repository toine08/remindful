import { useEffect, useState, memo } from "react";
import {
	Text,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	FlatList,
	Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { Image } from "expo-image";

import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { sendPushNotification } from "@/lib/notifications";
import tw from "@/lib/tailwind";
import { getUsername, getConnectedUsername } from "@/lib/utils";
import React from "react";

type Friend = {
	friend_id: string;
	requester: string;
	receiver: string;
	state: "pending" | "accepted" | "rejected";
	username: string; // Add the 'username' property to the Friend type
};

function FriendList() {
	const { user } = useSupabase();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [friendsName, setFriendsName] = useState<string[]>([]); // Add a new state variable to store the friends' names
	const [connectedUsername, setConnectedUsername] = useState("");
	const [selectedFriendUsername, setSelectedFriendUsername] = useState<
		string | null
	>(null);
	const [isCardVisible, setCardVisible] = useState(false);

	useEffect(() => {
		getFriends();
		getConnectedUsername(user?.id).then((connectedUsername) =>
			setConnectedUsername(connectedUsername || ""),
		);
		if (selectedFriendUsername) {
			getName(selectedFriendUsername)
				.then((name) => {
					setFriendsName(name ? [name] : []); // Ensure name is added to an array or set it to an empty array if name is falsy
				})
				.catch((error) => {
					console.error("Error getting name:", error);
					setFriendsName([]); // If there's an error, set friendsName to an empty array
				});
		}
	}, [selectedFriendUsername]);

	async function getFriends() {
		const friendsWithUsername = [];
		const { data: friends, error } = await supabase
			.from("friends")
			.select("*")
			.or(`requester.eq.${user?.id},receiver.eq.${user?.id}`)
			.eq("state", "accepted");

		if (error) {
			console.log("Error fetching friends:", error.message);
		} else if (friends) {
			for (const friend of friends) {
				const friend_id =
					friend.requester === user?.id ? friend.receiver : friend.requester;
				const username = await getUsername(friend_id);
				friendsWithUsername.push({
					...friend,
					username,
					friend_id,
				});
			}
			setFriends(friendsWithUsername);
		}
	}

	const handleFriendPress = (username: string) => {
		setSelectedFriendUsername(username);
		setCardVisible(true);
	};

	const getName = async (username: any) => {
		const { data: profile, error } = await supabase
			.from("profiles")
			.select("first_name, last_name")
			.eq("username", username)
			.single();
		if (error) {
			console.error("Error getting profile:", error.message);
			return;
		}
		if (profile) {
			return `${profile.first_name} ${profile.last_name}`;
		}
	};

	const deleteFriend = async () => {
	if(!friends) return;
	else{
		const friend = friends.find((friend) => friend.username === selectedFriendUsername);
		if (!friend) return;

		const { error } = await supabase
			.from("friends")
			.delete()
			.or(`requester.eq.${user?.id},receiver.eq.${user?.id}`)
			.or(`requester.eq.${friend.friend_id},receiver.eq.${friend.friend_id}`);
		if (error) {
			console.error("Error deleting friend:", error.message);
		} else {
			setCardVisible(false);
			getFriends();
		}
	
	}
	}



	return (
		<View style={tw`flex-1 pt-5 w-full h-full`}>
			<FlatList
				data={friends}
				keyExtractor={(item) => item.friend_id}
				renderItem={({ item: friend, index }) => (
					<View style={tw`${index === 0 ? "border-t" : ""} border-list`}>
						<TouchableWithoutFeedback
							onLongPress={() => {
								console.log("Pressed!");
								setCardVisible(true);
							}}
						>
							<View style={tw`flex-row justify-between w-full`}>
								<Text
									style={tw`text-xl text-dark-foreground dark:text-foreground mb-2 font-bold w-5/6`}
									onLongPress={() => handleFriendPress(friend.username)}
								>
									{friend.username}
								</Text>
								<TouchableOpacity
									style={tw`flex-row items-center w-1/6`}
									onPress={() => {
										sendPushNotification(
											user?.id || "ERROR",
											"Remindful",
											`${connectedUsername} pense à toi!`,
											friend.friend_id,
											"thought"
										);
									}}
								>
									<Icon name="bell" style={tw`bell`} />
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
					</View>
				)}
				ListFooterComponent={<View style={{ height: 100 }} />}
			/>

			{isCardVisible && selectedFriendUsername && (
				<Modal
				animationType="none"
				transparent
				visible={isCardVisible}
				onRequestClose={() => {
				  setCardVisible(false);
				}}
			  >
				<TouchableWithoutFeedback onPress={() => setCardVisible(false)}>
				  <View style={tw`flex-1  h-100 justify-center items-center bg-black bg-opacity-50`}>
					<View
					  style={tw`bg-foreground dark:bg-dark-foreground p-6 rounded-lg shadow-lg w-3/4`}
					>
					  <Text
						style={tw`text-2xl text-center text-dark-foreground dark:text-foreground mb-4`}
					  >
						{selectedFriendUsername}
					  </Text>
					  <Text
						style={tw`text-center text-dark-foreground dark:text-foreground mb-4`}
					  >
						{friendsName.join(", ")}
					  </Text>
					  <View style={tw`mt-4 flex-row justify-center items-center`}>
						<Text style={tw`text-xl mr-2 text-dark-foreground dark:text-foreground`}>Delete your friendship ? </Text>
						<Icon style={tw`trash`} name="trash" onPress={deleteFriend} />
					  </View>
					</View>
				  </View>
				</TouchableWithoutFeedback>
			  </Modal>
			)}
		</View>
	);
}

export default memo(FriendList);
