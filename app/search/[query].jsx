import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import SearchInput from "../../components/SearchInput";
import { StatusBar } from "expo-status-bar";
import EmptyState from "../../components/EmptyState";
import { searchPosts } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../../components/VideoCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();
  const { data: posts, refetch } = useAppwrite(() => searchPosts(query));

  useEffect(() => {
    refetch();
  }, [query]);

  return (
    <SafeAreaView className="bg-primary min-h-full">
      <FlatList
        data={posts}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => <VideoCard video={item} />}
        ListHeaderComponent={() => (
          <View className="mt-4 mb-8 px-4">
            <View className="justify-between items-start mb-6">
              <Text className="font-pmedium text-sm text-gray-100">
                Search Results for: {query}
              </Text>
            </View>
            <SearchInput initialQuery={query} />
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found!"
            subtitle={`No videos found for query: ${query}`}
          />
        )}
      />
      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Search;
