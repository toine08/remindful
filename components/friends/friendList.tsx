import { useEffect, useState, memo, useCallback } from "react";
import {
  Text,
  View,
  TouchableWithoutFeedback,
  TouchableOpacity,
  FlatList,
  Modal,
} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { sendPushNotification } from "@/lib/notifications";
import tw from "@/lib/tailwind";
import { getUsername, getConnectedUsername } from "@/lib/utils";
import React from "react";
import Toast from "react-native-root-toast";
import { useIsFocused } from "@react-navigation/native";
import { useUserFriends } from "@/hooks/useUserFriends";

type Friend = {
  friend_id: string;
  requester: string;
  receiver: string;
  state: "pending" | "accepted" | "rejected";
  username: string; // Add the 'username' property to the Friend type
};

function FriendList() {
  const { user } = useSupabase();
  const isFocused = useIsFocused(); // Detect when the screen is focused
  const { friends, loading, error } = useUserFriends(user?.id ?? "");
  const [friendsList, setFriendsList] = useState<Friend[]>([]);
  const [friendsName, setFriendsName] = useState<string[]>([]);
  const [connectedUsername, setConnectedUsername] = useState("");
  const [selectedFriendUsername, setSelectedFriendUsername] = useState<
    string | null
  >(null);
  const [isCardVisible, setCardVisible] = useState(false);

  // Fetch updated friends list when screen is focused
  useEffect(() => {
    if (isFocused) {
      getFriends();
      getConnectedUsername(user?.id ?? "").then((connectedUsername) =>
        setConnectedUsername(connectedUsername || "")
      );
    }
  }, [isFocused, user]);

  useEffect(() => {
    if (selectedFriendUsername) {
      (async () => {
        try {
          const name = await getName(selectedFriendUsername);
          setFriendsName(name ? [name] : []);
        } catch (error) {
          console.error("Error getting name:", error);
          setFriendsName([]);
        }
      })();
    }
  }, [selectedFriendUsername]);

  async function getFriends() {
    const friendsWithUsername = [];
    const { data: friends, error } = await supabase
      .from("friends")
      .select("*")
      .or(`requester.eq.${user?.id},receiver.eq.${user?.id}`)
      .eq("state", "accepted");

    if (error) {
      console.log("Error fetching friends:", error.message);
    } else if (friends) {
      for (const friend of friends) {
        const friend_id =
          friend.requester === user?.id ? friend.receiver : friend.requester;
        const username = await getUsername(friend_id);
        friendsWithUsername.push({
          ...friend,
          username,
          friend_id,
        });
      }
      setFriendsList(friendsWithUsername); // Use `setFriendsList` instead of `setFriends`
    }
  }

  const handleFriendPress = (username: string) => {
    setSelectedFriendUsername(username);
    setCardVisible(true);
  };

  const getName = async (username: string) => {
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("first_name, last_name")
      .eq("username", username)
      .single();

    if (error) {
      console.error("Error getting profile:", error.message);
      return;
    }
    if (profile) {
      return `${profile.first_name} ${profile.last_name}`;
    }
  };

  const deleteFriend = async () => {
    if (!selectedFriendUsername) return;

    const friend = friendsList.find((f) => f.username === selectedFriendUsername); // Use `friendsList`
    if (!friend) return;

    try {
      const { error } = await supabase
        .from("friends")
        .delete()
        .or(`requester.eq.${friend.friend_id},receiver.eq.${friend.friend_id}`)
        .or(`requester.eq.${user?.id},receiver.eq.${user?.id}`);

      if (error) {
        console.error("Error deleting friend:", error.message);
      } else {
        setCardVisible(false);
        getFriends(); // Refresh the list after deleting
      }
    } catch (error) {
      console.error("Error during deletion:", error);
    }
  };

  const handleNotificationSend = async (friendId: string) => {
    if (!user || !connectedUsername) return;

    const response = await sendPushNotification({
      senderId: user.id,
      receiverId: friendId,
      message: `${connectedUsername} pense à toi!`,
      type: "thought",
    });

    if (!response.success) {
      Toast.show("Only one thought per hour, please try again later.", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#d1001f",
        opacity: 1
      });
    } else {
      Toast.show("Notification sent successfully!", {
        duration: Toast.durations.LONG,
        position: Toast.positions.TOP,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 0,
        backgroundColor: "#d1001f",
        opacity: 1
      });
    }
  };

  return (
    <View style={tw`flex-1 pt-5 w-full h-full`}>
      <FlatList
        data={friendsList} // Use `friendsList`
        keyExtractor={(item) => item.friend_id || item.username}
        renderItem={({ item: friend, index }) => (
          <View style={tw`${index === 0 ? "border-t" : ""} border-list`}>
            <TouchableWithoutFeedback
              onLongPress={() => handleFriendPress(friend.username)}
            >
              <View style={tw`flex-row justify-between w-full`}>
                <Text
                  style={tw`text-xl text-dark-foreground dark:text-foreground mb-2 font-bold w-5/6`}
                >
                  {friend.username}
                </Text>
                <TouchableOpacity
                  style={tw`flex-row items-center w-1/6`}
                  onPress={() => handleNotificationSend(friend.friend_id)}
                >
                  <Icon name="bell" style={tw`bell`} />
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        )}
        ListFooterComponent={<View style={{ height: 100 }} />}
      />

      {isCardVisible && selectedFriendUsername && (
        <Modal
          animationType="none"
          transparent
          visible={isCardVisible}
          onRequestClose={() => {
            setCardVisible(false);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setCardVisible(false)}>
            <View
              style={tw`flex-1 h-100 justify-center items-center bg-black bg-opacity-50`}
            >
              <View
                style={tw`bg-foreground dark:bg-dark-foreground p-6 rounded-lg shadow-lg w-3/4`}
              >
                <Text
                  style={tw`text-2xl text-center text-dark-foreground dark:text-foreground mb-4`}
                >
                  {selectedFriendUsername}
                </Text>
                <Text
                  style={tw`text-center text-dark-foreground dark:text-foreground mb-4`}
                >
                  {friendsName.join(", ")}
                </Text>
                <View style={tw`mt-4 flex-row justify-center items-center`}>
                  <Text
                    style={tw`text-xl mr-2 text-dark-foreground dark:text-foreground`}
                  >
                    Delete your friendship?
                  </Text>
                  <Icon style={tw`trash`} name="trash" onPress={deleteFriend} />
                </View>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}

export default memo(FriendList);
