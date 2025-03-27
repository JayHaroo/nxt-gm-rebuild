import Landing from 'components/Landing';
import { StatusBar } from 'expo-status-bar';

import './global.css';

export default function App() {
  return (
    <>
      <Landing />
      <StatusBar style="auto" />
    </>
  );
}
