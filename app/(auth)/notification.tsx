import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  SafeAreaView,
  FlatList,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import tw from "@/lib/tailwind";
import { supabase } from "@/config/supabase";
import { useSupabase } from "@/hooks/useSupabase";
import { getUsername } from "@/lib/utils";

type Notification = {
  sender_id: string;
  sender_username: string;
  receiver_id: string;
  sent_at: string;
};

function NotificationsList() {
  const { user } = useSupabase();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const PAGE_SIZE = 10;
  const today = new Date().toDateString();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);

    const { data: allNotifications, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_id", user?.id)
      .order("sent_at", { ascending: false })
      .range(page * PAGE_SIZE, (page + 1) * PAGE_SIZE - 1);

    if (error) {
      console.log("Error fetching notifications:", error.message);
      setLoading(false);
      return;
    }

    if (allNotifications.length < PAGE_SIZE) {
      setHasMore(false);
    }

    const notificationsWithUsernames = await Promise.all(
      allNotifications.map(async (notification) => {
        const username = await getUsername(notification.sender_id);
        return { ...notification, sender_username: username };
      })
    );

    setNotifications((prevNotifications) => [
      ...prevNotifications,
      ...notificationsWithUsernames,
    ]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  const handleLoadMore = () => {
	console.log("handleLoadMore");
    if (hasMore && !loading) {
      loadNotifications();
    }
  };

  const renderNotification = ({ item }: { item: Notification }) => (
    <View style={tw`border-list`}>
      <TouchableWithoutFeedback onPress={() => console.log("Pressed!")}>
        <View style={tw`flex-row justify-between w-full`}>
          <Text style={tw`text-xl text-dark-foreground dark:text-foreground mb-2 font-bold w-5/6`}>
            {`${item.sender_username} thought about you ${(Date.now() - new Date(item.sent_at).getTime() < 24 * 60 * 60 * 1000 ? "today": "recently")}`}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );

  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View style={tw`p-4`}>
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  return (
    <SafeAreaView style={tw`w-full h-full flex-1 items-center bg-foreground dark:bg-dark-foreground`}>
		<Text style={tw`h3 font-bold mb-2 self-center mx-auto text-dark-foreground dark:text-foreground`}>
					Notifications
				</Text>
		<View style={tw`flex-row justify-between items-center w-full px-5`}>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.sent_at.toString()}
        renderItem={renderNotification}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.2}
		
      />
	  </View>
    </SafeAreaView>

  );
}

export default React.memo(NotificationsList);