import React, { useState } from "react";
import { View, Text, SafeAreaView } from "react-native";

import tw from "@/lib/tailwind";

export default function notification() {
	return (
		<SafeAreaView style={tw`flex-1 pt-10 items-center dark:bg-black`}>
			<Text style={tw`h2 font-bold dark:text-white`}>Notifications</Text>

			<View style={tw` w-full justify-center gap-y-10`}>
				<View style={tw`flex-row justify-center w-full items-center p-2`} />
				<View style={tw`h-full w-full`}>
					<Text style={tw`dark:text-white`}>Notifications</Text>
				</View>
			</View>
		</SafeAreaView>
	);
}
