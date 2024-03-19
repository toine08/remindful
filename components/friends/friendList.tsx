import { useEffect, useState, memo } from "react";
import {
	Text,
	View,
	TouchableWithoutFeedback,
	TouchableOpacity,
	FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

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
	const [connectedUsername, setConnectedUsername] = useState("");

	useEffect(() => {
		getFriends();
		getConnectedUsername(user?.id).then((connectedUsername) =>
			setConnectedUsername(connectedUsername || ""),
		);
	}, []);

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

	return (
		<View style={tw`flex-1 pt-5 w-full`}>
			<FlatList
				data={friends}
				keyExtractor={(item) => item.friend_id }
				renderItem={({ item: friend, index }) => (
					<View
						style={tw`${index === 0 ? "border-t" : ""} border-list`}
					>
						<TouchableWithoutFeedback onPress={() => console.log("Pressed!")}>
							<View style={tw`flex-row justify-between w-full`}>
								<Text style={tw`text-xl text-dark-foreground dark:text-foreground mb-2 font-bold w-5/6`}>
									{friend.username}
								</Text>
								<TouchableOpacity
									style={tw`flex-row items-center w-1/6`}
									onPress={() => {
										sendPushNotification(
											friend.friend_id,
											"Remindful",
											`${connectedUsername} pense à toi!`,
											user?.id || ""
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
		</View>
	);
}

export default React.memo(FriendList);
