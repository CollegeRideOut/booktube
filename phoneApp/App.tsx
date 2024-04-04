import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { SplashScreen } from "expo-router";
import { Slot } from 'expo-router';

//SplashScreen.preventAutoHideAsync();

export default function App() {
  return (
    <Slot />
  );
}

