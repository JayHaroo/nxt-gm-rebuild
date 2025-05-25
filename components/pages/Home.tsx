import { View, Text, Pressable, Image, ScrollView, RefreshControl } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect, useCallback } from 'react';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  const route = useRoute();
  const username = route.params?.username ?? 'User';
  const userid = route.params?.userid ?? 'User';
  const navigation = useNavigation();

  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const goBack = () => navigation.goBack();

  const fetchPost = async () => {
    try {
      const response = await fetch('https://nxtgm-server.onrender.com/api/feed');
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error('Error fetching feed:', error);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchPost().finally(() => setRefreshing(false));
  }, []);

  useEffect(() => {
    fetchPost();
  }, []);

  const handlePostPress = (post) => {
    try {
      const postId = post._id;
      navigation.navigate('Post', { postId, userId: userid, username: username });
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
            className="h-[8px] w-[100px] mr-1 object-contain"
          />
          <Pressable
            onPress={() => navigation.navigate('Profile', { userid: userid, username: username })}>
            <Text className="mr-5 p-3 max-w-8/12 text-white">
              Welcome! {username ? username : 'Loading...'}
            </Text>
          </Pressable>
        </View>
        <Pressable
          onPress={() => navigation.navigate('Create', { userid: userid })}
          className="mr-2 h-[50px] w-[50px] items-center items-center justify-center rounded bg-green-700 align-middle">
          <Ionicons name="create-outline" size={24} color="white" />
        </Pressable>
        <Pressable
          onPress={goBack}
          className="mr-2 h-[50px] w-[50px] items-center items-center justify-center rounded bg-green-700 align-middle">
          <Entypo name="back" size={24} color="white" />
        </Pressable>
      </View>
      <View className="w-full bg-[#121212]">
        <Text className="mb-2 mt-2 text-center text-[20px] font-extrabold text-white">Feed:</Text>
      </View>

      <ScrollView
        className="flex-1 bg-[#121212]"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#00ff00" />
        }>
        <View className="flex-1 items-center justify-center bg-[#121212]">
          <View className="mt-5 w-full px-4">
            {[...posts].reverse().map((post, index) => (
              <Pressable
                key={index}
                onPress={() => handlePostPress(post)}
                className="mb-4 rounded-xl bg-[#303030] p-4">
                <Text className="text-[20px] font-bold text-white">{post.title}</Text>
                <Text className="text-gray-400">{post.desc}</Text>
                <Text className="text-gray-400">Posted By {post.author?.username}</Text>
                {post.image_uri && (
                  <Image
                    source={{ uri: post.image_uri }}
                    className="mt-2 h-[350px] w-full rounded-lg object-contain"
                  />
                )}
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
