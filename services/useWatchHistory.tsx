import React, { createContext, PropsWithChildren, use, useEffect, useState } from 'react'
import { getCurrentUser, supabase } from './supabase';
import { useSession } from './Auth';


type WatchHistoryContextType = {
    history: string[]
    addMovie: (movie_id: string) => void
    removeMovie: (movie_id: string) => void
    hasWatched: (movie_id: string) => boolean
    loading: boolean
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
    const [history, setHistory] = useState<string[]>([]);
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
                setHistory(savedHistory.map((item) => item.movie_id))
            }
            setLoading(false)
        }
        loadHistory()
    }, [session])

    const addMovie = (movie_id: string) => {
        if (!history.includes(movie_id)) {
            setHistory((prev) => [...prev, movie_id])
        }
    }

    const removeMovie = (movie_id: string) => {
        setHistory((prev) => prev.filter((id) => id !== movie_id))
    }

    const hasWatched = (movie_id: string) => {
        return history.includes(movie_id)
    }

    return (
        <WatchHistoryContext.Provider value={{ history, addMovie, removeMovie, hasWatched, loading }}>
            {children}
        </WatchHistoryContext.Provider>
    )
}
