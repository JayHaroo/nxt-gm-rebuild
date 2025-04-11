import { View, Text, Pressable, TextInput, Image, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useState, useEffect } from 'react';

export default function Post() {
  const navigation = useNavigation();
  return (
    <>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Post</Text>
        <Pressable onPress={() => navigation.navigate('Create')}>
          <Text>Create New Post</Text>
        </Pressable>
      </View>
    </>
  );
}