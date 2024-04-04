import { StripeProvider } from '@stripe/stripe-react-native';
import { Slot, Stack } from 'expo-router';

import { SplashScreen } from "expo-router";

//SplashScreen.preventAutoHideAsync();

export default function BuyLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: '#202020' } }} />
  );
}
