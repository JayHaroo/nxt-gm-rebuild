import { View, Text, Pressable, Image } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useState,useEffect } from "react";

export default function Home() {
  const route = useRoute();
  const userid  = route.params?.userid || null;
  const navigation = useNavigation();

  const [username, setUsername] = useState("User");
  const [posts, setPosts] = useState([]);

  const goBack = () => navigation.goBack();

  useEffect(() => {
    const fetchUsername = async () => {
      if (!userid) return;
      try {
        const res = await fetch(`http://192.168.56.1:3000/api/user/${userid}`);
        const data = await res.json();
        setUsername(data.username || "User");
      } catch (err) {
        console.error("Error fetching username:", err);
      }
    };

    fetchUsername();
  }, [userid]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch("http://192.168.56.1:3000/api/feed");
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error("Error fetching feed:", error);
      }
    };

    fetchPost();
  }, []);

  return (
    <>
      <View className="flex-row bg-[#121212] items-center justify-between px-4 py-2 pt-10">
        <View className="flex-row items-center">
          <Image source={require("../../assets/logo.png")} className="object-contain h-[8px] w-[100px]" />
          <Text className="text-white p-3 mr-5">Welcome! {username}</Text>
        </View>
        <Pressable onPress={goBack} className="bg-blue-500 rounded items-center">
          <Text className="text-white p-3">Go Back</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center bg-[#121212]">
        <View className="mt-5 w-full px-4">
          {posts.map((post, index) => (
            <View key={index} className="mb-4 p-4 bg-[#303030] rounded-xl">
              <Text className="text-white font-bold text-[20px]">{post.title}</Text>
              <Text className="text-gray-400">{post.desc}</Text>
              <Text className="text-gray-400">Posted By {post.author?.username}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
