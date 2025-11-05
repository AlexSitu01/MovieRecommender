import { fetchMovieAutofill } from '@/services/api';
import { useSession } from '@/services/Auth';
import useFetch from '@/services/useFetch';
import { Link, useLocalSearchParams } from 'expo-router';
import { Text, View, Image, TouchableOpacity } from 'react-native';



export default function Profiles() {
  const { signOut, session } = useSession();
  const { id } = useLocalSearchParams();

  return (

    <View className='flex-1 justify-start p-6 bg-[#020212] gap-y-2 w-full h-full pt-safe-offset-8'>
      {/* Profile Pic and Username*/}
      <View className='flex-row items-center justify-start gap-x-5 w-full'>
        <Image className='w-20 h-20 rounded-full' source={{ uri: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/animals-lizard-redheadedagamapair.jpg' }} />
        <Text className='text-white font-bold text-2xl w-full flex items-center justify-center'></Text>
      </View>

      {/* Description */}
      <Text className='text-white'>
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit laborum aliquid eum qui deleniti corrupti ipsam inventore temporibus nihil asperiores unde maxime odit, perferendis voluptate? Laudantium odio soluta ex ducimus.
      </Text>
      <View>

      </View>


    </View >
  );
}
