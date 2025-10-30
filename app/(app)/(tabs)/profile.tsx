import MovieCard from '@/components/MovieCard';
import { fetchMovieAutofill, fetchMovieDetails } from '@/services/api';
import { useSession } from '@/services/Auth';
import { getCurrentUser, getProfile, getTopMovies } from '@/services/supabase';
import useFetch from '@/services/useFetch';
import { Link } from 'expo-router';
import { useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator } from 'react-native';



export default function Index() {
    const { signOut, session } = useSession();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [topMovies, setTopMovies] = useState<MovieDetails[]>([]);
    const { width } = Dimensions.get("window");
    const CARD_WIDTH = width * 0.6;


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

    useEffect(() => {
        const loadProfile = async () => {
            const userProfile = await getProfile();
            setProfile(userProfile);
        }

        const loadTopMovies = async () => {
            const topMovieIDs = await getTopMovies();
            // Fetch movie details for each top movie ID
            const topMoviesData = await Promise.all(
                topMovieIDs.map(async (movie) => {
                    const movieDetails = await fetchMovieDetails(movie.movie_id as string);
                    return movieDetails;
                })
            );
            // Set the fetched top movies data to state
            setTopMovies(topMoviesData);
        }
    
        if (session) {
            loadProfile();
            loadTopMovies()
        }
    }, [session])

    const topMoviesMapped: Movie[] = topMovies.map(mapMovieDetailsToMovie);

    return (

        <View className='flex-1 justify-start p-6 bg-[#020212] gap-y-6 w-full h-full pt-safe-offset-8'>
            {/* Profile Pic and Username*/}
            <View className='flex-row items-center justify-start gap-x-5 w-full'>
                <Image className='w-20 h-20 rounded-full' source={{ uri: 'https://animals.sandiegozoo.org/sites/default/files/inline-images/animals-lizard-redheadedagamapair.jpg' }} />
                <Text className='text-white font-bold text-2xl w-full flex items-center justify-center'>{profile?.username}</Text>
            </View>

            {/* Description */}
            <Text className='text-white text-xl font-semibold'>Rating System </Text>
            <Text className='text-white pl-4'>
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Sit laborum aliquid eum qui deleniti corrupti ipsam inventore temporibus nihil asperiores unde maxime odit, perferendis voluptate? Laudantium odio soluta ex ducimus.
            </Text>


            {topMoviesMapped.length > 0 &&
                (<View>
                    <Text className="text-lg text-white font-bold mt-5 mb-3">Top Movies</Text>

                    <FlatList
                        data={topMoviesMapped}
                        renderItem={({ item }) => (
                            <MovieCard {...item} cardWidth={CARD_WIDTH} />
                        )}
                        keyExtractor={(item) => item.id.toString()}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={CARD_WIDTH + 27} // card width + separator spacing
                        decelerationRate="fast"
                        contentContainerStyle={{
                            paddingHorizontal: 16,
                        }}
                        ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                        className="mb-4 mt-3"
                    />
                </View>
                )}



            {/* Sign out button */}

            <TouchableOpacity className='flex-row w-full text-white'
                onPress={() => {
                    // The `app/(app)/_layout.tsx` redirects to the sign-in screen.
                    if (session) {
                        signOut();
                    }
                    else {
                        throw new Error("Log out without loggin in error.")
                    }
                }}>
                <View className='h-10 bg-blue-500 flex items-center justify-center rounded-xl w-full mt-20'>
                    <Text className='text-white text-md'>Sign Out</Text>
                </View>
            </TouchableOpacity>

            {/* <Link href='/sign-in'><Text className='text-white'>Go to sign up page</Text></Link> */}

        </View >
    );
}
