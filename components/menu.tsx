import { Link } from "expo-router";
import { SafeAreaView, TouchableOpacity, Text } from "react-native";
import Icon from "react-native-vector-icons/Feather";

import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";

export default function Menu() {
	const { user } = useSupabase(); // Remplacez ceci par votre logique d'authentification

	if (!user) {
		return null;
	}

	return (
		<SafeAreaView
			style={tw`flex-row items-center justify-around h-1/9 w-full bg-primary dark:bg-dark-primary dark:text-dark-primary bottom-0 z-50`}
		>
			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/home" style={tw` items-center`}>
					<Icon name="home" size={25} />
				</Link>
			</TouchableOpacity>

			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/notification" style={tw`items-center`}>
					<Icon name="users" size={25} />
				</Link>
			</TouchableOpacity>

			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/profile" style={tw`items-center`}>
					<Icon name="user" size={25} />
				</Link>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
