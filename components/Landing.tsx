import { View, Text, Image, Pressable } from 'react-native';
import BottomSheet from './elements/BottomSheet';
import { useState } from 'react';
import Login from './elements/Login';
import Register from './elements/Register';

export default function Landing() {
  const [visible, setVisible] = useState(false);
  const [LoginPage, setLoginPage] = useState(false);
  const [RegisterPage, setRegisterPage] = useState(false);

  const openLogin = () => {
    setVisible(true);
    setLoginPage(true);
    setRegisterPage(false);
  };

  const openRegister = () => {
    setVisible(true);
    setLoginPage(false);
    setRegisterPage(true);
  };

  const closeBottomSheet = () => {
    setVisible(false);
    setLoginPage(false);
    setRegisterPage(false);
  };

  return (
    <View className="flex-1 items-center justify-center bg-[#121212]">
      <View className="top-[-90px] p-[110px]">
        <Image source={require('../assets/logo-with-text.png')} className="object-contain" />
      </View>

      <View className="flex items-center">
        <Pressable
          className="mt-5 w-[160px] items-center rounded-xl bg-green-700"
          onPress={openLogin}
        >
          <Text className="p-3 text-white">Login</Text>
        </Pressable>

        <View className="mb-5 items-center">
          <Text className="top-3 z-10 w-[30px] bg-[#121212] text-center text-white">OR</Text>
          <View className="z-0 w-[200px] border border-white" />
        </View>

        <Pressable onPress={openRegister}>
          <Text className="text-white">Join the community</Text>
        </Pressable>
      </View>

      {visible && (
        <BottomSheet visible={visible} onClose={closeBottomSheet}>
          <View className="items-center">
            <View className="mb-3 w-[100px] border-2 border-gray-400" />
            {LoginPage && <Login />}
            {RegisterPage && <Register />}
          </View>
        </BottomSheet>
      )}
    </View>
  );
}
