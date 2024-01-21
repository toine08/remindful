import { useEffect, useState } from "react";
import { Text, View, TouchableWithoutFeedback, TouchableOpacity, FlatList, Pressable, Modal } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { getUsername, getConnectedUsername } from "@/lib/utils";
import { sendPushNotification } from "@/lib/notifications";
import Icon from "react-native-vector-icons/FontAwesome";



type Friend = {
	friend_id: string;
	requester: string;
	receiver: string;
	state: "pending" | "accepted" | "rejected";
	username: string; // Add the 'username' property to the Friend type
};



export default function FriendList() {
	const { user } = useSupabase();
	const [friends, setFriends] = useState<Friend[]>([]);
	const [connectedUsername, setConnectedUsername] = useState('');


	useEffect(() => {
		getFriends();
		getConnectedUsername(user?.id).then(connectedUsername => setConnectedUsername(connectedUsername || ''));
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
				friendsWithUsername.push({
					...friend,
					username,
					friend_id,  // Ajout de friend_id
				});
			}
			setFriends(friendsWithUsername);
		}
	}


	return (
		<View style={tw`flex-1 pt-5 dark:bg-dark-background w-full`}>
			<FlatList
				data={friends}
				keyExtractor={(item, index) => index.toString()}
				renderItem={({ item: friend, index }) => (
					<View style={tw`${index === 0 ? 'border-t' : ''} border-b border-gray-200 flex-row mr-2 p-4 justify-between`}>
						<TouchableWithoutFeedback onPress={() => console.log('Pressed!')}>
							<View style={tw`flex-row justify-between w-full`}>
								<Text style={tw`text-xl mb-2 font-bold w-5/6 dark:text-white`}>
									{friend.username}
								</Text>
								<TouchableOpacity
									style={tw`flex-row items-center w-1/6`}
									onPress={() => {
										sendPushNotification(friend.friend_id, "Remindful", `${connectedUsername} pense à toi!`);
									}}
								>
									<Icon name="bell" style={tw`dark:text-white ml-6 text-3xl`} />
								</TouchableOpacity>
							</View>
						</TouchableWithoutFeedback>
					</View>
				)}
				ListFooterComponent={<View style={{ height: 100 }} />} // Ajoutez un espace supplémentaire à la fin
			/>
		</View>
	);
}
