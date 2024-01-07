import { supabase } from "@/config/supabase";

export async function handleFriendRequest(
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

export async function getUsername(userId: string): Promise<string | null> {
	const { data: profiles, error } = await supabase
		.from("profiles")
		.select("username")
		.eq("id", userId)
		.single();

	if (error) {
		console.log("Error fetching username:", error.message);
		return null;
	}

	return profiles?.username || null;
}
