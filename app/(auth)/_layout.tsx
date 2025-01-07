import { Tabs, Link } from "expo-router";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { View, useColorScheme, TouchableOpacity, Text } from "react-native";
import Colors from "@/constants/Colors";
import { useSupabase } from "@/hooks/useSupabase";
import { useNavigation, useIsFocused } from "@react-navigation/native";

function useClientOnlyValue<S, C>(server: S, client: C): S | C {
	return client;
}

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome5>["name"];
	color: string;
}) {
	return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function AppLayout() {
	const navigation = useNavigation();
	const isFocused = useIsFocused(); // For detecting screen focus
	const colorScheme = useColorScheme();
	const { signOut, user } = useSupabase();

	// A function to refresh the current screen


	return (
		<Tabs
			screenOptions={{
				tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
				tabBarStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
					borderTopWidth: 0,
				},
				headerStyle: {
					backgroundColor: Colors[colorScheme ?? "light"].background,
				},
				headerShadowVisible: false,
				headerTintColor: Colors[colorScheme ?? "light"].text,
				headerShown: useClientOnlyValue(false, true),
			}}
		>
			<Tabs.Screen
				name="home"
				options={{
					title: "Home",
					tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="notification"
				options={{
					title: "Notifications",
					tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
				}}
			/>
			<Tabs.Screen
				name="profile"
				options={{
					title: "Profile",
					tabBarIcon: ({ color }) => (
						<TabBarIcon name="user-alt" color={color} />
					),
					headerRight: () => (
						<View style={{ flexDirection: "row" }}>
							<Ionicons
								name="log-out-outline"
								size={24}
								color={Colors[colorScheme ?? "light"].icon}
								style={{ marginRight: 16 }}
								onPress={() => {
									signOut();
								}}
							/>
						</View>
					),
				}}
			/>
		</Tabs>
	);
}
