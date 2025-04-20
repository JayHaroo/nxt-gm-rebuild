import { View, Text, Pressable, TextInput, Image, Alert, Flatlist } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AWS from 'aws-sdk';
import * as ImagePicker from 'expo-image-picker';
import SearchableDropdown from 'components/elements/Dropdown';

export default function Create() {
  AWS.config.update({
    accessKeyId: 'AKIAWIWZF6E3OPBBARKA',
    secretAccessKey: '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',
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
    
  const SERVER_URL = 'http://192.168.56.1:3000/api/upload';

  const handlePost = async () => {
    if (!title || !description) {
      Alert.alert('Missing Info', 'Please fill in all fields.');
      return;
    }
  
    let uploadedImageUrl = null;
  
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
  
      try {
        const uploadResult = await s3.upload(params).promise();
        console.log('Uploaded to S3:', uploadResult.Location);
        uploadedImageUrl = uploadResult.Location;
      } catch (err) {
        console.error('S3 Upload Error:', err);
        Alert.alert('Upload Error', 'Failed to upload image to S3.');
        return;
      }
    }
  
    const postData = {
      author: userid,
      title,
      desc: description,
      image_uri: uploadedImageUrl,
      location, // null if no image
      createdAt: new Date(),
      likes: 0, // initialize likes
      comments: [], // initialize empty comments array
    };
    
  
    try {
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
      console.log('Posted:', data.title);
      Alert.alert('Success', data.message || 'Uploaded successfully!');
      // optionally clear the form
      setTitle('');
      setDescription('');
      setImageUri(null);
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    }
  };
    

  return (
    <View className="flex-1 bg-[#121212] px-4 py-6">
      {/* <Text className="mb-4 text-xl text-white">Create Post: {userid}</Text> */}
      <View className="mb-[30px] mt-5 flex-row items-center justify-between bg-[#121212]">
        <View className="w-full flex-row justify-between bg-[#121212] items-center">
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
    </View>
  );
}
