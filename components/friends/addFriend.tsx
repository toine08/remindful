import { useState } from "react";
import { TextInput, View, Text } from "react-native";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { handleFriendRequest } from "@/lib/utils";
import tw from "@/lib/tailwind";
import { Button, Input } from "../ui";

export default function AddFriend() {
	const [username, setUsername] = useState("");
	const { user } = useSupabase();
	const connectedUser = user;

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
	}

	return (
		<View>
			<Text style={tw`h2 ml-2 justify-center`}>Add a friend</Text>
			<View style={tw`flex-row items-center justify-start ml-2 pt-10`}>
				<Input
					value={username}
					onChangeText={(text) => setUsername(text)}
					placeholder="username"
					style={tw`flex-grow bg-white rounded text-black h-12`}
				/>
				<Button
					label="add"
					onPress={addFriend}
					style={tw`ml-5 bg-primary rounded h-12 w-1/4 items-center justify-center`}
					textStyle={tw`text-lg font-bold text-black dark:text-white`}
				/>
			</View>
		</View>
	);
}
