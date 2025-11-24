import { View, Text, TouchableOpacity, Image, Button, Pressable } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'
import { icons } from '@/constants/icons'
import { Ionicons } from '@expo/vector-icons'

const MovieCard = ({ id, poster_path, title, vote_average, release_date, cardWidth, rating }: Movie & { cardWidth?: number, rating?: number | null }) => {
    return (
        <Link href={`/movies/${id}`} asChild>
            <TouchableOpacity className='w-[28%] mx-1' style={cardWidth ? { width: cardWidth } : undefined}>
                <Image source={{
                    uri: poster_path ? `https://image.tmdb.org/t/p/w500${poster_path}` : 'https://placehold.co/600x400/1a1a1a/ffffff.png'

                }}
                    className='w-full h-52 rounded-lg'
                    resizeMode='cover'

                ></Image>
                <Text className='text-sm font-bold text-white mt-2' numberOfLines={1}>{title}</Text>

                <View className='flex-row items-center justify-between gap-x-1'>
                    <View className='flex-row'>
                        <Image source={icons.star} className='size-4'></Image>
                        <Text className='text-white text-xs font-bold uppercase'>{vote_average.toFixed(1)}</Text>
                    </View>
                    {   rating &&
                        (<View className='flex-row gap-x-1'>
                            <Ionicons name='film-outline' size={15} color={'white'}></Ionicons>
                            <Text className='text-white text-xs font-bold uppercase'>{rating}</Text>
                        </View>)
                    }

                </View>
                <View className='flex-row itmes-center justify-between'>
                    <Text className='text-xs text-neutral-300 font-medium mt-1'>
                        {release_date?.split('-')[0]}
                    </Text>

                    {/* In case we add tv shows later*/}
                    {/* <Text className='text-xs font-medium text-light-300 uppercase'>Movie</Text> */}
                </View>
            </TouchableOpacity>
        </Link>

    )
}

export default MovieCard