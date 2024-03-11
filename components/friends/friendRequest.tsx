import { useEffect, useState } from "react";
import { Text, View } from "react-native";

import { Button } from "../ui";

import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";
import { handleFriendRequest, getUsername } from "@/lib/utils";

type FriendRequest = {
	friend_request_id: number;
	requester: string;
	receiver: string;
	state: "pending" | "accepted" | "rejected";
	username: string; // Add the 'username' property to the FriendRequest type
};

export default function FriendRequests() {
	const { user } = useSupabase();
	const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
	const [requests, setRequests] = useState<FriendRequest[]>([]); // Update the type of 'requests' state

	useEffect(() => {
		getFriendRequests();
	}, []);

	async function handleRequest(
		action: "accepted" | "rejected",
		friendRequestId: number,
	) {
		await handleFriendRequest(action, friendRequestId);

		// Mettre à jour l'état des demandes pour supprimer la demande traitée
		setRequests(
			requests.filter(
				(request) => request.friend_request_id !== friendRequestId,
			),
		);
	}

	async function getFriendRequests() {
		try {
			const { data: requests, error } = await supabase
				.from("friends")
				.select("*")
				.eq("receiver", user?.id)
				.eq("state", "pending");

			if (error) {
				console.log("Error fetching friend requests:", error.message);
				return;
			}

			const requestsWithUsername = await Promise.all(
				requests.map(async (request) => {
					const username = await getUsername(request.requester);
					return {
						...request,
						username,
					};
				}),
			);

			setFriendRequests(requests);
			setRequests(requestsWithUsername);
		} catch (error) {
			console.log("Error fetching friend requests:", error.message);
		}
	}
	return (
		<View style={tw``}>
			{requests.length === 0 ? null : (
				<Text style={tw`h3 font-bold mb-2 dark:text-white`}>
					Demandes d'amis
				</Text>
			)}

			{requests.map((r) => (
				<View
					key={r.friend_request_id}
					style={tw`flex-row justify-between items-center`}
				>
					<Text style={tw`text-xl font-bold dark:text-white mr-10`}>
						{r.username}
					</Text>
					<View style={tw`flex-row`}>
						<Button
							label="Confirm"
							style={tw`mr-2 px-4 py-2 border-2 border-white rounded `}
							textStyle={tw`text-dark-foreground dark:text-foreground`}
							onPress={() => handleRequest("accepted", r.friend_request_id)}
						/>
						<Button
							label="Delete"
							style={tw`px-4 py-2  border-2 border-red-400 rounded`}
							textStyle={tw`text-dark-foreground dark:text-foreground`}
							onPress={() => handleRequest("rejected", r.friend_request_id)}
						/>
					</View>
				</View>
			))}
		</View>
	);
}
