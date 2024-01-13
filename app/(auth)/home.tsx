import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { Button } from "@/components/ui";
import { registerForPushNotifications } from '../../lib/notifications';
import { updatePushToken } from "@/lib/utils";


export default function Index() {
	const { signOut, user } = useSupabase();
	const [username, setUsername] = useState<string | null>(null);
	const [tokenUpdated, setTokenUpdated] = useState(false);


useEffect(() => {
	if (user?.id) {
		getUsername();
	}
    if (!tokenUpdated) {
      registerForPushNotifications().then((token: string | undefined) => {
        const tokenValue = token ?? "";
        updatePushToken(tokenValue, user?.id).then(() => setTokenUpdated(true));
      });
    }
}, [user,tokenUpdated]);

	async function getUsername() {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.select("username")
			.eq("id", user?.id)
			.single();

		if (profiles && profiles.username) {
			setUsername(profiles.username);
			console.log(profiles.username);
		}
	}

	return (
		<View
			style={tw`flex-1 items-center justify-center bg-background pt-12 dark:bg-dark-background dark:text-white`}
		>
			<View>
				<Text style={tw`text-xl dark:text-white`}>Hello {username}</Text>
				<Button label="SignOut" textStyle={tw`font-bold`} onPress={signOut} />
			</View>
		</View>
	);
}
