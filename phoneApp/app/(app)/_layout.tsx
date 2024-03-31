import { Slot, Stack, useRouter } from 'expo-router';

import { AuthTRPCProvider, TRPCProvider, api } from '../../util/trpc';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { Dimensions, Pressable, Text, View } from 'react-native';
import { useFocusNotifyOnChangeProps } from '../../util/stopRerender';

enum StateOfAuth {
  AUTHORIZED = 0,
  NOT_AUTHORIZED = 1,
  NO_TOKEN = 3,
  WAITING = 4,
}

export default function AppLayout() {
  return (
    <TRPCProvider>
      <Slot />
    </TRPCProvider>
  );
}
