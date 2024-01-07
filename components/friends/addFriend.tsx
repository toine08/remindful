import { useState } from "react";
import { TextInput, View } from "react-native";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";
import { Button, Input } from "../ui";

export default function AddFriend() {
	const [username, setUsername] = useState("");
	const { user } = useSupabase();
	const connectedUser = user;

	async function addFriend() {
		// Recherche l'utilisateur par username
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
		if (connectedUser.id === data.id) {
			alert("You can't add yourself!");
			return;
		}

		// Recherche une entrée dans la table "amis" avec ces deux utilisateurs
		const { data: existingFriendship, error: fetchError } = await supabase
			.from("friends")
			.select("*")
			.or(`requester.eq.${connectedUser.id},receiver.eq.${data.id}`)
			.or(`requester.eq.${data.id},receiver.eq.${connectedUser.id}`);

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
			.insert([{ requester: connectedUser.id, receiver: data.id }]);

		console.log("Insert Error:", insertError);

		if (!insertError) {
			alert("Request send!");
		}
	}

	async function handleFriendRequest(
		action: "accepted" | "rejected",
		friendRequestId: number,
	) {
		const { error } = await supabase
			.from("friends")
			.update({ state: action })
			.eq("friend_request_id", friendRequestId);

		if (error) {
			console.log("Error updating friend request:", error.message);
		} else {
			alert(`Friend request ${action}!`);
		}
	}

	return (
		<View
			style={tw`flex-0.5 items-center justify-center bg-background pt-12 dark:bg-dark-background dark:text-white`}
		>
			<Input
				value={username}
				onChangeText={(text) => setUsername(text)}
				placeholder="username"
			/>
			<Button label="Ajouter" onPress={addFriend} />
		</View>
	);
}
