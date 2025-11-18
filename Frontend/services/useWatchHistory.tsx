import { movie_status } from '@/app/(app)/movies/[id]';
import { createContext, PropsWithChildren, use, useEffect, useState } from 'react';
import { useSession } from './Auth';
import { getCurrentUser, supabase } from './supabase';


type WatchHistoryContextType = {
    movieHistory: movieHistory[]
    addMovie: (movie_id: string, movie_status: movie_status) => void
    removeMovie: (movie_id: string) => void
    getRating: (movie_id: string) => number | null
    getStatus: (movie_id: string) => movie_status | null
    updateMovieStatusContext: (moive_id: string, new_movie_status: movie_status) => void,
    updateRating: (movie_id: string, new_rating: number) => void,
    updateFavoritedMovie: (movie_id: string, favorited: boolean) => void,
    isFavorited: (movie_id: string) => boolean,
    loading: boolean
}

type movieHistory = {
    movie_id: string
    movie_status: movie_status | null
    user_rating: number | null
    favorited: boolean
}

export const WatchHistoryContext = createContext<WatchHistoryContextType | null>(null)

export function useWatchHistory() {
    const value = use(WatchHistoryContext)
    if (!value) {
        throw new Error("useWatchHistoryStore must be wrapped in <WatchHistoryStoreProvider>")
    }
    return value
}

export function WatchHistoryProvider({ children }: PropsWithChildren) {
    const [movieHistory, setHistory] = useState<movieHistory[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const { session } = useSession()

    useEffect(() => {
        if (!session) {
            setHistory([]) // clear when logged out
            return
        }
        const loadHistory = async () => {
            setLoading(true)

            const user = await getCurrentUser()
            const { data: savedHistory, error: searchHistoryError } = await supabase.from('watched_movies').select().eq('user_id', user?.id)
            if (searchHistoryError) {
                throw new Error("Erorr getting the users history")
            }
            if (savedHistory && savedHistory.length > 0) {
                setHistory(savedHistory.map((item) => ({
                    movie_id: item.movie_id,
                    movie_status: item.movie_status,
                    user_rating: item.user_rating,
                    favorited: item.favorited

                })))
            }
            setLoading(false)
        }
        loadHistory()
    }, [session])

    const addMovie = (movie_id: string, movie_status: movie_status, user_rating: number | null = null, favorited=false) => {

        setHistory((prev) => {
            const exists = prev.some((item) => item.movie_id == movie_id);

            if (!exists) {
                return [...prev, { movie_id, movie_status, user_rating, favorited }]
            }
            return prev
        })

    }

    const removeMovie = (movie_id: string) => {
        setHistory((prev) => {
            const exists = prev.some((item) => item.movie_id == movie_id);

            if (exists) {
                return prev.filter(item => item.movie_id !== movie_id)
            }
            return prev
        })
    }

    const updateMovieStatusContext = (movie_id: string, new_movie_status: movie_status | null, new_rating: number | null = null) => {
        setHistory((prev) => {
            return prev.map((movie) => {
                if (movie.movie_id === movie_id) {
                    return { ...movie, movie_status: new_movie_status, user_rating: new_rating }; // assign new status
                }
                return movie;
            });
        });
    };

    const updateRating = (movie_id: string, new_rating: number) => {
        setHistory((prev) => {
            return prev.map((movie) => {
                if (movie.movie_id === movie_id) {
                    return { ...movie, user_rating: new_rating }; // assign new rating
                }
                return movie;
            });
        });
    };


    const getStatus = (movie_id: string): movie_status | null => {
        const record = movieHistory.find(e => e.movie_id === movie_id);
        return record?.movie_status as movie_status ?? null;
    }

    const getRating = (movie_id: string): number | null => {
        const record = movieHistory.find(e => e.movie_id == movie_id)
        return record?.user_rating ?? null
    }

    const updateFavoritedMovie = (movie_id: string, favorited: boolean) =>{
        setHistory((prev) => {
            return prev.map((movie) => {
                if (movie.movie_id === movie_id) {
                    return { ...movie, favorited:  favorited}; // assign new rating
                }
                return movie;
            });
        });
    }

    const isFavorited = (movie_id: string) => {
        const record = movieHistory.find(e => e.movie_id == movie_id)
        return record?.favorited ?? false
    }

    return (
        <WatchHistoryContext.Provider value={{ movieHistory, addMovie, removeMovie, loading, getStatus, updateMovieStatusContext, getRating, updateRating, updateFavoritedMovie, isFavorited }}>
            {children}
        </WatchHistoryContext.Provider>
    )
}
