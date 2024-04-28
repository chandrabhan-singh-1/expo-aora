import { View, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../constants";
import { router, usePathname } from "expo-router";
import { Alert } from "react-native";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const onSubmit = () => {
    if (!query) {
      return Alert.alert(
        "Missing query!",
        "Please, input query to search something."
      );
    }

    if (pathname.startsWith("/search")) router.setParams({ query });
    else router.push(`/search/${query}`);
  };

  return (
    <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row space-x-4">
      <TextInput
        className="text-base mt-0.5 text-white flex-1 font-pregular"
        value={query}
        placeholder={"Search..."}
        placeholderTextColor={"#CDCDE0"}
        onChangeText={(e) => setQuery(e)}
        onSubmitEditing={onSubmit}
      />

      <TouchableOpacity onPress={onSubmit}>
        <Image source={icons.search} resizeMode="contain" className="w-6 h-6" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
