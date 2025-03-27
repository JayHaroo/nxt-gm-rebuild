import { View, Text, Image, Pressable } from 'react-native';

export default function Landing() {
  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <View className="top-[-200px] p-[110px]">
        <Image source={require('../assets/logo-with-text.png')} className="object-contain" />
      </View>

      <View className="flex items-center">
        <Pressable className="mt-5 w-[160px] items-center rounded-xl bg-green-700">
          <Text className="p-3 text-white">Login</Text>
        </Pressable>

        <View className='items-center mb-5'>
            <Text className="text-white z-10 bg-[#121212] top-3 w-[30px] text-center">OR</Text>
          <View className="w-[200px] border border-white z-0" />
        </View>

        <Pressable>
          <Text className="text-white">Join the community</Text>
        </Pressable>
      </View>
    </View>
  );
}
