import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import { Slot, useRouter, useSegments } from "expo-router";
import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDeviceContext } from "twrnc";
import { SupabaseProvider } from "@/context/SupabaseProvider";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";
import { RootSiblingParent } from 'react-native-root-siblings';

const InitialLayout = () => {
	const { session, initialized } = useSupabase();
	const segments = useSegments();
	const router = useRouter();
	const [notification, setNotification] = useState();


	useEffect(() => {
		Notifications.setNotificationHandler({
			handleNotification: async () => ({
			  shouldShowAlert: true,  // Ensure that alerts are shown
			  shouldPlaySound: true,  // Play sound with notification
			  shouldSetBadge: true,   // Update the app badge
			}),
		  });
		  const subscription = Notifications.addNotificationReceivedListener((notification) => {
			console.log("Notification received:", notification);
			setNotification(notification);
		});
		if (!initialized) return;

		// Check if the path/url is in the (auth) group
		const inAuthGroup = segments[0] === "(auth)";

		if (session && !inAuthGroup) {
			// Redirect authenticated users to the home page
			router.replace("/home");
		} else if (!session) {
			// Redirect unauthenticated users to the sign up page
			router.replace("/");
		}
		return () => {
			subscription.remove();
		}
	}, [session, initialized]);

	return <Slot />;
};

export default function Root() {
	useDeviceContext(tw);

	return (
		<SupabaseProvider>
			<GestureHandlerRootView style={tw`flex-1 bg-foreground dark:bg-stone-950`}>
				<SafeAreaProvider>
					<RootSiblingParent>
					<InitialLayout />
					</RootSiblingParent>
				</SafeAreaProvider>
			</GestureHandlerRootView>
		</SupabaseProvider>
	);
}