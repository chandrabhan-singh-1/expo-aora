import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { ResizeMode, Video } from "expo-av";
import * as DocumentPicker from "expo-document-picker";
import * as ImagePicker from "expo-image-picker";

import { useGlobalContext } from "../../context/GlobalProvider";
import FormField from "../../components/FormField";
import CustomButton from "../../components/CustomButton";
import { icons } from "../../constants";
import { router } from "expo-router";
import { createVideo } from "../../lib/appwrite";

const Create = () => {
  const { user } = useGlobalContext();
  const [isUploading, setIsUploading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    video: null,
    thumbnail: null,
    prompt: "",
  });

  const openPicker = async (selectType) => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:
        selectType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.Videos,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      if (selectType === "image") {
        setForm({ ...form, thumbnail: result.assets[0] });
      }

      if (selectType === "video") {
        setForm({ ...form, video: result.assets[0] });
      }
      //  else {
      //   setTimeout(() => {
      //     Alert.alert("Document Picked!", JSON.stringify(result, null, 2));
      //   }, 100);
      // }
    }
  };

  const onSubmit = async () => {
    if (!form.title || !form.thumbnail || !form.video || !form.prompt) {
      return Alert.alert("Please! Fill all the fields.");
    }

    setIsUploading(true);

    try {
      await createVideo({ ...form, userId: user.$id });

      Alert.alert("Success: Post uploaded successfully!");
      router.push("/home");
    } catch (error) {
      Alert.alert("Error: " + error.message);
    } finally {
      setForm({
        title: "",
        video: null,
        thumbnail: null,
        prompt: "",
      });
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView className="px-4 mb-6">
        <Text className="text-2xl mt-4 text-white font-psemibold text-center">
          Upload Video
        </Text>

        <FormField
          title="Video Title"
          value={form.title}
          placeholder={"Give a catchy title..."}
          handleChangeText={(e) => setForm({ ...form, title: e })}
          otherStyles="mt-8"
        />

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Upload Video
          </Text>

          <TouchableOpacity onPress={() => openPicker("video")}>
            {form.video ? (
              <Video
                source={{ uri: form.video.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode={ResizeMode.COVER}
              />
            ) : (
              <View className="w-full h-50 px-4 border-2 border-black-200 bg-black-100 rounded-2xl justify-center items-center">
                <View className="w-14 h-14 border-dashed  border-secondary-100 justify-center items-center">
                  <Image
                    source={icons.upload}
                    resizeMode="contain"
                    className="w-1/2 h-1/2"
                  />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View className="mt-7 space-y-2">
          <Text className="text-base text-gray-100 font-pmedium">
            Thumbnail Image
          </Text>

          <TouchableOpacity onPress={() => openPicker("image")}>
            {form.thumbnail ? (
              <Image
                source={{ uri: form.thumbnail.uri }}
                className="w-full h-64 rounded-2xl"
                resizeMode="cover"
              />
            ) : (
              <View className="w-full h-16 px-4 border-2 border-black-200 bg-black-100 rounded-2xl justify-center items-center flex-row space-x-2">
                <Image
                  source={icons.upload}
                  resizeMode="contain"
                  className="w-5 h-5"
                />

                <Text className="text-sm text-gray-100 font-pmedium">
                  Choose a file
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <FormField
          title="AI Prompt"
          value={form.prompt}
          placeholder={"Prompt used to create video..."}
          handleChangeText={(e) => setForm({ ...form, prompt: e })}
          otherStyles="mt-7"
        />

        <CustomButton
          title="Submit & Publish"
          handlePress={onSubmit}
          containerStyles="mt-7"
          isLoading={isUploading}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Create;
