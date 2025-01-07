import { useEffect, useState, useRef } from "react";
import { TextInput, View, Text, TouchableOpacity } from "react-native";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { sendPushNotification } from "@/lib/notifications";
import tw from "@/lib/tailwind";
import { getConnectedUsername } from "@/lib/utils";
import Icon from "react-native-vector-icons/FontAwesome";

export default function AddFriend() {
	const [username, setUsername] = useState("");
	const [connectedUsername, setConnectedUsername] = useState("");
	const { user } = useSupabase();
	const connectedUser = user;
	const inputRef = useRef<TextInput>(null);

	useEffect(() => {
		getConnectedUsername(user?.id).then((connectedUsername) =>
			setConnectedUsername(connectedUsername || ""),
		);
		inputRef.current?.focus();
	}, []);

	async function addFriend() {
		// Search for an username in the "profile" table
		const { data, error } = await supabase
			.from("profiles")
			.select()
			.eq("username", username)
			.single();

		if (!user) {
			// Affiche une erreur si non trouvé
			alert("User not found!");
			return;
		}
		if (connectedUser?.id === data.id) {
			alert("You can't add yourself!");
			return;
		}

		// Search for an entry in the "friends" table with these two users
		const { data: existingFriendship, error: fetchError } = await supabase
			.from("friends")
			.select("*")
			.or(`requester.eq.${connectedUser?.id},receiver.eq.${data.id}`)
			.or(`requester.eq.${data.id},receiver.eq.${connectedUser?.id}`);

		if (fetchError) {
			console.log("Error fetching friendship:", fetchError.message);
			return;
		}

		// Si une entrée existe déjà, affiche une erreur
		if (existingFriendship.length > 0) {
			alert("You are already friends!");
			return;
		}

		// Ajoute une entrée dans la table "amis"
		const { error: insertError } = await supabase
			.from("friends")
			.insert([{ requester: connectedUser?.id, receiver: data.id }]);

		console.log("Insert Error:", insertError);

		if (!insertError) {
			alert("Request send!");
		}

		setTimeout(() => {
			sendPushNotification({
				senderId: user.id,
				receiverId: data.id,
				message: `${connectedUsername} sent you a friend request!`,
				type: "friend_request",
			  });
		}, 3000);
	}

	return (
		<View style={tw`w-full`}>
			<Text style={tw`h2 ml-2 justify-center`}>Add a friend</Text>
			<View style={tw`flex-row items-center justify-start w-full ml-2 pt-10`}>
				<TextInput
					value={username}
					ref={inputRef}
					onFocus={() => setUsername("")}
					onChangeText={(text) => setUsername(text)}
					placeholder="username"
					style={tw`p-2 grow rounded border border-primary dark:border-dark-primary text-dark-foreground dark:text-foreground h-12`}
				/>
				<TouchableOpacity
					style={tw`flex-row items-center rounded-full h-8 w-8 mr-6 ml-6 justify-center bg-primary dark:bg-dark-primary text-foreground dark:text-foreground`}
					onPress={addFriend}
				>
					<Icon name="plus" style={tw`text-lg`} />
				</TouchableOpacity>
			</View>
		</View>
	);
}
