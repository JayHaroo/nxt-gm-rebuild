import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useState,useEffect } from "react";

export default function Home() {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  }

  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("http://192.168.56.1:3000/api/feed"); // Adjust URL if necessary
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching:", error);
      }
    };

    fetchPost();
  }, []);

  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Text className="text-white">Welcome to the Home Screen!</Text>
      <Pressable onPress={goBack} className="mt-4 bg-blue-500 p-2 rounded">
        <Text className="text-white">Go Back</Text>
      </Pressable>

      <View className="mt-5 w-full px-4">
        {posts.map((post, index) => (
          <View key={index} className="mb-4 p-4 bg-gray-800 rounded">
            <Text className="text-white">{post.title}</Text>
            <Text className="text-gray-400">{post.desc}</Text>
            <Text className="text-gray-400">Posted By {post.author?.username}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}