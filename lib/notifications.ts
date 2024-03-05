import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';import { Platform } from 'react-native';
import { supabase } from '@/config/supabase';

const expoKey = process.env.EXPO_PUBLIC_ACCESS_TOKEN;

export async function registerForPushNotifications() {
  let token;
  if (Device.isDevice)
  {
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
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
    return token;
}


export const sendPushNotification = async (userId: string, title: string, body: string) => {
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

  try {
  const response = await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      'host': 'exp.host',
      'accept': 'application/json',
      'accept-encoding': 'gzip, deflate',
      'content-type': 'application/json',
      'authorization': `Bearer ${expoKey}`,

    },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`HTTP error! status: ${response.status} ${text}`);
  }

  const receipt = await response.json();
  console.log('Notification envoyée avec succès :', receipt);
} catch (error) {
  console.log('Erreur lors de l\'envoi de la notification :', error);
}
};