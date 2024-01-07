import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { handleFriendRequest, getUsername } from "@/lib/utils";
import { Button } from "../ui";

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

	async function getFriendRequests() {
		const requestsWithUsername = [];
		const { data: requests, error } = await supabase
			.from("friends")
			.select("*")
			.eq("receiver", user?.id)
			.eq("state", "pending");

		if (error) {
			console.log("Error fetching friend requests:", error.message);
		} else if (requests) {
			setFriendRequests(requests);
		}

		for (let request of requests) {
			const username = await getUsername(request.requester);
			requestsWithUsername.push({
				...request,
				username,
			});
		}
		setRequests(requestsWithUsername);
	}

	return (
		<View style={tw`p-4`}>
			{requests.map((r) => (
				<View
					key={r.friend_request_id}
					style={tw`mb-4 p-4 border border-gray-200 rounded`}
				>
					<Text style={tw`mb-2 font-bold dark:text-white`}>
						Friend Request from {r.username}
					</Text>
					<View style={tw`flex-row`}>
						<Button
							label="Accept"
							style={tw`mr-2 px-4 py-2 bg-green-500 rounded`}
							onPress={() =>
								handleFriendRequest("accepted", r.friend_request_id)
							}
						/>
						<Button
							label="Reject"
							style={tw`px-4 py-2 bg-red-500 rounded`}
							onPress={() =>
								handleFriendRequest("rejected", r.friend_request_id)
							}
						/>
					</View>
				</View>
			))}
		</View>
	);
}
