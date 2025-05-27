import { View, TextInput, Text, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { NXTGM_API } from '@env'; // Ensure you have this in your .env file

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const SERVER_URL = `${NXTGM_API}/api/register`;

  const handleRegister = async () => {
    setIsLoading(true);
    if (!username || !password) {
      Alert.alert('Error', 'Please enter email and password');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        Alert.alert('Register Failed', errorData.message || 'Invalid credentials');
        setIsLoading(false);
        return;
      }

      const data = await response.json();
      console.log('Register success:', data);
      Alert.alert('Success', data.message || 'Welcome to the community!');
      setIsLoading(false);
    } catch (error) {
      console.error('Register error:', error);
      Alert.alert('Error', 'Could not connect to the server');
      setIsLoading(false);
    }
  };

  return (
    <View className="mt-5 items-center">
      <Text className="mb-5 text-xl font-bold">Join our Community!</Text>

      <TextInput
        placeholder="Email"
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
        keyboardType="email-address"
        autoCapitalize="none"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
        value={password}
        onChangeText={setPassword}
      />
      {isLoading ? (
        <View className="w-[200px] items-center rounded-xl bg-green-700">
          <ActivityIndicator className="p-3" color="#ffffff" />
        </View>
      ) : (
        <Pressable
          className="w-[200px] items-center rounded-xl bg-green-700"
          onPress={handleRegister}>
          <Text className="p-3 text-white">Register</Text>
        </Pressable>
      )}
    </View>
  );
}
