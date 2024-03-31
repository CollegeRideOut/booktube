import { StripeProvider } from '@stripe/stripe-react-native';
import { Slot, Stack } from 'expo-router';
export default function BuyLayout() {
  return (
    <StripeProvider publishableKey={process.env.EXPO_PUBLIC_STRIPE_KEY!}>
      <Stack screenOptions={{ headerShown: false, contentStyle:{backgroundColor: '#202020'} }} />
    </StripeProvider>
  );
}
