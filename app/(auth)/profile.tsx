import React, { useEffect, useState } from "react";
import { Text, View, TouchableOpacity, Image, ActivityIndicator, SafeAreaView } from "react-native";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/config/supabase";
import tw from "@/lib/tailwind";
import { Button, Input } from "@/components/ui";
import { registerForPushNotifications } from '../../lib/notifications';
import { updatePushToken, getUsername } from "@/lib/utils";
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import { Buffer } from 'buffer';




export default function Profile() {
     const { signOut, user } = useSupabase();
     const pictureProfile = supabase.storage.from('avatar').getPublicUrl(`${user?.id}/avatar.png`) || "ya rien ";

     const [username, setUsername] = useState<string | null>(null);
     const [firstName, setFirstName] = useState<string | null>(null);
     const [lastName, setLastName] = useState<string | null>(null);
     const [tokenUpdated, setTokenUpdated] = useState(false);
     const [isLoading, setIsLoading] = useState(false);
     const [imagePath, setImagePath] = useState(null);
     const [firstNameValue, setFirstNameValue] = useState(firstName);
     const [lastNameValue, setLastNameValue] = useState(lastName);

     const handleUpdateInfos = () => {
          updateFirstName(firstNameValue);
          updateLastName(lastNameValue);
     };



     useEffect(() => {
          if (user?.id) {
               getUsername(user?.id).then(username => setUsername(username || ''));
               getFirstName(user?.id).then(firstName => setFirstNameValue(firstName || ''));
               getLastName(user?.id).then(lastName => setLastNameValue(lastName || ''));
          }
          if (!tokenUpdated) {
               registerForPushNotifications().then((token: string | undefined) => {
                    const tokenValue = token ?? "";
                    updatePushToken(tokenValue, user?.id ?? "").then(() => setTokenUpdated(true));
               });
          }

          downloadImage(pictureProfile.data.publicUrl)
               .then(setImagePath)
               .catch(console.error);
     }, [user, tokenUpdated, pictureProfile.data.publicUrl]);

     const downloadImage = async (url: string) => {
          const filename = url.substring(url.lastIndexOf('/') + 1);
          const path = FileSystem.documentDirectory + filename;

          const image = await FileSystem.getInfoAsync(path);
          if (image.exists) {
               return image.uri;
          }

          console.log('Downloading image to cache');
          await FileSystem.downloadAsync(url, path);
          return path;
     };

     async function uploadAvatar() {
          setIsLoading(true);


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

               const { error } = await supabase.storage.from('avatar').upload(`${user?.id}/avatar.png`, buffer, {
                    upsert: true,
                    contentType: 'image/png',
               });

               if (error) {
                    console.error('Failed to upload image:', error);
                    setIsLoading(false);
                    return;
               }

               console.log('Avatar uploaded successfully!');


          } catch (error) {

               console.error('Error uploading avatar:', error);
               setIsLoading(false);


          }
          setIsLoading(false);

     }
     async function getFirstName(userId: string) {
          const { data: profiles, error } = await supabase
               .from("profiles")
               .select("first_name")
               .eq("id", userId)
               .single();
          if (profiles && profiles.first_name) {
               return profiles.first_name;
          }
          return null;
     }
     async function getLastName(userId: string) {
          const { data: profiles, error } = await supabase
               .from("profiles")
               .select("last_name")
               .eq("id", userId)
               .single();
          if (profiles && profiles.last_name) {
               return profiles.last_name;
          }
          return null;
     }
     async function updateFirstName(firstName: string) {
          const { data: profiles, error } = await supabase
               .from("profiles")
               .update({ first_name: firstName })
               .eq("id", user?.id)
               .single();
          if (profiles && profiles.first_name) {
               return profiles.first_name;
          }
          return null;
     }
     async function updateLastName(lastName: string) {
          const { data: profiles, error } = await supabase
               .from("profiles")
               .update({ last_name: lastName })
               .eq("id", user?.id)
               .single();
          if (profiles && profiles.last_name) {
               return profiles.last_name;
          }
          return null;
     }

     return (
          <SafeAreaView style={tw`flex-1  items-center dark:bg-black`}>
               <Text style={tw`p-4 text-2xl font-bold dark:text-white`}>Profile</Text>
               <View style={tw`p-4 mt-10 items-center justify-center gap-y-10`}>
                    <View style={tw`flex-row items-center`}>
                         <TouchableOpacity
                              onPress={() => console.log("small press")}
                              onLongPress={uploadAvatar}
                         >
                              {isLoading ? (
                                   <ActivityIndicator size="large" color="#00000" />
                              ) : (
                                   <Image
                                        source={{ uri: imagePath }}
                                        style={tw`h-30 w-30 rounded-full`}
                                   />
                              )}
                         </TouchableOpacity>
                         <Text style={tw`ml-4 text-2xl font-bold dark:text-white`}>{username}</Text>
                    </View>
                    <View style={tw`flex flex-col mt-2 gap-y-4`}>
                         <Input size={"large"} placeholder={firstName ?? 'Firstname'} value={firstNameValue} onChangeText={setFirstNameValue} />
                         <Input size={"large"} placeholder={lastName ?? 'Lastname'} value={lastNameValue} onChangeText={setLastNameValue} />
                    </View>
                    <Button variant="full" label="Update infos" onPress={handleUpdateInfos} />
               </View>
          </SafeAreaView>
     );
}