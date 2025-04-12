import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function Home() {
  const route = useRoute();
  const username = route.params?.username ?? 'User';
  const userid = route.params?.userid ?? 'User';
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

  const handlePostPress = (post) => {
    try {
      const postId = post._id;
      navigation.navigate('Post', { postId });
    } catch (error) {
      console.error('Error fetching post:', error);
    }
  };

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
        <Pressable
          onPress={() => navigation.navigate('Create', { userid: userid })}
          className="items-center rounded bg-green-700 mr-2">
          <Text className="p-3 text-white"> + </Text>
        </Pressable>
        <Pressable onPress={goBack} className="mr-2 items-center rounded bg-green-700">
          <Text className="p-3 text-white">Log Out</Text>
        </Pressable>
      </View>

      <ScrollView className="flex-1 bg-[#121212]" showsVerticalScrollIndicator={false}>
        <View className="flex-1 items-center justify-center bg-[#121212]">
          <View className="mt-5 w-full px-4">
            {posts.map((post, index) => (
              <Pressable
                key={index}
                onPress={() => handlePostPress(post)}
                className="mb-4 rounded-xl bg-[#303030] p-4">
                <Text className="text-[20px] font-bold text-white">{post.title}</Text>
                <Text className="text-gray-400">{post.desc}</Text>
                <Text className="text-gray-400">Posted By {post.author?.username}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
