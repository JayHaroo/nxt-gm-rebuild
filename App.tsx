import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar, statusBar } from 'expo-status-bar';
import './global.css';

import Home from 'components/pages/Home';
import Landing from 'components/Landing';
import Create from 'components/pages/Create';
import Post from 'components/pages/post';
import Profile from 'components/pages/Profile';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        <Stack.Screen name="Landing" component={Landing} />
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Create" component={Create} />
        <Stack.Screen name="Post" component={Post} />
        <Stack.Screen name="Profile" component={Profile} />
      </Stack.Navigator>
      <StatusBar style="auto" />
    </>
  );
}

export default function App() {
  return (
    <>
      <NavigationContainer>
        <RootStack />
      </NavigationContainer>
    </>
  );
}
