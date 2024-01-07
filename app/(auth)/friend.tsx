import tw from "@/lib/tailwind";
import React from "react";
import { View, Text } from "react-native";

import AddFriend from "../../components/friends/addFriend";
import FriendRequests from "@/components/friends/friendRequest";
import FriendList from "@/components/friends/friendList";

export default function Friend() {
	return (
		<View
			style={tw`flex-1 items-start justify-center bg-background dark:bg-dark-background dark:text-white`}
		>
			<View style={tw`m-2`}>
				<Text style={tw`h2 font-bold mb-2 dark:text-white`}>Mes amis</Text>
				<View>
					<FriendList />
					<FriendRequests />
					<AddFriend />
				</View>
			</View>
		</View>
	);
}
