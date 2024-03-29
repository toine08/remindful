import React, { useState } from "react";
import {
	View,
	Text,
	TouchableOpacity,
	Modal,
	TouchableWithoutFeedback,
	Keyboard,
	SafeAreaView,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

import AddFriend from "../../components/friends/addFriend";

import FriendList from "@/components/friends/friendList";
import FriendRequests from "@/components/friends/friendRequest";
import tw from "@/lib/tailwind";

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
			<SafeAreaView
				style={tw`pt-10 flex-1 items-start w-full justify-start bg-foreground dark:bg-dark-foreground`}
			>
				<Text style={tw`h3 font-bold mb-2 self-center mx-auto text-dark-foreground dark:text-foreground`}>
					Home
				</Text>
				<View style={tw`flex-1 w-full items-center m-2 p-2`}>
					<View style={tw`flex-row justify-end w-full `}>
						<TouchableOpacity
							style={tw`flex-row items-center rounded-full h-10 w-10 mr-5 justify-center text-foreground dark:text-foreground`}
							onPress={toggleAddFriendModalVisibility}
						>
							<Icon
								name="plus"
								style={tw`plus`}
							/>
						</TouchableOpacity>
					</View>
					<View style={tw`flex-1 w-full`}>
						<FriendList />
						<FriendRequests />
					</View>
				</View>
				<Modal
					animationType="slide"
					transparent
					visible={isAddFriendModalVisible}
					onRequestClose={toggleAddFriendModalVisibility}
				>
					<TouchableWithoutFeedback onPress={handleBackgroundPress}>
						<View style={tw`flex-1 justify-end items-center`}>
							<View
								style={tw`bg-foreground  dark:bg-dark-foreground p-4 h-50 h-150 pb-10 rounded-lg justify-between shadow-lg w-full`}
							>
								<AddFriend />
							</View>
						</View>
					</TouchableWithoutFeedback>
				</Modal>
			</SafeAreaView>
		</TouchableWithoutFeedback>
	);
}
