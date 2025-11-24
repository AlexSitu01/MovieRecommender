import MovieCard from "@/components/MovieCard";
import SearchBar from "@/components/SearchBar";
import SignUpModal from "@/components/SignUpModal";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";
import { fetchMovies, fetchTrendingMovies } from "@/services/api";
import { useSession } from "@/services/Auth";
import { getProfile } from "@/services/supabase";
import useFetch from "@/services/useFetch";
import { Redirect, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, Image, ScrollView, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient"


export default function Index() {

  const router = useRouter();
  const { session } = useSession();
  const token = session?.access_token ?? null
  const canFetch = !!token;

  const { data: movies, loading: moviesLoading, error: moviesError } = useFetch(() => fetchMovies({ query: "" }, token), canFetch);
  const { data: trendingMovies, loading: trendingLoading, error: trendingError } = useFetch(() => fetchTrendingMovies(token), canFetch)
  const { width } = Dimensions.get("window");
  const CARD_WIDTH = width * 0.6;
  const [userNameModalVisible, setUserNameModalVisible] = useState<boolean>(false);

  useEffect(() => {
    const checkUserName = async () => {
      if (session) {
        const profile = await getProfile();
        if (!profile?.username) {
          setUserNameModalVisible(true);
        }
      }
    }
    checkUserName();
  }, [session]);


  return (
    <View className="flex-1">
      <View className="flex-1 bg-[#020212]">
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


        <ScrollView className="flex-1 px-5" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10, minHeight: '100%' }}>
          <Image source={icons.logo} className="w-12 h-10 mt-20 mb-5 mx-auto"></Image>


          {moviesLoading || trendingLoading ? (<ActivityIndicator size='large' color='#0000ff' className="mt-10 self-center" />) : moviesError || trendingError ? (<Text>Error:{moviesError?.message}</Text>) : (
            <View className="flex-1 mt-5 w-full">
              <SearchBar
                onPress={() => router.push("/search")}
                placeholder="Search for a movie"
              />

              {trendingMovies &&
                (<View>
                  <Text className="text-lg text-white font-bold mt-5 mb-3">Trending Movies</Text>

                  <FlatList
                    data={trendingMovies}
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

              <Text className="text-lg text-white font-bold mt-5 mb-3">Latest Movies</Text>
              <FlatList
                data={movies}
                renderItem={({ item }) => (
                  <MovieCard
                    {...item}
                  />
                )}
                keyExtractor={(item) => item.id.toString()}
                numColumns={3}
                columnWrapperStyle={{
                  justifyContent: 'flex-start',
                  marginBottom: 10,
                  gap: 20,
                }}
                className="mt-2 pb-32"
                scrollEnabled={false}
              />
            </View>
          )}
        </ScrollView>
      </View>
      <SignUpModal visible={userNameModalVisible} setVisible={setUserNameModalVisible} />
    </View>

  );
}
