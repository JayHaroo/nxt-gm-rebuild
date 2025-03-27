import { View, Text, TextInput, Pressable } from 'react-native';

export default function Login() {
  return (
    <View className="mt-5 items-center">
      <Text className="mb-5 text-xl font-bold">Welcome!</Text>

      <TextInput
        placeholder="Email"
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3 outline-none"
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        secureTextEntry
        className="mb-3 w-[250px] rounded-xl border-2 border-black p-3 outline-none"
      />
      <Pressable
        className="w-[200px] items-center rounded-xl bg-green-700" // Trigger FetchAccount display
      >
        <Text className="p-3 text-white">Login</Text>
      </Pressable>
    </View>
  );
}
