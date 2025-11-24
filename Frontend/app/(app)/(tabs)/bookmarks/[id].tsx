import MovieCard from '@/components/MovieCard'
import { fetchMovieDetails } from '@/services/api'
import { useWatchHistory } from '@/services/useWatchHistory'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, Dimensions, FlatList, ScrollView, Text, View } from 'react-native'
import { movie_status } from '../../movies/[id]'
import { useSession } from '@/services/Auth'
import { Image } from 'expo-image'
import { LinearGradient } from 'expo-linear-gradient'
import { images } from '@/constants/images'
import useFetch from '@/services/useFetch'
import { getHistory } from '@/services/supabase'
import { useLocalSearchParams } from 'expo-router'
import { useIsFocused } from '@react-navigation/native';



interface MoiveDetailsWithStauts extends MovieDetails {
    movie_status: movie_status;
    user_rating?: number | null;
}

interface MovieWithStatus extends Movie {
    movie_status: movie_status;
    user_rating?: number | null;
}

function mapMovieDetailsWithStatusToMovie(item: MoiveDetailsWithStauts): MovieWithStatus {
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
        movie_status: item.movie_status,
        user_rating: item?.user_rating
    };
}

const Bookmarks = () => {
    const params = useLocalSearchParams()
    const isFocused = useIsFocused();
    const id = useMemo(() => params?.id?.toString(), [params?.id])
    const { session } = useSession()
    const token = session?.access_token ?? null

    const [moviesDetails, setMoviesDetails] = useState<MoiveDetailsWithStauts[]>([])
    const fetchHistory = useCallback(() => {
        return getHistory(id as string)
    }, [id])
    const { data: movieHistory, loading: loadingMovies, error } = useFetch(fetchHistory)

    const screenWidth = Dimensions.get("window").width;
    const horizontalPadding = 40; // mx-5 = 20px on each side
    const gap = 20;
    const numColumns = 3;
    const cardWidth = (screenWidth - horizontalPadding - (gap * (numColumns - 1))) / numColumns;



   useEffect(() => {
    if (!isFocused || !movieHistory?.length || !token) return;

    let cancelled = false;

    const getMovieDetails = async () => {
        const movieDetails = await Promise.all(
            movieHistory.map(async (movie) => {
                const details = await fetchMovieDetails(movie.movie_id as string, token);

                return {
                    ...details,
                    movie_status: movie.movie_status as movie_status,
                    user_rating: movie.user_rating,
                } as MoiveDetailsWithStauts;
            })
        );

        if (!cancelled) {
            setMoviesDetails(movieDetails);
        }
    };

    getMovieDetails();

    return () => {
        cancelled = true;
    };
}, [isFocused, movieHistory, token]);



    const movies: MovieWithStatus[] = (moviesDetails ?? []).map(mapMovieDetailsWithStatusToMovie);
    const bookmarkedMovies: MovieWithStatus[] = movies.filter(movie => movie.movie_status == movie_status.Bookmarked).sort((a, b) => a.title.localeCompare(b.title));
    const completedMovies: MovieWithStatus[] = movies.filter(movie => movie.movie_status == movie_status.Completed).sort((a, b) => (b.user_rating ?? -1) - (a.user_rating ?? -1) || a.title.localeCompare(b.title));
    const droppedMovies: MovieWithStatus[] = movies.filter(movie => movie.movie_status == movie_status.Dropped).sort((a, b) => (b.user_rating ?? -1) - (a.user_rating ?? -1) || a.title.localeCompare(b.title));


    return (
        <View className='bg-[#020212] flex h-full w-full items-center pt-safe-offset-1'>
            <View className="absolute inset-0 z-0">
                <Image
                    source={images.bg}
                    style={{ width: '100%', height: '100%' }}
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
            {/* Shows text if no movies have been bookmarked */}
            {movies.length == 0 && !loadingMovies && <Text className='text-[#888888] mt-40'>No saved movies yet.</Text>}
            {loadingMovies && <ActivityIndicator size="large" color="#0000ff" className='my-3' />}

            <ScrollView className="flex-1 w-full px-3" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }} showsHorizontalScrollIndicator={false} >
                {
                    bookmarkedMovies?.length > 0 && !loadingMovies &&
                    (<View className={`flex ${completedMovies.length == 0 && droppedMovies.length == 0 && "pb-32"}`}>
                        <FlatList data={bookmarkedMovies}

                            renderItem={({ item }) => (<MovieCard {...item} cardWidth={cardWidth} ></MovieCard>)}
                            keyExtractor={(item) => `bookmarked2-${item.id}`}
                            numColumns={3}
                            columnWrapperStyle={{
                                justifyContent: 'flex-start',
                                marginBottom: 10,
                                gap: 20,
                                width: '100%'
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
                            renderItem={({ item }) => (<MovieCard {...item} cardWidth={cardWidth} rating={item.user_rating}></MovieCard>)}
                            keyExtractor={(item) => `completed2-${item.id}`}
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
                            renderItem={({ item }) => (<MovieCard {...item} cardWidth={cardWidth} rating={item.user_rating}></MovieCard>)}
                            keyExtractor={(item) => `dropped2-${item.id}`}
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

export default Bookmarks