import { Buffer } from "buffer";
import * as FileSystem from "expo-file-system";
import {Image} from "expo-image";
import * as ImageManipulator from "expo-image-manipulator";
import * as ImagePicker from "expo-image-picker";
import React, { useEffect, useState } from "react";
import {
	Text,
	View,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView,
} from "react-native";

import { registerForPushNotifications } from "../../lib/notifications";

import { Button, Input } from "@/components/ui";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import tw from "@/lib/tailwind";
import { updatePushToken, getUsername } from "@/lib/utils";
import Icon from "react-native-vector-icons/FontAwesome";

export default function Profile() {
	const { signOut, user } = useSupabase();
	const [username, setUsername] = useState<string | null>(null);
	const [firstName, setFirstName] = useState<string | null>(null);
	const [lastName, setLastName] = useState<string | null>(null);
	const [tokenUpdated, setTokenUpdated] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [imagePath, setImagePath] = useState<string>('');
	const [firstNameValue, setFirstNameValue] = useState(firstName);
	const [lastNameValue, setLastNameValue] = useState(lastName);
	const { data } = supabase.storage.from("avatar").getPublicUrl(`${user?.id}/avatar.png`);
	const [avatarUrl, setAvatarUrl] = useState<string>(data?.publicUrl || "");


	const handleUpdateInfos = () => {
		if (firstNameValue !== null) {
			updateFirstName(firstNameValue);
		}
		if (lastNameValue !== null) {
			updateLastName(lastNameValue);
		}
	};

	useEffect(() => {
		if (user?.id) {
			getUsername(user?.id).then((username) => setUsername(username || ""));
			getFirstName(user?.id).then((firstName) =>
				setFirstNameValue(firstName || ""),
			);
			getLastName(user?.id).then((lastName) =>
				setLastNameValue(lastName || ""),
			);
		}
		if (!tokenUpdated) {
			registerForPushNotifications().then((token: string | undefined) => {
				const tokenValue = token ?? "";
				updatePushToken(tokenValue, user?.id ?? "").then(() =>
					setTokenUpdated(true),
				);
			});
		}

		const fetchAvatarUrl = async () => {
			const { data, error } = await supabase.storage
			  .from("avatar")
			  .getPublicUrl(`${user?.id}/avatar.png`);
		
			if (error) {
			  console.log("Error fetching avatar:", error.message);
			} else {
			  setAvatarUrl(data?.publicUrl);
			}
		  };
		
		  fetchAvatarUrl();

	}, [user, tokenUpdated]);

	async function uploadAvatar() {
		setIsLoading(true);

		try {
			const file = await ImagePicker.launchImageLibraryAsync({
				mediaTypes: ImagePicker.MediaTypeOptions.Images,

				allowsEditing: true,
			});

			if (file.canceled || !file.assets || file.assets.length === 0) {
				return;
			}

			const image = file.assets[0];
			const resizedImage = await ImageManipulator.manipulateAsync(
				image.uri,

				[{ resize: { width: image.width } }],

				{ compress: 1, format: ImageManipulator.SaveFormat.PNG },
			);

			if (!resizedImage.uri) {
				console.error("Failed to resize image");

				return;
			}
			const fileUri = resizedImage.uri;
			const fileInfo = await FileSystem.getInfoAsync(fileUri);
			if (!fileInfo.exists) {
				console.error("File does not exist");
				return;
			}

			const fileContent = await FileSystem.readAsStringAsync(fileUri, {
				encoding: FileSystem.EncodingType.Base64,
			});

			const buffer = Buffer.from(fileContent, "base64");

			const { error } = await supabase.storage
				.from("avatar")
				.upload(`${user?.id}/avatar.png`, buffer, {
					upsert: true,
					contentType: "image/png",
				});

			if (error) {
				console.error("Failed to upload image:", error);
				setIsLoading(false);
				return;
			}
			else{
				console.log("Avatar uploaded successfully");
            setAvatarUrl(`https://xmfnxrowcwqllkuxogdf.supabase.co/storage/v1/object/public/avatar/${user?.id}/avatar.png`); // Update the avatar URL
			}
		} catch (error) {
			console.error("Error uploading avatar:", error);
			setIsLoading(false);
		}
		setIsLoading(false);
	}
	async function getFirstName(userId: string) {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.select("first_name")
			.eq("id", userId)
			.single();
		if (profiles && profiles.first_name) {
			return profiles.first_name;
		}
		return null;
	}
	async function getLastName(userId: string) {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.select("last_name")
			.eq("id", userId)
			.single();
		if (profiles && profiles.last_name) {
			return profiles.last_name;
		}
		return null;
	}
	async function updateFirstName(firstName: string) {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.update({ first_name: firstName })
			.eq("id", user?.id)
			.single();
		if (profiles && (profiles as { first_name: string }).first_name) {
			return (profiles as { first_name: string }).first_name;
		}
		return null;
	}
	async function updateLastName(lastName: string) {
		const { data: profiles, error } = await supabase
			.from("profiles")
			.update({ last_name: lastName })
			.eq("id", user?.id)
			.single();
		if (profiles && (profiles as { last_name: string }).last_name) {
			return (profiles as { last_name: string }).last_name;
		}
		return null;
	}

	return (
		<SafeAreaView
			style={tw`flex-1 items-center bg-foreground dark:bg-dark-foreground`}
		>
			<View style={tw`flex-row justify-between items-center w-full px-5`}>
				<Icon name="info-circle" style={tw`plus`} />
				<Text
					style={tw` -mr-6 mb-1 text-center h3 font-bold text-dark-foreground dark:text-foreground`}
				>
					Profile
				</Text>
				<TouchableOpacity onPress={signOut}>
					<Icon name="sign-out" style={tw`plus`} />
				</TouchableOpacity>
			</View>

			<View style={tw`p-4 mt-10 items-center justify-center gap-y-10`}>
				<View style={tw`flex-row items-center`}>
					<TouchableOpacity
						onPress={() => console.log(user?.id)}
						onLongPress={uploadAvatar}
					>
						{isLoading ? (
							<ActivityIndicator size="large" color="#00000" style={tw`h-30 w-30`} />
						) : (
							<Image
								source={{ uri: avatarUrl }} // Fix: Pass avatarUrl as a string
								style={tw`h-30 w-30 rounded-full bg-foreground dark:bg-dark-foreground`}
								cachePolicy='none'
							/>
						)}
					</TouchableOpacity>
					<Text
						style={tw`ml-4 text-2xl font-bold text-dark-foreground dark:text-foreground`}
					>
						{username}
					</Text>
				</View>
				<View style={tw`flex flex-col mt-2 gap-y-4`}>
					<Input
						size="large"
						placeholder={firstName ?? "Firstname"}
						value={firstNameValue ?? ""}
						onChangeText={setFirstNameValue}
						style={tw`border-input text-dark-foreground dark:text-foreground`}
					/>
					<Input
						size="large"
						placeholder={lastName ?? "Lastname"}
						value={lastNameValue ?? ""}
						onChangeText={setLastNameValue}
						style={tw`border-input text-dark-foreground dark:text-foreground`}
					/>
				</View>
				<Button
					variant="full"
					label="Update infos"
					onPress={handleUpdateInfos}
				/>
			</View>
		</SafeAreaView>
	);
}
