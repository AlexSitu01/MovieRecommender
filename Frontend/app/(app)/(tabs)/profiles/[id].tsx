import EditProfileModal from '@/components/EditProfileModal';
import MovieCard from '@/components/MovieCard';
import { images } from '@/constants/images';
import { fetchMovieDetails } from '@/services/api';
import { useSession } from '@/services/Auth';
import { getProfile, getTopMovies } from '@/services/supabase';
import useFetch from '@/services/useFetch';
import { useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { router, useLocalSearchParams } from 'expo-router';
import { useCallback, useState } from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, FlatList, ActivityIndicator, ScrollView } from 'react-native';

export default function Profiles() {
  const { session } = useSession();
  const token = session?.access_token ?? null;
  const { id } = useLocalSearchParams();
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.6;

  const [editProfileVisible, setEditProfileVisible] = useState(false);

  // Memoized fetch function for profile to prevent infinite loop
  const fetchProfile = useCallback(() => getProfile(id as string), [id]);
  const { data: profile, loading: profileLoading, refetch: reloadProfile } = useFetch(fetchProfile);

  // State for top movies
  const [topMovies, setTopMovies] = useState<MovieDetails[]>([]);
  const [loadingTopMovies, setLoadingTopMovies] = useState(false);

  // Fetch top movies only when screen is focused
  useFocusEffect(
    useCallback(() => {
      let cancelled = false;

      const fetchTopMovies = async () => {
        if (!session || !id) return;

        setLoadingTopMovies(true);
        try {
          const topMovieIDs = await getTopMovies(id as string);
          const moviesData = await Promise.all(
            topMovieIDs.map(async (movie) => {
              const details = await fetchMovieDetails(movie.movie_id as string, token);
              return details;
            })
          );
          if (!cancelled) setTopMovies(moviesData);
        } catch (err) {
          console.error(err);
        } finally {
          if (!cancelled) setLoadingTopMovies(false);
        }
      };

      fetchTopMovies();

      return () => { cancelled = true; };
    }, [session, id, token])
  );

  // Map MovieDetails to Movie for rendering
  const mapMovieDetailsToMovie = useCallback((item: MovieDetails): Movie => ({
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
  }), []);

  const topMoviesMapped: Movie[] = topMovies?.map(mapMovieDetailsToMovie) ?? [];

  return (
    <View className='flex-1 bg-[#020212]'>
      <View className="absolute inset-0 z-0">
        <Image
          source={images.bg}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <LinearGradient
          colors={['transparent', 'rgba(2,2,18,0.6)', '#020212']}
          locations={[0, 0.1, 1]}
          style={{ position: 'absolute', width: '100%', height: '100%', zIndex: 10 }}
        />
      </View>

      <ScrollView
        className='pt-safe-offset-10'
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ justifyContent: 'flex-start', padding: 24, width: '100%' }}
      >
        {/* Profile */}
        {profileLoading ? (
          <ActivityIndicator size='large' color='#0000ff' className="mt-10 self-center" />
        ) : (
          <View className='flex-col gap-y-6 pb-32'>
            <View className='flex-row items-center justify-start gap-x-8 w-full'>
              <Image className='w-14 h-14 rounded-full' source={{ uri: profile?.avatar_url }} />
              <Text className='text-white font-bold text-2xl w-full flex items-center justify-center'>
                {profile?.username}
              </Text>
            </View>

            {/* Bio / Rating system */}
            {profile?.bio && (
              <View className='flex-col'>
                <Text className='text-white text-xl font-semibold'>Rating System</Text>
                <Text className='text-white pl-4'>
                  {profile?.bio || "No rating system set."}
                </Text>
              </View>
            )}

            {/* Top Movies */}
            {loadingTopMovies ? (
              <ActivityIndicator size='large' color='#0000ff' className="mt-10 self-center" />
            ) : topMoviesMapped.length > 0 ? (
              <View>
                <Text className="text-lg text-white font-bold mt-5 mb-3">Top Movies</Text>
                <FlatList
                  data={topMoviesMapped}
                  renderItem={({ item }) => <MovieCard {...item} cardWidth={CARD_WIDTH} />}
                  keyExtractor={(item) => item.id.toString()}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  snapToInterval={CARD_WIDTH + 27}
                  decelerationRate="fast"
                  contentContainerStyle={{ paddingHorizontal: 16 }}
                  ItemSeparatorComponent={() => <View style={{ width: 20 }} />}
                  className="mb-4 mt-3"
                />
              </View>
            ) : (
              <View className='my-10'>
                <Text className='text-white font-semibold text-lg'>
                  This user doesn't have any movies favorited yet.
                </Text>
              </View>
            )}
          </View>
        )}

        <EditProfileModal
          visible={editProfileVisible}
          setVisible={setEditProfileVisible}
          userName={profile?.username}
          bio={profile?.bio}
          reloadProfile={reloadProfile}
          avatar_url={profile?.avatar_url}
        />

        <TouchableOpacity
          className='relative text-white bottom-3'
          onPress={() => router.push(`../bookmarks/${id}`)}
        >
          <View className='h-10 bg-purple-400 flex items-center justify-center rounded-xl w-full mt-20'>
            <Text className='text-white text-lg font-bold'>Go to watch list</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
