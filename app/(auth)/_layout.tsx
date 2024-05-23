import {Tabs,Link} from "expo-router";
import React from "react";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { View, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useSupabase } from "@/hooks/useSupabase";


function useClientOnlyValue<S, C>(server: S, client: C): S | C {
	return client;
  }

function TabBarIcon(props: {
	name: React.ComponentProps<typeof FontAwesome5>['name'];
	color: string;
  }) {
	return <FontAwesome5 size={28} style={{ marginBottom: -3 }} {...props} />;
  }

export default function AppLayout() {
	const colorScheme = useColorScheme();
	const { signOut, user } = useSupabase();
	return (
		<Tabs
		  screenOptions={{
			tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
			// Disable the static render of the header on web
			// to prevent a hydration error in React Navigation v6.
			headerShown: useClientOnlyValue(false, true),
		  }}>
		  <Tabs.Screen
			name="home"
			options={{
			  title: 'Home',
			  tabBarIcon: ({ color }) => <TabBarIcon name="home" color={color} />,
			}}
		  />
			<Tabs.Screen
			name="notification"
			options={{
			  title: 'Notification',
			  tabBarIcon: ({ color }) => <TabBarIcon name="users" color={color} />,
			}}
		  />
<Tabs.Screen
  name="profile"
  options={{
    title: 'Profile',
    tabBarIcon: ({ color }) => <TabBarIcon name="user-alt" color={color} />,
    headerRight: () => (
      <View style={{ flexDirection: 'row' }}>
        <Ionicons
          name="log-out-outline"
          size={24}
          color={Colors[colorScheme ?? 'light'].text}
          style={{ marginRight: 16 }}
          onPress={() => {
            signOut();
          }}
        />
        <Ionicons
          name="information-circle-sharp"
          size={24}
          color={Colors[colorScheme ?? 'light'].text}
          onPress={() => {
 <Link href="/about" />; }}
        />
      </View>
    ),
  }}
/>
	
		</Tabs>
	)
}
