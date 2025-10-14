import { View, Text, Pressable, FlatList, Dimensions } from 'react-native';
import React, { useRef, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { BlurView } from 'expo-blur';
import NumberPicker from '@/components/NumberPicker';

const Rating = () => {
    const { rating: initialRating} = useLocalSearchParams<{ rating: string }>();
    const [rating, setRating] = useState<number>(Number(initialRating ?? 1));
    
      const handleClose = () => {
    // Pass the updated rating back via router.replace to [id].tsx
    router.replace({
      pathname: "../",
      params: { rating: rating.toString() }
    });
  };


    return (
        <View className="flex-1 justify-center items-center">
            {/* Background overlay that dismisses on press */}
            <Pressable
                className="absolute inset-0"
                onPress={() => router.push('../')}
            >
                <BlurView className="flex-1" intensity={2} tint="light" />
            </Pressable>

            {/* Foreground modal content (non-click-through) */}
            <View className="bg-[#020212] w-3/4 h-1/3 justify-center items-center rounded-2xl">
                <View className='flex flex-row justify-center items-center gap-10'>
                    <Text className="text-white text-3xl font-semibold">Rating</Text>

                    <NumberPicker selected={rating} setSelected={setRating} />
                </View>


            </View>
        </View>
    );
};

export default Rating;
