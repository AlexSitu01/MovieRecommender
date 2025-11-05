import { View, Text, ScrollView, Touchable, TouchableOpacity, Pressable, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Image } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import useFetch from '@/services/useFetch'
import { fetchMovieDetails } from '@/services/api'
import { icons } from '@/constants/icons'
import { updateFavoritedMovieSB, updateMovieStatus } from '@/services/supabase'
import { useWatchHistory } from '@/services/useWatchHistory'
import Dropdown, { OptionItem } from '@/components/DropDown'
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry'
import { Ionicons } from '@expo/vector-icons'



export enum movie_status {
  Bookmarked = 'Bookmarked',
  Completed = "Completed",
  Dropped = 'Dropped',
  Remove = 'Removed',
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

const handleFavoritePress = (favorited: boolean, setFavorited: React.Dispatch<React.SetStateAction<boolean>>, movie_id: string, updateFavoritedMovie: (id: string, isFavorited: boolean) => void) => {

  if (!favorited) {
    // user favorites movie
    try {
      // update local movie history
      updateFavoritedMovie(movie_id, true)
      // update supabase movie db
      updateFavoritedMovieSB(movie_id, true)
    }
    catch (error) {
      Alert.alert("Error", "There was an error adding the movie to favorites.");
    }
  } else {
    // user unfavorites movie
    try {
      // update local movie history
      updateFavoritedMovie(movie_id, false)
      // update supabase movie db
      updateFavoritedMovieSB(movie_id, false)
    }
    catch (error) {
      Alert.alert("Error", "There was an error adding the movie to favorites.");
    }
  }

  setFavorited(!favorited);
}

const MovieDetails = () => {
  const { id } = useLocalSearchParams();
  const { data: movie, loading } = useFetch(() => fetchMovieDetails(id as string), true);
  const { addMovie, removeMovie, updateMovieStatusContext, getStatus, movieHistory, loading: contextLoading, getRating, isFavorited, updateFavoritedMovie } = useWatchHistory()
  const [movieStatus, setMovieStatus] = useState<movie_status | null>(null)
  const [favorited, setFavorited] = useState<boolean>(false);


  useEffect(() => {
    if (!id || !movieHistory) return; // wait until both are defined
    const status = getStatus(id as string);
    setMovieStatus(status);
    const favorite = isFavorited(id as string)
    setFavorited(favorite)
  }, [id, movieHistory]);

  const handleStatusChange = async (item: OptionItem) => {
    // update local movieHistory
    if (item.value === movie_status.Remove) {
      removeMovie(id as string);
      setMovieStatus(null);

    } else {
      const exists = movieHistory.some(m => m.movie_id === id);
      if (!exists) {
        addMovie(id as string, item.value as movie_status)
      }
      else {
        updateMovieStatusContext(id as string, item.value as movie_status)
      }
    }
    // update movie history in supabase
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
        <View className='relative'>
          <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}` }} className='w-full h-[550px] relative' resizeMode='stretch' />
          {(movieStatus == movie_status.Bookmarked || movieStatus == movie_status.Dropped || movieStatus == movie_status.Completed) && <TouchableOpacity className='absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg'
            onPress={() => handleStatusChange({ value: movie_status.Remove, label: '' } as OptionItem)} >
            <Ionicons name='trash-outline' size={24} color='black'></Ionicons>
          </TouchableOpacity>}

        </View>
        <View className='flex-col items-start justify-center mt-5 px-5'>
          <View className='flex-row items-center justify-between w-full gap-2'>

            <Text
              className='text-white font-bold text-xl'
              style={{ flex: 2 }} // Takes 2/3 of space
              numberOfLines={2}
              ellipsizeMode='tail'
            >
              {movie?.title}
            </Text>

            <View className='w-1/3 h-30 z-10 flex-shrink-0' >

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

          <View className='flex-row items-center gap-x-4 mt-2'>
            <Text className='text-gray-400 text-sm'>{movie?.release_date?.split('-')[0]}</Text>
            <Text className='text-gray-400 text-sm'>{movie?.runtime}m</Text>
          </View>
          <View className='flex flex-row items-center justify-between w-full'>
            <View className='flex-row justify-center items-center'>
              <TouchableOpacity className='flex-row bg-gray-800 mt-2 p-2 rounded-md gap-x-2' onPress={() => router.push({
                pathname: '/movies/rating',
                params: {
                  movie_id: id as string,
                  rating: getRating(id as string) ?? 1
                },

              })} disabled={contextLoading || loading || getStatus(id as string) === null || getStatus(id as string) === movie_status.Bookmarked}>
                <View className='flex-row items-center '>
                  <Image source={icons.star} className='size-4' />
                  <Text className='text-white font-bold text-sm'>{Math.round(movie?.vote_average ?? 0)}</Text>
                </View>
                <Text className='text-gray-400'>({movie?.vote_count} votes)</Text>
              </TouchableOpacity>

              {(() => {
                const rating = getRating(id as string);
                const shouldShowRating = (movieStatus === movie_status.Completed || movieStatus === movie_status.Dropped) && rating !== null;

                return shouldShowRating && (
                  <View className='flex-row items-center'>
                    <Pressable className='p-4' onPress={() => {
                      handleFavoritePress(favorited, setFavorited, id as string, updateFavoritedMovie);
                    }}>
                      {
                        favorited ?
                          <Ionicons name='star' color='white' size={20} />
                          : <Ionicons name='star-outline' color='white' size={20} />
                      }
                    </Pressable>
                  </View>
                );
              })()}


            </View>

            {(() => {
              const rating = getRating(id as string);
              const shouldShowRating = (movieStatus === movie_status.Completed || movieStatus === movie_status.Dropped) && rating !== null;

              return shouldShowRating &&
                <View className='flex flex-row gap-x-2 items-center'>
                  <Ionicons name='film-outline' color='white' size={20} ></Ionicons>
                  <Text className='text-white text-lg font-semibold'>{rating}</Text>
                </View>

            })()}

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