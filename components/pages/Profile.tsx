import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Entypo from '@expo/vector-icons/Entypo';
import { useEffect, useState } from 'react';
import { NXTGM_API } from '@env'; // Ensure you have this in your .env file

export default function Profile() {
  const route = useRoute();
  const userid = route.params?.userid ?? 'User';
  const username = route.params?.username ?? 'User';
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };

  const [posts, setPosts] = useState([]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${NXTGM_API}/api/post/${userid}`);
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  useEffect(() => {
    fetchPost();
  }, []);

  return (
    <View className="h-full items-center bg-[#121212] px-4 py-2 pt-10">
      <View className="items-center justify-between bg-[#121212]">
        <View className="w-full flex-row justify-between bg-[#121212] items-center">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/logo.png')}
              className="h-[8px] w-[100px] object-contain"
            />
          </View>
          <Text className="text-xl font-bold text-white">Profile</Text>
          <Pressable
            onPress={goBack}
            className="mr-2 h-[50px] w-[50px] items-center items-center justify-center rounded bg-green-700 align-middle">
            <Entypo name="back" size={24} color="white" />
          </Pressable>
        </View>

        <View className="mt-5 items-center justify-between bg-[#121212]">
          <Text className="text-3xl font-bold text-white">{username}</Text>
          <Text className="text-sm font-bold text-white">User ID: {userid}</Text>
          <Pressable className='border-2 border-red-500 rounded-full mt-5 w-[120px] items-center' onPress={() => navigation.navigate('Landing')}>
            <Text className='text-white p-2 font-bold text-red-500'>Log out</Text>
          </Pressable>
        </View>

        <Text className="mt-5 text-xl font-bold text-white">Posts:</Text>

        <View className="mt-5 w-max bg-[#121212] px-4">
          {posts.length > 0 ? (
            <ScrollView
              className="w-full"
              contentContainerStyle={{ paddingBottom: 20 }}
              showsVerticalScrollIndicator={false}>
              {posts.map((post) => (
                <Pressable
                  key={post._id}
                  onPress={() => navigation.navigate('Post', { postId: post._id,userId: userid, username: username })}
                  className="rounded-2xl bg-[#1e1e1e] p-4 w-[300px] shadow-md items-center mb-2">
                  <Text className="mb-1 text-lg font-semibold text-white text-center">{post.title}</Text>
                  <Text className="text-gray-400 text-center">{post.desc}</Text>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <Text className="text-center text-base text-white">No posts available</Text>
          )}
        </View>
      </View>
    </View>
  );
}
