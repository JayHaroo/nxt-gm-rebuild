import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert } from 'react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Change 'localhost' to your machine's IP
  const SERVER_URL = 'http://192.168.56.1:3000/api/login'; // Replace with your local IP

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter email and password');
      return;
    }

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log('Response:', data);

      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Login Failed', data.message);
      }
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Could not connect to the server');
    }
  };

  return (
    <View className="mt-5 items-center">
      <Text className="mb-5 text-xl font-bold">Welcome!</Text>

      <TextInput
        placeholder="Email"
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
        value={password}
        onChangeText={setPassword}
      />
      <Pressable
        className="w-[200px] items-center rounded-xl bg-green-700"
        onPress={handleLogin}
      >
        <Text className="p-3 text-white">Login</Text>
      </Pressable>
    </View>
  );
}
