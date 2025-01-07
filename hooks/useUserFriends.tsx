import { useEffect, useState } from "react";
import { supabase } from "@/config/supabase";

export const useUserFriends = (userId: string) => {
	const [friends, setFriends] = useState<any[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<Error | null>(null);

	useEffect(() => {
		const fetchFriends = async () => {
			setLoading(true);
			const { data , error } = await supabase
				.from("friends") // your table name
				.select("*")
				.eq("user_id", userId);

			if (error) {
				setError(error);
			} else {
				setFriends(data);
			}
			setLoading(false);
		};

		fetchFriends();
	}, [userId]);

	return { friends, loading, error };
};
