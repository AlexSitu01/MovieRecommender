import { SplashScreen } from 'expo-router';
import { useSession } from './Auth';


export function SplashScreenController() {
  const { isLoading } = useSession();

  if (!isLoading) {
    SplashScreen.hideAsync();
  }

  return null;
}
