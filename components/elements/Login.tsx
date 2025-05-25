import { useState } from 'react';
import { View, Text, TextInput, Pressable, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const SERVER_URL = 'https://nxtgm-server.onrender.com/api/login'; // Replace with your IP

  const handleLogin = async () => {
    setIsLoading(true)
    if (!username || !password) {
      Alert.alert('Error', 'Please enter email and password');
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
        Alert.alert('Login Failed', errorData.message || 'Invalid credentials');
        setIsLoading(false)
        return;
      }

      const data = await response.json();
      console.log('Login success:', data);
      console.log('Username:', data?.username);
      console.log('userId:', data?.userId);

      Alert.alert('Success', data.message || 'Login successful');

      navigation.navigate('Home', { username: data?.username, userid: data?.userId });
      setIsLoading(false)
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Could not connect to the server');
      setIsLoading(false)
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
          <ActivityIndicator className='p-3' color="ffffff"/>
        </View>
      ) : (
        <Pressable className="w-[200px] items-center rounded-xl bg-green-700" onPress={handleLogin}>
          <Text className="p-3 text-white">Login</Text>
        </Pressable>
      )}
    </View>
  );
}
