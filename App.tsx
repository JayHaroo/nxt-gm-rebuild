import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import './global.css';

import Home from 'components/pages/Home';
import Landing from 'components/Landing';

const Stack = createNativeStackNavigator();

function RootStack() {
  return (
    <Stack.Navigator 
      screenOptions={{
        headerShown: false
      }}>
      <Stack.Screen name="Landing" component={Landing} />
      <Stack.Screen name="Home" component={Home} />
    </Stack.Navigator>
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
