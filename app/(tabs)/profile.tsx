import { useSession } from '@/services/Auth';
import { Text, View } from 'react-native';



export default function Index() {
  const { signOut } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` redirects to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
