import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { supabase } from '@/config/supabase';

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
  let match = token?.match(/\[(.*?)\]/);
  if (match) {
  let extractedToken = match[1];
  token = extractedToken;
}

  return token;
}

const sendPushNotification = async (userId: string, title: string, body: string) => {
  // Récupérer le jeton de notification push de l'utilisateur
  const { data: user, error } = await supabase
    .from('profiles')
    .select('push_token')
    .eq('id', userId)
    .single();

  if (error || !user?.push_token) {
    console.log('Erreur lors de la récupération du jeton push :', error);
    return;
  }

  const message = {
    to: user.push_token,
    sound: 'default',
    title: title,
    body: body,
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
};