import { View, Text, Image, FlatList, ActivityIndicator, TextInput } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { useFocusEffect, useRouter } from 'expo-router'
import { fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'

const Search = () => {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef<TextInput>(null);

  const { data: movies, loading, error, refetch: loadMovies, reset } = useFetch(() => fetchMovies({ query: searchQuery }), false);

  useFocusEffect(
      useCallback(() => {
        const timer = setTimeout(() => {
          searchBarRef.current?.focus();
        }, 100);

        return () => clearTimeout(timer);
      }, [])
  );


  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
      }
      else {
        reset();
      }
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [searchQuery])

  return (
    <View className='flex-1 bg-[#020212]'>
      <Image source={images.bg} className='flex-1 absolute w-full z-0' />

      <FlatList
        data={movies}
        renderItem={({ item }) => <MovieCard {...item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: 'flex-start',
          marginBottom: 10,
          gap: 20,
        }}
        className="pb-32 px-5"
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center'>
              <Image source={icons.logo} className='w-12 h-10 mt-20 mb-5 mx-auto' />
            </View>
            <View className='my-5'>
              <SearchBar
                placeholder='Search movies...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                ref={searchBarRef}
              />
            </View>

            {loading && (
              <ActivityIndicator size="large" color="#0000ff" className='my-3' />
            )}

            {error && (
              <Text className='text-red-500 px-5 my-3'>
                Error: {error.message}
              </Text>
            )}

            {!loading && !error && searchQuery.trim() && movies?.length > 0 && (
              <Text className='text-white text-xl font-bold mb-4'>
                Search Result for { }
                <Text className='text-purple-400'>{searchQuery}</Text>
              </Text>
            )}
          </>
        }
        ListEmptyComponent={
          !loading && !error ? (
            <View className='mt-10 px-5'>
              <Text className='text-gray-500 text-center'>
                {searchQuery.trim() ? 'No movies found' : 'Search for a movie'}
              </Text>
            </View>
          ) : null
        }
      />
    </View>
  )
}

export default Search