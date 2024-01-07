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

export default function Friend() {
	const [isAddFriendModalVisible, setAddFriendModalVisible] = useState(false);

	const toggleAddFriendModalVisibility = () => {
		setAddFriendModalVisible(!isAddFriendModalVisible);
	};

	const handleBackgroundPress = () => {
		setAddFriendModalVisible(false);
	};

	return (
		<TouchableWithoutFeedback onPress={Keyboard.dismiss}>
			<View
				style={tw` pt-10 flex-1 items-start justify-start bg-background dark:bg-dark-background dark:text-white`}
			>
				<View style={tw`flex-row justify-between w-full items-center m-2 p-2`}>
					<Text style={tw`h2 font-bold mb-2 dark:text-white`}>Mes amis</Text>
					<TouchableOpacity
						style={tw`flex-row items-center bg-primary rounded-full h-10 w-10 justify-center mr-4 text-white`}
						onPress={toggleAddFriendModalVisibility}
					>
						<Icon name="plus" style={tw`text-white dark:text-white text-xl`} />
					</TouchableOpacity>
				</View>
				<View style={tw`m-2`}>
					<FriendList />
					<FriendRequests />
				</View>
				<Modal
					animationType="slide"
					transparent={true}
					visible={isAddFriendModalVisible}
					onRequestClose={toggleAddFriendModalVisibility}
				>
					<TouchableWithoutFeedback onPress={handleBackgroundPress}>
						<View style={tw`flex-1 justify-end items-center`}>
							<View
								style={tw`bg-neutral-800 p-4 h-50 h-150 pb-10 rounded-lg justify-between shadow-md w-full`}
							>
								<AddFriend />
								<Button
									label="Close"
									onPress={toggleAddFriendModalVisibility}
									style={tw`bg-neutral-900 rounded-lg h-12 w-1/4 items-center justify-center`}
									textStyle={tw`text-lg font-bold text-white dark:text-white`}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
}
