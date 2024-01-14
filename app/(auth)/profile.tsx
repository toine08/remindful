import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { Button } from "@/components/ui";
import { registerForPushNotifications } from '../../lib/notifications';
import { updatePushToken, getUsername } from "@/lib/utils";
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';




export default function Profile() {
     const { signOut, user, session } = useSupabase();
     const userSession = session?.access_token;
     const [username, setUsername] = useState<string | null>(null);
     const [tokenUpdated, setTokenUpdated] = useState(false);
     const [image, setImage] = useState<string | null>(null); // Add this line
     const pictureProfile = supabase.storage.from('avatars').getPublicUrl(`${user?.id}/avatar.png`) || "ya rien ";

     useEffect(() => {
          if (user?.id) {
               getUsername(user?.id).then(username => setUsername(username || ''));
          }
          if (!tokenUpdated) {
               registerForPushNotifications().then((token: string | undefined) => {
                    const tokenValue = token ?? "";
                    updatePushToken(tokenValue, user?.id ?? "").then(() => setTokenUpdated(true));
               });
          }
     }, [user, tokenUpdated]);

     async function uploadAvatar() {

          try {

               const file = await ImagePicker.launchImageLibraryAsync({

                    mediaTypes: ImagePicker.MediaTypeOptions.Images,

                    allowsEditing: true,

               });


               if (file.canceled || !file.assets || file.assets.length === 0) {

                    return;

               }

               const image = file.assets[0];
               const resizedImage = await ImageManipulator.manipulateAsync(

                    image.uri,

                    [{ resize: { width: image.width } }],

                    { compress: 1, format: ImageManipulator.SaveFormat.PNG },

               );

               if (!resizedImage.uri) {

                    console.error('Failed to resize image');

                    return;

               }
               const fileUri = resizedImage.uri;
               const fileInfo = await FileSystem.getInfoAsync(fileUri);
               if (!fileInfo.exists) {
                    console.error('File does not exist');
                    return;
               }

               const fileContent = await FileSystem.readAsStringAsync(fileUri, {
                    encoding: FileSystem.EncodingType.Base64,
               });

               const buffer = Buffer.from(fileContent, 'base64');

               const { error } = await supabase.storage.from('avatars').upload(`${user?.id}/avatar.png`, buffer, {
                    upsert: true,
                    contentType: 'image/png',
               });

               if (error) {
                    console.error('Failed to upload image:', error);
                    return;
               }

               console.log('Avatar uploaded successfully!');
               setImage(`${supabase.storage.from('avatars').getPublicUrl(`${user?.id}/avatar.png`)}`);

          } catch (error) {

               console.error('Error uploading avatar:', error);

          }

     }

     return (
          <View
               style={tw`flex-1 items-center justify-center bg-background pt-12 dark:bg-dark-background dark:text-white`}
          >
               <View>
                    <Image
                         source={`${pictureProfile.data.publicUrl}`}
                         style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "red" }}
                    />
                    <Button label="Choisir une image" onPress={() => console.log(pictureProfile)} />
                    <Text style={tw`text-xl dark:text-white`}>Hello {username}</Text>
                    <Button label="SignOut" textStyle={tw`font-bold`} onPress={signOut} />
               </View>
          </View>
     );
}