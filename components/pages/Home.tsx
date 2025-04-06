import { View, Text, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function Home() {
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  }

  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <Text className="text-white">Welcome to the Home Screen!</Text>
      <Pressable onPress={goBack} className="mt-4 bg-blue-500 p-2 rounded">
        <Text className="text-white">Go Back</Text>
      </Pressable>
    </View>
  );
}