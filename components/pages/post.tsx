import { View, Text, Pressable, TextInput, Image, Alert, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function Post() {
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params?.postId ?? 'Post';

  const [details, setDetails] = useState([]);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:3000/api/feed/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setDetails([data]); // Wrap in array to match `.map()` usage
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    fetchPost();
  }, []);

  const goBack = () => navigation.goBack();

  return (
    <>
      <View className="h-full items-center bg-[#121212] px-4 py-2 pt-10">
        <View className="flex-row items-center justify-between bg-[#121212]">
          <View className="w-full flex-row justify-between bg-[#121212]">
            <View className="flex-row items-center">
              <Image
                source={require('../../assets/logo.png')}
                className="h-[8px] w-[100px] object-contain"
              />
            </View>
            <Pressable
              onPress={goBack}
              className="mr-2 h-[50px] w-[50px] items-center items-center justify-center rounded bg-green-700 align-middle">
              <Entypo name="back" size={24} color="white" />
            </Pressable>
          </View>
        </View>

        <ScrollView className='w-full'>
          <View className="items-center justify-between bg-[#121212]">
            {details.map((detail) => {
              const formattedDate = new Date(detail.createdAt).toLocaleString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
                hour12: true,
              });

              return (
                <View
                  key={detail._id}
                  className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-10">
                  <Text className="text-[30px] font-extrabold text-white text-center">{detail.title}</Text>
                  <Text className="font-bold text-gray-400">
                    Posted By: {detail.author?.username} at {formattedDate}
                  </Text>
                  <Text className="pt-5 text-[20px] text-white text-center p-7">{detail.desc}</Text>
                  {detail.image_uri && (
                    <Image src={detail.image_uri} className="h-[500px] w-[350px] object-contain" />
                  )}
                </View>
              );
            })}
          </View>
          <View className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-10">
            {isLiked ? (
              <Pressable onPress={() => setIsLiked(false)}>
                <AntDesign name="like1" size={40} color="white" />
              </Pressable>
            ) : (
              <Pressable onPress={() => setIsLiked(true)}>
                <AntDesign name="like2" size={40} color="white" />
              </Pressable>
            )}
            <Text className="p-5 text-[20px] font-bold text-white">Comments:</Text>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
