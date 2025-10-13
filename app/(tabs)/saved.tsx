import { View, Text, ScrollView, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import useFetch from '@/services/useFetch'
import { fetchMovieDetails, fetchMoviesList } from '@/services/api'
import { useWatchHistory } from '@/services/useWatchHistory'
import { FlatList } from 'react-native'
import MovieCard from '@/components/MovieCard'
import { featureFlags } from 'react-native-screens'
import { movie_status } from '../movies/[id]'

const Saved = () => {
  const { movieHistory } = useWatchHistory()
  const [moviesDetails, setMoviesDetails] = useState<MovieDetails[]>([])
  const [loadingMovies, setLoadingMovies] = useState<boolean>(false)


  useEffect(() => {
    async function syncMovies() {
      if (!movieHistory) return;

      const historySet = new Set(movieHistory.map((movie) => movie.movie_id) as string[]);               // all current IDs
      const fetchedIds = new Set(moviesDetails.map(m => m.id.toString()));

      // IDs to add
      const newIds = movieHistory.filter(movie => !fetchedIds.has(movie.movie_id));

      if (newIds.length > 0) {
        try {
          const newMovies = await Promise.all(
            newIds.map(movie => {
              return fetchMovieDetails(movie.movie_id);
            })
          );


          setMoviesDetails(prev => [...prev, ...newMovies]);
        } catch (err) {
          console.error("Failed to fetch new movies", err);
        }
      }

      // Filter out movies removed from movieHistory
      setMoviesDetails(prev => prev.filter(m => historySet.has(m.id.toString())));
    }
    setLoadingMovies(true)
    syncMovies();
    setLoadingMovies(false)
  }, [movieHistory]);

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
  const bookmarkedIds = movieHistory
    .filter(m => m.movie_status === movie_status.Bookmarked)
    .map(m => m.movie_id);
  const completedIds = movieHistory.filter(m => m.movie_status === movie_status.Completed).map(m => m.movie_id)
  const droppedIds = movieHistory.filter(m => m.movie_status === movie_status.Dropped).map(m => m.movie_id)

  const bookmarkedMovies = movies.filter(movie => bookmarkedIds.includes(movie.id.toString()));
  const completedMovies = movies.filter(movie => completedIds.includes(movie.id.toString()))
  const droppedMovies = movies.filter(movie => droppedIds.includes(movie.id.toString()))

  return (
    <View className='bg-[#020212] flex h-full w-full items-center pt-safe-offset-1'>
      
      {loadingMovies && <ActivityIndicator size="large" color="#0000ff" className='my-3' />}

      <ScrollView className="flex-1 mx-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }}>
        {
          bookmarkedMovies?.length > 0 && !loadingMovies &&
          (<View className={`flex ${completedMovies.length == 0 && droppedMovies.length == 0 && "pb-32"}`}>
            <FlatList data={bookmarkedMovies}
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

        {
          completedMovies?.length > 0 && !loadingMovies &&
          (<View className={`flex ${droppedMovies.length == 0 && "pb-32"}`}>
            <FlatList data={completedMovies}
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
              ListHeaderComponent={<Text className='text-white text-lg font-bold'>Completed Movies</Text>}
              ListHeaderComponentStyle={{ paddingBottom: 20 }}
              scrollEnabled={false}
            />
          </View>)
        }

        {
          droppedMovies?.length > 0 && !loadingMovies &&
          (<View className='flex pb-32'>
            <FlatList data={droppedMovies}
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
              ListHeaderComponent={<Text className='text-white text-lg font-bold'>Dropped Movies</Text>}
              ListHeaderComponentStyle={{ paddingBottom: 20 }}
              scrollEnabled={false}
            />
          </View>)
        }

      </ScrollView>
    </View>
  )
}

export default Saved