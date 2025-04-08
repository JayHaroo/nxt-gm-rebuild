import { View, Text, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Create() {
  const navigation = useNavigation();
  const goBack = () => navigation.goBack();
  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Text className="text-white">Create Post</Text>
      <Pressable onPress={goBack} className="mr-2 items-center rounded bg-green-700">
        <Text className="p-3 text-white">Go Back</Text>
      </Pressable>
    </View>
  );
}
