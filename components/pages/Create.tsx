import {
  View,
  Text,
  Pressable,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import * as ImagePicker from 'expo-image-picker';
import SearchableDropdown from 'components/elements/Dropdown';
import { accessKeyId, secretAccessKey } from '@env';

export default function Create() {
  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: 'ap-southeast-2',
  });
  const s3 = new AWS.S3();
  const navigation = useNavigation();
  const route = useRoute();
  const userid = route.params?.userid ?? 'User';
  const goBack = () => navigation.goBack();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState(null);
  const [location, setLocation] = useState(null); // null if no image
  const [loading, setLoading] = useState(false);

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
      const uri = result.assets[0].uri;
      setImageUri(uri); // only set local URI, do not upload yet
    }
  };

  const SERVER_URL = 'https://nxtgm-server.onrender.com/api/upload';

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }

    setLoading(true); // show loader
    let uploadedImageUrl = null;

    try {
      if (imageUri) {
        const bucketName = 'nxtgm';
        const fileName = imageUri.split('/').pop();
        const response = await fetch(imageUri);
        const blob = await response.blob();

        const params = {
          Bucket: bucketName,
          Key: `uploads/${Date.now()}_${fileName}`,
          Body: blob,
          ContentType: 'image/jpeg',
        };

        const uploadResult = await s3.upload(params).promise();
        uploadedImageUrl = uploadResult.Location;
      }

      const postData = {
        author: userid,
        title,
        desc: description,
        image_uri: uploadedImageUrl,
        location,
        createdAt: new Date(),
        likes: 0,
        comments: [],
      };

      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Post Failed', errorData.message || 'Something went wrong');
        return;
      }

      const data = await response.json();
      Alert.alert('Success', data.message || 'Uploaded successfully!');
      setTitle('');
      setDescription('');
      setImageUri(null);
      setLocation(null);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setLoading(false); // hide loader
    }
  };

  return (
    <View className="flex-1 bg-[#121212] px-4 py-6">
      {/* <Text className="mb-4 text-xl text-white">Create Post: {userid}</Text> */}
      <View className="mb-[30px] mt-5 flex-row items-center justify-between bg-[#121212]">
        <View className="w-full flex-row items-center justify-between bg-[#121212]">
          <View className="flex-row items-center">
            <Image
              source={require('../../assets/logo.png')}
              className="h-[8px] w-[100px] object-contain"
            />
          </View>
          <Text className="text-xl font-bold text-white">Create Post</Text>
          <Pressable onPress={goBack} className="mr-2 items-center rounded bg-green-700">
            <Text className="p-3 text-white">Go Back</Text>
          </Pressable>
        </View>
      </View>
        <ScrollView>
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
              className="mb-4 h-[300px] w-full rounded-xl"
              resizeMode="cover"
            />
          )}

          <SearchableDropdown onSelect={(location) => setLocation(location)} />

          <Pressable onPress={handlePost} className="items-center rounded-xl bg-green-700 p-3">
            <Text className="font-semibold text-white">Post</Text>
          </Pressable>
          {loading && (
            <View className="absolute bottom-0 left-0 right-0 top-0 z-50 items-center justify-center bg-black/70">
              <ActivityIndicator size="large" color="#00ff88" />
              <Text className="mt-4 text-white">Posting...</Text>
            </View>
          )}
        </ScrollView>
    </View>
  );
}
