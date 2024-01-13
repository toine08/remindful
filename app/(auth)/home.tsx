import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { Button } from "@/components/ui";
import { registerForPushNotifications } from '../../lib/notifications';


export default function Index() {
	const { signOut, user } = useSupabase();
	const [username, setUsername] = useState<string | null>(null);

useEffect(() => {
  if (user?.id) {
    getUsername();
  }
  registerForPushNotifications().then((token: string | undefined) => {
    const tokenValue = token ?? ""; // Utilisez le chaînage optionnel et une valeur par défaut
    // Ajoutez tokenValue à la table des profils
    supabase.from("profiles").update({ push_token: tokenValue }).eq("id", user?.id);
  });
}, [user]);

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
