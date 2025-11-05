import EditProfileModal from '@/components/EditProfileModal';
import MovieCard from '@/components/MovieCard';
import { fetchMovieAutofill, fetchMovieDetails } from '@/services/api';
import { useSession } from '@/services/Auth';
import { getCurrentUser, getProfile, getTopMovies } from '@/services/supabase';
import useFetch from '@/services/useFetch';
import { useWatchHistory } from '@/services/useWatchHistory';
import { useFocusEffect } from '@react-navigation/native';
import { Link } from 'expo-router';
import { use, useCallback, useEffect, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, ScrollView, AppState } from 'react-native';



export default function Profile() {
  const { signOut, session } = useSession();

  const { movieHistory } = useWatchHistory()
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.6;
  const { data: profile, error: profileError, loading: profileLoading, refetch: reloadProfile } = useFetch(() => getProfile());
  const [editProfileVisible, setEditProfileVisible] = useState<boolean>(false);


  const { data: topMovies, refetch: refetchTopMovies } = useFetch(async () => {
    const topMovieIDs = await getTopMovies();
    const topMoviesData = await Promise.all(
      topMovieIDs.map(async (movie) => {
        const movieDetails = await fetchMovieDetails(movie.movie_id as string);
        return movieDetails;
      })
    );
    return topMoviesData;
  });

  useFocusEffect(
    useCallback(() => {
      if (session) {
        refetchTopMovies();
      }
    }, [session, refetchTopMovies])
  );

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

  const topMoviesMapped: Movie[] = topMovies?.map(mapMovieDetailsToMovie) ?? [];

  return (
    <ScrollView
      className='flex-1 bg-[#020212] pt-safe-offset-8'
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        justifyContent: 'flex-start',
        padding: 24,
        width: '100%',
      }}
    >
      {/* Profile Pic and Username*/}
      {profileLoading ? (
        <ActivityIndicator size='large' color='#0000ff' className="mt-10 self-center" />
      ) : (
        <View className='flex-col gap-y-6 pb-32'>
          <View className='flex-row items-center justify-start gap-x-8 w-full'>
            <Image className='w-14 h-14 rounded-full ' source={{ uri: profile?.avatar_url }} />
            <Text className='text-white font-bold text-2xl w-full flex items-center justify-center'>{profile?.username}</Text>
          </View>

          {/* Edit Profile Button */}
          <TouchableOpacity className='bg-gray-800 rounded-lg flex-col items-center p-2 w-32' onPress={() => setEditProfileVisible(true)}>
            <Text className='text-gray-300 text-lg font-semibold'>Edit Profile</Text>
          </TouchableOpacity>

          {/* Description */}
          <Text className='text-white text-xl font-semibold'>Rating System </Text>
          <Text className='text-white pl-4'>
            {profile?.bio || "No rating system set."}
          </Text>

          {topMoviesMapped.length > 0 && (
            <View>
              <Text className="text-lg text-white font-bold mt-5 mb-3">Top Movies</Text>
              <FlatList
                data={topMoviesMapped}
                renderItem={({ item }) => (
                  <MovieCard {...item} cardWidth={CARD_WIDTH} />
                )}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={CARD_WIDTH + 27}
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
              if (session) {
                signOut();
              } else {
                throw new Error("Log out without logging in error.")
              }
            }}>
            <View className='h-10 bg-blue-500 flex items-center justify-center rounded-xl w-full mt-20'>
              <Text className='text-white text-md'>Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      )}
      <EditProfileModal visible={editProfileVisible} setVisible={setEditProfileVisible} userName={profile?.username} bio={profile?.bio} reloadProfile={reloadProfile} avatar_url={profile?.avatar_url}></EditProfileModal>
    </ScrollView>
  );

}
