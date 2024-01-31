import { SafeAreaView, TouchableOpacity, View, Text } from "react-native";
import { Link } from "expo-router";
import tw from "@/lib/tailwind";
import Icon from "react-native-vector-icons/Feather";
import { useSupabase } from "@/hooks/useSupabase";

export default function Menu() {
	const { user } = useSupabase(); // Remplacez ceci par votre logique d'authentification

	if (!user) {
		return null;
	}

	return (
		<SafeAreaView style={tw`flex-row items-center justify-around h-1/9 w-full bg-white`}>
			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/home" style={tw` items-center`}>
					<Icon name="home" size={25} />
				</Link>
			</TouchableOpacity>

			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/notification" style={tw`items-center`}>
					<Icon name="users" size={25} />
					<Text>he</Text>
				</Link>
			</TouchableOpacity>

			<TouchableOpacity activeOpacity={1}>
				<Link href="(auth)/profile" style={tw`items-center`}>
					<Icon name="user" size={25} />
					<Text>he</Text>
				</Link>
			</TouchableOpacity>
		</SafeAreaView>
	);
}
