import React, { useEffect, useState } from "react";
import { Text, View, Image } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { Button } from "@/components/ui";
import { registerForPushNotifications } from '../../lib/notifications';
import { updatePushToken, getUsername } from "@/lib/utils";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';


export default function Profile() {
     const { signOut, user, session } = useSupabase();
     const userSession = session?.access_token;
     const [username, setUsername] = useState<string | null>(null);
     const [tokenUpdated, setTokenUpdated] = useState(false);
     const [image, setImage] = useState<string | null>(null); // Add this line

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

               console.log('image uri avant process', image.uri);


               const resizedImage = await ImageManipulator.manipulateAsync(

                    image.uri,

                    [{ resize: { width: image.width } }],

                    { compress: 1, format: ImageManipulator.SaveFormat.JPEG },

               );


               if (!resizedImage.uri) {

                    console.error('Failed to resize image');

                    return;

               }


               const response = await fetch(resizedImage.uri);

               const blob = await response.blob();
               const blobUrl = URL.createObjectURL(blob);
               console.log("Blob URL", blobUrl);


               const fileName = `${user?.id}`;

               const { error } = await supabase.storage.from('avatars').upload(user?.id, resizedImage.uri, {
                    upsert: true,
                    contentType: 'image/jpeg',
               });


               if (error) {

                    throw error;

               }


               console.log('Avatar uploaded successfully!');

               setImage(`${supabase.storage.from('avatars').getPublicUrl(resizedimage.uri)}`);

          } catch (error) {

               console.error('Error uploading avatar:', error);

          }

     }

     return (
          <View
               style={tw`flex-1 items-center justify-center bg-background pt-12 dark:bg-dark-background dark:text-white`}
          >
               <View>
                    {image ? (
                         <Image
                              source={{ uri: image.uri }}
                              style={{ width: 100, height: 100, borderRadius: 50, backgroundColor: "red" }}
                         />
                    ) : (
                         <Button label="Choisir une image" onPress={uploadAvatar} />
                    )}
                    <Text style={tw`text-xl dark:text-white`}>Hello {username}</Text>
                    <Button label="SignOut" textStyle={tw`font-bold`} onPress={signOut} />
               </View>
          </View>
     );
}