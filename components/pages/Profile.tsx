import { View, Text, Pressable, Image, ScrollView } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import AntDesign from '@expo/vector-icons/AntDesign';
import Entypo from '@expo/vector-icons/Entypo';

export default function Profile() {
  const route = useRoute();
  const userid = route.params?.userid ?? 'User';
  const navigation = useNavigation();
  const goBack = () => {
    navigation.goBack();
  };
  return (
    <View className='h-full items-center bg-[#121212] px-4 py-2 pt-10'>
      <View className="items-center justify-between bg-[#121212]">
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

        <View className='items-center justify-between bg-[#121212] mt-5'>
            <Text className="text-xl font-bold text-white">Profile</Text>
            <Text className="text-lg font-bold text-white">User ID: {userid}</Text>
        </View>
      </View>
    </View>
  );
}
