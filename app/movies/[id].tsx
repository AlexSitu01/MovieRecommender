import { View, Text, ScrollView, Touchable, TouchableOpacity, Pressable } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovieDetails } from '@/services/api'
import { icons } from '@/constants/icons'
import { updateMovieStatus } from '@/services/supabase'
import { useWatchHistory } from '@/services/useWatchHistory'
import Dropdown, { OptionItem } from '@/components/DropDown'



export enum movie_status {
  Bookmarked = 'Bookmarked',
  Completed = "Completed",
  Dropped = 'Dropped',
  Remove = 'Removed'
}

interface MovieInfoProps {
  lable: string;
  value?: string | number | null;
}

const MovieInfo = ({ lable, value }: MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-gray-400 font-normal text-sm'>{lable}</Text>
    <Text className='text-gray-200 font-bold text-sm'>{value || 'N/A'}</Text>
  </View>
)

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string), true);
  const { addMovie, removeMovie, updateMovieStatusContext, getStatus, movieHistory, loading: contextLoading } = useWatchHistory()
  const [movieStatus, setMovieStatus] = useState<movie_status | null>(null)

  useEffect(() => {
    if (!id || !movieHistory) return; // wait until both are defined
    const status = getStatus(id as string);
    setMovieStatus(status);
  }, [id, movieHistory]);

  const handleStatusChange = async (item: OptionItem) => {
    const exists = movieHistory.some(m => m.movie_id === id);
    if (!exists) {
      addMovie(id as string, item.value as movie_status)
    }
    else {
      updateMovieStatusContext(id as string, item.value as movie_status)
    }

    try {
      // Update Supabase
      await updateMovieStatus(id as string, item.value as movie_status);
      console.log("Updated movie status in Supabase:", item.value as movie_status);
    } catch (err) {
      console.error("Failed to update movie status:", err);
    }
  }

  return (
    <View className='flex-1 bg-[#020212]'>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{
        paddingBottom: 80,
        zIndex: 0
      }}>
        <View className='flex-1'>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className='w-full h-[550px]' resizeMode='stretch'></Image>
        </View>
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
          <View className='flex-row items-center gap-x-4 mt-2'>
            <Text className='text-gray-400 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-gray-400 text-sm'>{movie?.runtime}m</Text>
          </View>
          <View className='flex flex-row items-center justify-between w-full'>
            <View className='flex-row bg-gray-800 mt-2 p-2 rounded-md gap-x-2'>
              <View className='flex-row items-center '>
                <Image source={icons.star} className='size-4' />
                <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}</Text>
              </View>
              <View className='flex-row items-center'>
                <Text className='text-gray-400'>({movie?.vote_count} votes)</Text>
              </View>
            </View>
            <View className='w-1/3 h-30 z-10' >
              {/* <TouchableOpacity onPress={() => {
                bookmarkMovie(id as string)
                toggleBookmark()
              }
              } className='bg-blue-500 px-4 py-2 rounded-md'>
                {hasWatched(movie?.id.toString() ?? "") ? <Image source={icons.checkmark} className='size-6' /> : <Image source={icons.save} className='size-6' />}

              </TouchableOpacity> */}
              <Dropdown placeholder={movieStatus ?? 'Add to List'}
                data={[{
                  label: 'Bookmarked',
                  value: movie_status.Bookmarked
                },
                {
                  label: 'Completed',
                  value: movie_status.Completed
                },
                {
                  label: 'Dropped',
                  value: movie_status.Dropped
                },]}
                onChange={handleStatusChange}
              />
            </View>

          </View>

          <MovieInfo lable='Overview' value={movie?.overview} />

          <MovieInfo lable='Generes' value={movie?.genres?.map((g) => g.name).join(' - ') || 'N/A'} />

          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo lable='Budget' value={movie && movie.budget != null ? `$${movie.budget / 1_000_000} millions` : 'N/A'} />
            <MovieInfo lable='Revenue' value={`$${(Math.round(movie?.revenue ?? 0) / 1_000_000).toFixed(2)} million`} />
          </View>

          <MovieInfo lable='Production Companies' value={movie?.production_companies.map((c) => c.name).join(' - ') || 'N/A'} />
        </View>

      </ScrollView>

      <TouchableOpacity onPress={router.back} className='absolute bottom-5 left-0 right-0 mx-5 bg-purple-400 py-3.5 flex flex-row items-center z-50 justify-center rounded-lg'>
        <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor='#fff'></Image>
        <Text className='text-white font-semibold text-base'>Go Back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails