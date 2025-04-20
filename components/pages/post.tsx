import { View, Text, Pressable, TextInput, Image, Alert, ScrollView, Modal } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Post() {
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params?.postId ?? 'Post';
  const username = route.params?.username;
  const userId = route.params?.userId; // make sure you're passing this when navigating

  const [details, setDetails] = useState([]);
  const [isLiked, setIsLiked] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [owner, setOwner] = useState(false);
  const [comment, setComment] = useState('');
  const checkIfLiked = (likesArray, userId) => {
    return likesArray?.some((id) => id === userId);
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://192.168.56.1:3000/api/feed/${postId}`);
        if (response.ok) {
          const data = await response.json();
          setDetails([data]);

          const isOwner = data.author?.username === username;
          setOwner(isOwner);

          const liked = checkIfLiked(data.likes, userId);
          setIsLiked(liked);

          console.log('Post details:', postId);
        }
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    };

    if (username && postId) {
      fetchPost(); // Make sure username is present before fetching
    }
  }, [username, postId]);

  const deletePost = async () => {
    try {
      const response = await fetch(`http://192.168.56.1:3000/api/delete/${postId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const data = await response.json();
        setDetails([data]); // Wrap in array to match `.map()` usage
      } else {
        console.error('Failed to delete post:', response.statusText);
      }
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  // Like/Unlike function
  const toggleLike = async () => {
    try {
      const response = await fetch(`http://192.168.56.1:3000/api/like/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }), // Assuming username is used as user ID
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(!isLiked); // Toggle like state
        Alert.alert(data.message); // Show like/unlike status
      } else {
        console.error('Failed to like/unlike post');
      }
    } catch (error) {
      console.error('Error liking/unliking post:', error);
    }
  };

  // Comment submission function
  const submitComment = async () => {
    if (!comment) {
      return Alert.alert('Please enter a comment');
    }

    try {
      const response = await fetch(`http://192.168.56.1:3000/api/comment/${postId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userId, // Assuming username is used as user ID
          comment: comment,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setComment(''); // Clear the comment input
        Alert.alert('Comment added!');
      } else {
        console.error('Failed to add comment');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const goBack = () => navigation.goBack();

  return (
    <>
      <View className="h-full items-center bg-[#121212] px-4 py-2 pt-10">
        <View className="mb-5 flex-row items-center justify-between bg-[#121212]">
          <View className="w-full flex-row justify-between bg-[#121212]">
            <View className="flex-row items-center">
              <Image
                source={require('../../assets/logo.png')}
                className="h-[8px] w-[100px] object-contain"
              />
            </View>
            <Pressable
              onPress={goBack}
              className="mr-2 h-[50px] w-[50px] items-center justify-center rounded bg-green-700">
              <Entypo name="back" size={24} color="white" />
            </Pressable>
          </View>
        </View>
        <ScrollView className="w-full" persistentScrollbar={false}>
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
                  className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-2">
                  <View className="mb-2 w-full flex-row items-center justify-between">
                    <View className="w-full">
                      <Text className="text-center text-[30px] font-extrabold text-white">
                        {detail.title}
                      </Text>
                    </View>
                    {owner && (
                      <Pressable onPress={() => setModalVisible(true)}>
                        <Entypo name="dots-three-horizontal" size={24} color="white" />
                      </Pressable>
                    )}
                    <Modal
                      animationType="slide"
                      transparent={true}
                      visible={modalVisible}
                      onRequestClose={() => setModalVisible(false)}>
                      <View className="flex-1 items-center justify-center bg-black bg-opacity-25">
                        <View className="w-[300px] rounded-lg bg-[#121212] p-4">
                          <Text className="text-white">Edit Post</Text>
                          <Pressable
                            onPress={() => {
                              setModalVisible(false);
                              Alert.alert('Post edited!');
                            }}>
                            <Text className="text-green-700">Edit</Text>
                          </Pressable>
                          <Pressable
                            onPress={async () => {
                              setModalVisible(false);
                              await deletePost();
                              Alert.alert('Post deleted!');
                              navigation.goBack(); // Optional: go back after deletion
                            }}>
                            <Text className="text-red-700">Delete</Text>
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setModalVisible(false);
                            }}>
                            <Text className="text-yellow-700">Close</Text>
                          </Pressable>
                        </View>
                      </View>
                    </Modal>
                  </View>
                  <Text className="font-bold text-gray-400">
                    Posted By: {detail.author?.username} at {formattedDate}
                  </Text>
                  <Text className="text-center text-[15px] text-white">Event Location: {detail.location}</Text>
                  <Text className="p-7 pt-5 text-center text-[20px] text-white">{detail.desc}</Text>
                  {detail.image_uri && (
                    <Image
                      source={{ uri: detail.image_uri }}
                      resizeMode="contain"
                      className="mt-4 h-[400px] w-[400px] rounded-xl"
                    />
                  )}
                </View>
              );
            })}
          </View>
          <View className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-10">
            <Pressable onPress={toggleLike}>
              {isLiked ? (
                <AntDesign name="like1" size={40} color="white" />
              ) : (
                <AntDesign name="like2" size={40} color="white" />
              )}
            </Pressable>
            <Text className="p-5 text-[20px] font-bold text-white">Comments:</Text>
            {details.map((detail) => {
              return detail.comments?.map((comment, index) => (
                <View key={index} className="mb-2 w-full flex-row items-center justify-between">
                  <Text className="text-gray-400">{comment.comment}</Text>
                  <Text className="text-gray-400">By: {comment.username}</Text>
                </View>
              ));
            })}
          </View>
          <View className="flex-col items-center justify-between bg-[#121212] px-4 py-2 pt-10">
            <TextInput
              className="h-[150px] w-full rounded-lg bg-gray-700 p-2 text-white"
              placeholder="Write a comment..."
              placeholderTextColor="#888"
              value={comment}
              onChangeText={setComment}
            />
            <Pressable
              onPress={submitComment}
              className="mt-2 h-[50px] w-full items-center justify-center rounded-lg bg-green-700">
              <Ionicons name="send" size={24} color="white" />
            </Pressable>
          </View>
        </ScrollView>
      </View>
    </>
  );
}
