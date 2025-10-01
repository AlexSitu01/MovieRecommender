import { useSession } from '@/services/Auth';
import { Text, View, Image } from 'react-native';



export default function Index() {
  const { signOut } = useSession();
  return (

    <View className='flex-1 justify-start p-6 bg-[#020212] gap-y-2'>
      {/* Profile Pic and Username*/}
      <View className='flex-row items-center justify-start gap-x-5'>
        <Image className='w-20 h-20 rounded-full' source={{ uri: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/animals-lizard-redheadedagamapair.jpg' }} />
        <Text className='text-white font-bold text-2xl'>Alex Situ</Text>
      </View>

      {/* Description */}
      <Text className='text-white'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit laborum aliquid eum qui deleniti corrupti ipsam inventore temporibus nihil asperiores unde maxime odit, perferendis voluptate? Laudantium odio soluta ex ducimus.
      </Text>
      <View>

      </View>

      {/* Sign out button */}
      <View className='flex-row w-full'>
        <View className='h-10 bg-blue-500 flex items-center justify-center rounded-xl w-full mt-20'>
          <Text className='text-white'
            onPress={() => {
              // The `app/(app)/_layout.tsx` redirects to the sign-in screen.
              signOut();
            }}>
            Sign Out
          </Text>
        </View>
      </View>


    </View>
  );
}
