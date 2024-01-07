import { useEffect, useState } from "react";
import { Text, View, Button, TouchableOpacity } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { getUsername } from "@/lib/utils";
import Icon from "react-native-vector-icons/FontAwesome";

type Friend = {
	friend_id: number;
	requester: string;
	receiver: string;
	state: "pending" | "accepted" | "rejected";
	username: string; // Add the 'username' property to the Friend type
};

export default function FriendList() {
	const { user } = useSupabase();
	const [friends, setFriends] = useState<Friend[]>([]);

	useEffect(() => {
		getFriends();
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
			for (let friend of friends) {
				const friend_id =
					friend.requester === user?.id ? friend.receiver : friend.requester;
				const username = await getUsername(friend_id);
				console.log("friend_id:", friend_id);
				friendsWithUsername.push({
					...friend,
					username,
				});
			}
			setFriends(friendsWithUsername);
		}
	}

	return (
		<View style={tw`p-4`}>
			{friends.map((f, index) => (
				<View key={index} style={tw`flex-row justify-between`}>
					<Text style={tw` text-xl mb-2 font-bold dark:text-white pr-2`}>
						{f.username}
					</Text>
					<TouchableOpacity
						style={tw`flex-row items-center`}
						onPress={() => console.log("Button pressed")}
					>
						<Icon name="bell" style={tw`dark:text-white text-xl`} />
					</TouchableOpacity>
				</View>
			))}
		</View>
	);
}
