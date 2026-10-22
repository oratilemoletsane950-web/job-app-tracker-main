
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button'
import { Text } from '@/components/ui/text'
import { useRouter } from 'expo-router';


export default function HomeScreen() {

  const router = useRouter()

  return (
    <ThemedView >

      <Button onPress={() => router.push('/signin')}> 
        <Text>
          Sign in
        </Text>
      </Button>

      <Button onPress={() => router.push('/signup')}> 
        <Text>
          Sign up
        </Text>
      </Button>

    </ThemedView>
  );
}

