import tw from "@/lib/tailwind";
import React, { useState } from "react";
import {
	View,
	Text,
	SafeAreaView
} from "react-native";


export default function notification() {
	return (
		<SafeAreaView style={tw`flex-1 dark:bg-dark-background`}>
			<View
				style={tw` pt-10 flex-1 items-start w-full justify-start bg-background dark:bg-dark-background dark:text-white`}
			>
				<View style={tw`flex-row justify-center w-full items-center m-2 p-2`}>
					<Text style={tw`h2 font-bold mb-2 dark:text-white`}>Notifications</Text>
				</View>
				<View style={tw`h-full w-full`}>
					<Text style={tw`dark:text-white`}>Notifications</Text>
				</View>

			</View>
		</SafeAreaView>
	);
}
