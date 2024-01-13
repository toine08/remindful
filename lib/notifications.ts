import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function registerForPushNotifications() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log("token from /notification.ts", token)
  } else {
    alert('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  let match = token.match(/\[(.*?)\]/);
  if (match) {
  let extractedToken = match[1];
  token = extractedToken;
}

  return token;
}

export async function sendPushNotification(userId, title, body) {
  const message = {
    to: userId,
    sound: 'default',
    title: title,
    body: body,
    data: { data: 'goes here' },
    _displayInForeground: true,
  };

  try {
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(message),
    });

    console.log('Push notification sent successfully.');
  } catch (error) {
    console.error('Error sending push notification:', error.message);
  }
};

// Usage
const userId = 12345;
const token = registerForPushNotifications();
sendPushNotification(token, 'New message', 'You have received a new message');