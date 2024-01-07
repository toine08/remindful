import tw from "@/lib/tailwind";
import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TextInput,
	Button,
	TouchableWithoutFeedback,
	Keyboard,
} from "react-native";

import AddFriend from "../../components/friends/addFriend";
import FriendRequests from "@/components/friends/friendRequest";
import FriendList from "@/components/friends/friendList";
import Icon from "react-native-vector-icons/FontAwesome";

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
						style={tw`flex-row items-center bg-primary rounded-full h-10 w-10 justify-center ml-2`}
						onPress={toggleAddFriendModalVisibility}
					>
						<Icon name="plus" style={tw`dark:text-white text-xl`} />
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
						<View style={tw`flex-1 justify-center items-center`}>
							<View style={tw`bg-white p-4 h-50 w-full rounded shadow-md w-80`}>
								<AddFriend />
								<Button
									title="Close"
									onPress={toggleAddFriendModalVisibility}
								/>
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</View>
		</TouchableWithoutFeedback>
	);
}
