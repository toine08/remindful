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
} from "react-native";

import AddFriend from "../../components/friends/addFriend";
import FriendRequests from "@/components/friends/friendRequest";
import FriendList from "@/components/friends/friendList";
import Icon from "react-native-vector-icons/FontAwesome";
import { Button } from "@/components/ui";


export default function Index() {
	const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

	const toggleAddFriendModalVisibility = () => {
		setAddFriendModalVisible(!isAddFriendModalVisible);
	};

	const handleBackgroundPress = () => {
		setAddFriendModalVisible(false);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View style={tw`flex-1 pt-10 items-center dark:bg-black`}>
				<Text style={tw`h2 font-bold dark:text-white`}>Home</Text>
				<View style={tw`flex-1 w-full items-center p-2`}>

					<View style={tw`flex-row justify-end w-full `}>
						<TouchableOpacity
							style={tw`flex-row items-center rounded-full h-10 w-10 mr-5 justify-center text-white`}
							onPress={toggleAddFriendModalVisibility}
						>
							<Icon name="plus" style={tw`text-white dark:text-white text-3xl`} />
						</TouchableOpacity>
					</View>
					<View style={tw`flex-1 w-full pl-2`}>
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
							<View style={tw`bg-neutral-800 p-4 h-50 h-150 pb-10 rounded-lg justify-between shadow-md w-full`}>
								<AddFriend />
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
}
