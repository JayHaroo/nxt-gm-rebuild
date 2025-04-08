import { View, Text, Pressable, TextInput, Image } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Create() {
  const navigation = useNavigation();
  const route = useRoute();
  const userid = route.params?.userid ?? "User";
  const goBack = () => navigation.goBack();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  // Request media library permissions
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Permission to access media library is required!');
      }
    })();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      allowsEditing: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <View className="flex-1 px-4 py-6 bg-[#121212]">
      <Text className="text-white text-xl mb-4">Create Post: {userid}</Text>

      <TextInput
        placeholder="Enter Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
        className="bg-[#1e1e1e] text-white p-3 rounded-xl mb-4"
      />

      <TextInput
        placeholder="Enter Post Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="bg-[#1e1e1e] text-white p-3 rounded-xl mb-4 h-32"
      />

      <Pressable onPress={pickImage} className="bg-[#2e2e2e] p-3 rounded-xl mb-4 items-center">
        <Text className="text-white">Pick an Image</Text>
      </Pressable>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="w-full h-48 rounded-xl mb-4"
          resizeMode="cover"
        />
      )}

      <Pressable className="bg-green-700 p-3 rounded-xl items-center">
        <Text className="text-white font-semibold">Post</Text>
      </Pressable>

      <Pressable onPress={goBack} className="mt-6 items-center rounded bg-gray-700">
        <Text className="p-3 text-white">Go Back</Text>
      </Pressable>
    </View>
  );
}
