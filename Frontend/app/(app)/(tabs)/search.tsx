import { View, Text, Image, FlatList, ActivityIndicator, TextInput, TouchableOpacity } from 'react-native'
import React, { useCallback, useEffect, useRef, useState } from 'react'
import { images } from '@/constants/images'
import MovieCard from '@/components/MovieCard'
import { useFocusEffect, useRouter } from 'expo-router'
import { fetchMovieAutofill, fetchMovies } from '@/services/api'
import useFetch from '@/services/useFetch'
import { icons } from '@/constants/icons'
import SearchBar from '@/components/SearchBar'
import { useSession } from '@/services/Auth'
import { LinearGradient } from 'expo-linear-gradient'
import SearchBarSuggestion from '@/components/SearchBarSuggestion'
import { searchForUsers } from '@/services/supabase'

const Search = () => {
  const router = useRouter();
  const { session } = useSession()
  const token = session?.access_token ?? null

  const [searchQuery, setSearchQuery] = useState("");
  const searchBarRef = useRef<TextInput>(null);

  const { data: movies, loading, error, refetch: loadMovies, reset: resetMovies } = useFetch(() => fetchMovies({ query: searchQuery }, token), false);
  const { data: autoCompleteMovies, error: autoCompleteError, refetch: loadAutoComplete, reset: resetAutoComplete } = useFetch(() => fetchMovieAutofill(searchQuery, 5, token), false)
  const { data: autoCompleteUsers, error: autoCompleteUsersError, refetch: loadAutoCompleteUsers, reset: resetAutoCompleteUsers } = useFetch(() => searchForUsers(searchQuery), false)

  // auto focus when tab switch to search
  useFocusEffect(
    useCallback(() => {
      const timer = setTimeout(() => {
        searchBarRef.current?.focus();
      }, 100);

      return () => clearTimeout(timer);
    }, [])
  );

  // auto serach whenever query changes
  useEffect(() => {
    const timeoutId = setTimeout(async () => {
      if (searchQuery.trim()) {
        await loadMovies();
        await loadAutoComplete();
        await loadAutoCompleteUsers();
      }
      else {
        resetMovies();
        resetAutoComplete();
        resetAutoCompleteUsers();
      }
    }, 500);

    return () => clearTimeout(timeoutId);

  }, [searchQuery])

  return (
    <View className='flex-1 bg-[#020212]'>
      <View className="absolute inset-0 z-0">
        <Image
          source={images.bg}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />

        {/* Stronger, visible fade */}
        <LinearGradient
          colors={['transparent', 'rgba(2,2,18,0.6)', '#020212']}
          locations={[0, 0.1, 1]}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            zIndex: 10,
          }}
        />
      </View>

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
        className="px-5"
        contentContainerClassName='pb-36'
        ListHeaderComponent={
          <>
            <View className='w-full flex-row justify-center'>
              <Image source={icons.logo} className='w-12 h-10 mt-20 mb-5 mx-auto' />
            </View>
            <View className='my-5 flex-col w-full'>
              <SearchBar
                placeholder='Search movies...'
                value={searchQuery}
                onChangeText={(text: string) => setSearchQuery(text)}
                ref={searchBarRef}
              />
              {/* Dropdown movie label */}
              {autoCompleteMovies && autoCompleteMovies.length > 0 &&
                <View>
                  <Text className='text-purple-300 font-bold text-lg'>Movies</Text>
                </View>
              }
              {/* auto complete dropdown menu */}
              <FlatList
                data={autoCompleteMovies}
                keyExtractor={(item) => item.id.toString()}
                ItemSeparatorComponent={() => <View className=''></View>}

                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { setSearchQuery(item.title.toString()) }}
                    className='bg-transparent font-medium'
                  ><SearchBarSuggestion title={item.title.toString()} />
                  </TouchableOpacity>
                )}
              >
              </FlatList>
              {autoCompleteUsers && autoCompleteUsers.length > 0 &&
                <View>
                  <Text className='text-purple-300 font-bold text-lg'>Users</Text>
                </View>
              }
              <FlatList
                data={autoCompleteUsers?.filter(user => user.id !== session?.user.id)} // exclude self
                keyExtractor={(item) => item.id}
                ItemSeparatorComponent={() => <View className=''></View>}

                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => { router.push(`/profiles/${item.id}`) }}
                    className='bg-transparent font-medium'
                  ><SearchBarSuggestion title={item.username} />
                  </TouchableOpacity>
                )}
              >
              </FlatList>

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