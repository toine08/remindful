import tw from "@/lib/tailwind";
import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	TouchableWithoutFeedback,
	Keyboard,
	SafeAreaView,
} from "react-native";

import AddFriend from "../../components/friends/addFriend";
import FriendRequests from "@/components/friends/friendRequest";
import FriendList from "@/components/friends/friendList";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "@/components/ui";


export default function Index() {
	const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);
	const [selectedUser, setSelectedUser] = useState(null);


	const toggleAddFriendModalVisibility = () => {
		setAddFriendModalVisible(!isAddFriendModalVisible);
	};

	const handleBackgroundPress = () => {
		setAddFriendModalVisible(false);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<SafeAreaView style={tw`pt-10 flex-1 items-start w-full justify-start bg-dark-background dark:bg-dark-background dark:text-white`}>
				<Text style={tw`h2 font-bold mb-2 dark:text-white self-center mx-auto`}>Home</Text>
				<View style={tw`flex-1 w-full items-center m-2 p-2`}>
					<View style={tw`flex-row justify-end w-full `}>
						<TouchableOpacity
							style={tw`flex-row items-center rounded-full h-10 w-10 mr-5 justify-center text-white`}
							onPress={toggleAddFriendModalVisibility}
						>
							<Icon name="plus" style={tw`text-white dark:text-white text-3xl`} />
						</TouchableOpacity>
					</View>
					<View style={tw`flex-1 w-full`}>
						<FriendList />
						<FriendRequests />
					</View>
				</View>
				<Modal
					animationType="slide"
					transparent={true}
					visible={isAddFriendModalVisible}
					onRequestClose={toggleAddFriendModalVisibility}
				>

					<TouchableWithoutFeedback onPress={handleBackgroundPress}>
						<View style={tw`flex-1 justify-end items-center`}>
							<View style={tw`bg-primary p-4 h-50 h-150 pb-10 rounded-lg justify-between shadow-md w-full`}>
								<AddFriend />
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
