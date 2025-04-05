import { View, TextInput, Text, Pressable } from "react-native";

export default function Register() {
    return (
        <View className="mt-5 items-center">
            <Text className="mb-5 text-xl font-bold">Join our Community!</Text>

            <TextInput
                placeholder="Email"
                className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
                keyboardType="email-address"
                autoCapitalize="none"
            />
            <TextInput
                placeholder="Password"
                secureTextEntry
                className="mb-3 w-[250px] rounded-xl border-2 border-black p-3"
            />

            <Pressable className="w-[200px] items-center rounded-xl bg-green-700">
                <Text className="p-3 text-white">Register</Text>
            </Pressable>
        </View>
    )
}