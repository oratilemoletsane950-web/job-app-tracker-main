import { DarkTheme, DefaultTheme, Slot, ThemeProvider } from 'expo-router';
import { useColorScheme, View } from 'react-native';


import { PortalHost } from '@rn-primitives/portal';
import '../../global.css';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AuthProvider } from '@/services/auth-context';

function RootLayoutNav() {

  return (
    <SafeAreaView>
      <View>
        <Slot />
      </View>
    </SafeAreaView>
  )
}

// export default function TabLayout() {
//   const colorScheme = useColorScheme();
//   return (
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <RootLayoutNav />
//       <PortalHost />
//     </ThemeProvider>
//   );
// }

export default function RootLayout() {
  return (
  <SafeAreaProvider>
    <AuthProvider>
      <RootLayoutNav />
      <PortalHost />
    </AuthProvider>
  </SafeAreaProvider>)
}

