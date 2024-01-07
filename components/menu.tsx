import { View } from "react-native";
import { Link } from "expo-router";
import tw from "@/lib/tailwind";
import Icon from "react-native-vector-icons/Feather";
import { useSupabase } from "@/hooks/useSupabase";

export default function Menu() {
	const { user } = useSupabase(); // Remplacez ceci par votre logique d'authentification

	if (!user) {
		return null;
		console.log("No user is currently authenticated");
	} else {
		console.log(`User is currently authenticated ${user.id}`);
		return (
			<View style={tw`flex-row items-center justify-around m-2 h-18 bg-white`}>
				<Link href="(auth)/home" style={tw` items-center`}>
					<Icon name="home" size={25} />
				</Link>

				<Link href="(auth)/friend" style={tw`items-center`}>
					<Icon name="users" size={25} />
				</Link>
			</View>
		);
	}
}
