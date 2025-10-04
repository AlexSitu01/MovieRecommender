import { View, Text, ScrollView } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetch from '@/services/useFetch'
import { fetchMovieDetails, fetchMoviesList } from '@/services/api'
import { useWatchHistory } from '@/services/useWatchHistory'
import { FlatList } from 'react-native'
import MovieCard from '@/components/MovieCard'
import { featureFlags } from 'react-native-screens'

const Saved = () => {
  const { history } = useWatchHistory()
  const [moviesDetails, setMoviesDetails] = useState<MovieDetails[]>([])
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false)

  useEffect(() => {
    async function syncMovies() {
      if (!history) return;

      const historySet = new Set(history);               // all current IDs
      const fetchedIds = new Set(moviesDetails.map(m => m.id.toString()));

      // 1️⃣ IDs to add
      const newIds = history.filter(id => !fetchedIds.has(id));

      if (newIds.length > 0) {
        try {
          const newMovies = await Promise.all(newIds.map(fetchMovieDetails));
          setMoviesDetails(prev => [...prev, ...newMovies]);
        } catch (err) {
          console.error("Failed to fetch new movies", err);
        }
      }

      // 2️⃣ Filter out movies removed from history
      setMoviesDetails(prev => prev.filter(m => historySet.has(m.id.toString())));
    }
    setLoadingMovies(true)
    syncMovies();
    setLoadingMovies(false)
  }, [history]);

  function mapMovieDetailsToMovie(item: MovieDetails): Movie {
    return {
      id: item.id,
      title: item.title,
      adult: item.adult,
      backdrop_path: item.backdrop_path ?? "",
      poster_path: item.poster_path ?? "",
      release_date: item.release_date ?? "",
      vote_average: item.vote_average,
      vote_count: item.vote_count,
      genre_ids: item.genres?.map(g => g.id) ?? [],
      original_language: item.original_language,
      original_title: item.original_title,
      overview: item.overview ?? "",
      popularity: item.popularity,
      video: item.video,
    };
  }

  const movies: Movie[] = (moviesDetails ?? []).map(mapMovieDetailsToMovie);

  return (
    <View className='bg-[#020212] flex h-full w-full items-center'>
      <ScrollView className="flex-1 mx-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }}>
        {
          moviesDetails && !loadingMovies &&
          (<View className='flex'>
            <FlatList data={movies}
              renderItem={({ item }) => (<MovieCard {...item}></MovieCard>)}
              keyExtractor={(item) => item.id.toString()}
              numColumns={3}
              columnWrapperStyle={{
                justifyContent: 'flex-start',
                marginBottom: 10,
                gap: 20,
              }}
              className='mt-5'
              showsVerticalScrollIndicator={false}
              ListHeaderComponent={<Text className='text-white text-lg font-bold'>Bookmarked Movies</Text>}
              ListHeaderComponentStyle={{ paddingBottom: 20 }}
              scrollEnabled={false}
            />
          </View>)
        }
        <FlatList data={movies}
          renderItem={({ item }) => (<MovieCard {...item}></MovieCard>)}
          keyExtractor={(item) => item.id.toString()}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: 'flex-start',
            marginBottom: 10,
            gap: 20,
          }}
          className='mt-5'
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={<Text className='text-white text-lg font-bold'>Bookmarked Movies</Text>}
          ListHeaderComponentStyle={{ paddingBottom: 20 }}
          scrollEnabled={false}
        />
      </ScrollView>
    </View>
  )
}

export default Saved