import { View, Text, Pressable, TextInput, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';

export default function Create() {
  const navigation = useNavigation();
  const route = useRoute();
  const userid = route.params?.userid ?? 'User';
  const goBack = () => navigation.goBack();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access media library is required!');
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

  const SERVER_URL = 'http://192.168.56.1:3000/api/upload';

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    const postData = {
      author: userid,
      title: title,
      desc: description
    };

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Post Failed', errorData.message || 'Something went wrong');
        return;
      }

      const data = await response.json();
      console.log('Posted:', data.title);
      Alert.alert('Success', data.message || 'Uploaded successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };

  return (
    <View className="flex-1 bg-[#121212] px-4 py-6">
      <Text className="mb-4 text-xl text-white">Create Post: {userid}</Text>

      <TextInput
        placeholder="Enter Title"
        placeholderTextColor="#aaa"
        value={title}
        onChangeText={setTitle}
        className="mb-4 rounded-xl bg-[#1e1e1e] p-3 text-white"
      />

      <TextInput
        placeholder="Enter Post Description"
        placeholderTextColor="#aaa"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
        className="mb-4 h-32 rounded-xl bg-[#1e1e1e] p-3 text-white"
      />

      <Pressable onPress={pickImage} className="mb-4 items-center rounded-xl bg-[#2e2e2e] p-3">
        <Text className="text-white">Pick an Image (Optional)</Text>
      </Pressable>

      {imageUri && (
        <Image
          source={{ uri: imageUri }}
          className="mb-4 h-48 w-full rounded-xl"
          resizeMode="cover"
        />
      )}

      <Pressable onPress={handlePost} className="items-center rounded-xl bg-green-700 p-3">
        <Text className="font-semibold text-white">Post</Text>
      </Pressable>

      <Pressable onPress={goBack} className="mt-6 items-center rounded bg-gray-700">
        <Text className="p-3 text-white">Go Back</Text>
      </Pressable>
    </View>
  );
}
