import "react-native-url-polyfill/auto";

import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";

function removeUserMetaData(itemValue: string) {
    let parsedItemValue = JSON.parse(itemValue);

    // Remove properties from the object
    if (parsedItemValue) {
        delete parsedItemValue.user?.identities;
        delete parsedItemValue.user?.user_metadata;
    }
    // Convert the modified object back to a JSON string
    return JSON.stringify(parsedItemValue);
}

const ExpoSecureStoreAdapter = {
	getItem: (key: string) => {
		return SecureStore.getItemAsync(key);
	},
	setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, removeUserMetaData(value));
    },
	removeItem: (key: string) => {
		SecureStore.deleteItemAsync(key);
	},
};

const supabaseUrl = process.env.EXPO_PUBLIC_API_URL as string;
const supabaseKey = process.env.EXPO_PUBLIC_API_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseKey, {
	auth: {
		storage: ExpoSecureStoreAdapter as any,
		autoRefreshToken: true,
		persistSession: true,
		detectSessionInUrl: false,
	},
});
