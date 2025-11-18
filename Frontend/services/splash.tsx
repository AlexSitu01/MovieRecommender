import { SplashScreen } from 'expo-router';
import { useSession } from './Auth';
import { useEffect, useState } from 'react';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  // In case preventAutoHideAsync throws (e.g., already prevented)
});

export function SplashScreenController() {
  const { isLoading } = useSession();
  const [appReady, setAppReady] = useState(false);

  useEffect(() => {
    if (!isLoading && !appReady) {
      setAppReady(true);
      SplashScreen.hideAsync().catch(() => {
        // Handle error if splash screen is already hidden
      });
    }
  }, [isLoading, appReady]);

  return null;
}