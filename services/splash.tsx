import { SplashScreen } from 'expo-router';
import { useSession } from './Auth';
import { ActivityIndicator } from 'react-native';


export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }
  

  return (
    null
  );
}
