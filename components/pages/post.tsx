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

  return (
    <>
      <View className="items-center bg-[#121212] px-4 py-2 pt-10 h-full">
        <Pressable onPress={() => navigation.goBack()} className="mr-2 items-center rounded bg-green-700">
          <Text className="p-3 text-white">Go Back</Text>
        </Pressable>
        <View className="items-center justify-between bg-[#121212] px-4 py-2 pt-10">
          {details.map((detail) => (
            <View
              key={detail._id}
              className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-10">
              <Text className="text-white font-extrabold text-2xl">{detail.title}</Text>
              <Text className="text-white">{detail.desc}</Text>
            </View>
          ))}
        </View>
      </View>
    </>
  );
}
