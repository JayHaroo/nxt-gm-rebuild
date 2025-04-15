import { View, Text, Pressable, TextInput, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function Post() {
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params?.postId ?? 'Post';

  const [details, setDetails] = useState([]);

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
            <Pressable onPress={goBack} className="mr-2 items-center rounded bg-green-700">
              <Text className="p-3 text-white">Go Back</Text>
            </Pressable>
          </View>
        </View>

        <View className="items-center justify-between bg-[#121212] px-4 py-2 pt-10">
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
                <Text className="text-[30px] font-extrabold text-white">{detail.title}</Text>
                <Text className="font-bold text-white">
                  Posted By: {detail.author?.username} at {formattedDate}
                </Text>
                <Text className="pt-5 text-[20px] text-white">{detail.desc}</Text>
                {detail.image_uri && (
                  <Image
                    src={detail.image_uri}
                    className="h-[500px] w-[350px] object-contain"
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>
    </>
  );
}
