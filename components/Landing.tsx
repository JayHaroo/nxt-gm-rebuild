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
      <View className="top-[-140px] z-10 items-center justify-center p-[110px]">
        <Image source={require('../assets/logo-with-text.png')} className="object-contain" />
        <Image
          source={require('../assets/adaptive-icon.png')}
          className="h-[100] w-[100] object-contain"
        />
      </View>

      <View className="z-10 mb-[-150] flex items-center">
        <Pressable
          className="mb-2 mt-5 w-[200px] items-center rounded-xl bg-green-700"
          onPress={openLogin}>
          <Text className="p-4 text-white">Login</Text>
        </Pressable>

        <Pressable onPress={openRegister}>
          <Text className="text-white">Join the community</Text>
        </Pressable>
      </View>

      <View className="z-0 absolute top-[450]">
        <Image source={require('../assets/grad.png')} className="z-0" />
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
