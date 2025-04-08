import { View, Text, Pressable, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function Home() {
  const route = useRoute();
  const username = route.params?.userid ?? "User";
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);

  const goBack = () => navigation.goBack();
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch('http://192.168.56.1:3000/api/feed');
        const data = await response.json();
        setPosts(data);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchPost();
  }, []);

  return (
    <>
      <View className="flex-row items-center justify-between bg-[#121212] px-4 py-2 pt-10">
        <View className="flex-row items-center">
          <Image
            source={require('../../assets/logo.png')}
            className="h-[8px] w-[100px] object-contain"
          />
          <Text className="mr-5 p-3 text-white">Welcome! {username ? username : 'Loading...'}</Text>
        </View>
        <Pressable onPress={goBack} className="items-center rounded bg-blue-500">
          <Text className="p-3 text-white">Go Back</Text>
        </Pressable>
      </View>

      <View className="flex-1 items-center justify-center bg-[#121212]">
        <View className="mt-5 w-full px-4">
          {posts.map((post, index) => (
            <View key={index} className="mb-4 rounded-xl bg-[#303030] p-4">
              <Text className="text-[20px] font-bold text-white">{post.title}</Text>
              <Text className="text-gray-400">{post.desc}</Text>
              <Text className="text-gray-400">Posted By {post.author?.username}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
