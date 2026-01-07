import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: '홈' }} />
      <Stack.Screen name="chat/[id]" options={{ title: '채팅' }} />
    </Stack>
  );
}

