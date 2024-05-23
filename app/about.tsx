import React from "react";
import { View, Text, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "@/lib/tailwind";
import { retreiveNotificationToken } from "@/lib/notifications";
import { useState, useEffect } from "react";
import { ExpoPushToken } from "expo-notifications";

function About() {
    const [token, setToken] = useState<ExpoPushToken | undefined>();

    useEffect(() => {
        const fetchToken = async () => {
            const storedToken = await retreiveNotificationToken();
            setToken(storedToken || undefined);
        };

        fetchToken();
    }, []);
    const handleEmail = async () => {
        Linking.openURL('mailto:team@remindfulapp.xyz');
    };

    return (
        <SafeAreaView
        style={tw`pt-12 w-full h-full flex-1 items-center bg-foreground dark:bg-stone-950`}
    >
        <Text
            style={tw`h3 font-bold mb-2 self-center mx-auto text-dark-foreground dark:text-foreground`}
        >
            About
        </Text>
        <View style={tw`flex-1 justify-center items-center`}>
        <View style={tw`bg-background dark:bg-neutral-900 rounded-lg p-25 flex justify-center text-justify w-full p-5`}>   
            <Text style={tw`text-dark-foreground dark:text-foreground mb-2`}>Who I am: Toine Riedo, young developer from Switzerland passionate about web development, running and video games</Text>
            <Text style={tw`text-dark-foreground dark:text-foreground mb-2`}>Purpose of the app: It's a mobile application that allows users to send thoughtful, non-intrusive notifications to people they're thinking about, without the need for a conversation. It's a subtle way to let someone know they're on their mind.</Text>
            <Text style={tw`text-dark-foreground dark:text-foreground`} >Contact email: <Text onPress={handleEmail}>team@remindfulapp.xyz</Text></Text>

        </View>
        </View>
    </SafeAreaView>
    );
}

export default About;