import { movie_status } from '@/app/(app)/movies/[id]';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

export const supaBaseConfig = {
    supabaseUrl: 'https://zfzkxbblphcqsicpmedw.supabase.co',
    supabaseKey: process.env.EXPO_PUBLIC_SUPABASE_KEY ?? '',
}

export const getSupabase = () => {
    if (!supaBaseConfig.supabaseKey) {
        throw new Error('Supabase key is missing');
    }
    const storage =
        Platform.OS === 'web'
            ? (typeof window !== 'undefined' ? window.localStorage : undefined)
            : AsyncStorage

    const supabase = createClient(
        supaBaseConfig.supabaseUrl,
        supaBaseConfig.supabaseKey,
        {
            auth: {
                storage: storage,
                autoRefreshToken: true,
                persistSession: true,
                detectSessionInUrl: Platform.OS === 'web',
            },
        }
    );
    return supabase;
}

export async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.error('Error getting user:', error.message)
            return null
        }
        if (user) {
            return user
        } else {
            console.log('No user currently logged in.')
            return null
        }
    } catch (error) {
        console.error('An unexpected error occurred')
        return null
    }
}


export async function updateMovieStatus(movie_id: string, status: movie_status = movie_status.Remove, rating: number | null = null) {

    const user = await getCurrentUser()
    const userId = user?.id

    if (status === movie_status.Remove) {
        const { error: removeError } = await supabase.from('watched_movies').delete().eq('user_id', user?.id).eq('movie_id', movie_id)
        if (removeError) {
            throw new Error("Error removing movie status")
        }
        return
    }

    const { data: existingRecord, error: selectError } = await supabase.from('watched_movies').select().eq('user_id', user?.id).eq('movie_id', movie_id)


    if (selectError) {
        throw new Error("Error searching for existing record")
    }

    if (!user) {
        throw new Error("Error getting user")
    }

    // if the movie-user record doesnt exist
    if (existingRecord && existingRecord.length === 0) {

        const data = {
            user_id: userId,
            movie_id: movie_id,
            movie_status: status,
            user_rating: rating
        }

        const { data: bookmarkData, error } = await supabase.from('watched_movies').insert([data]).select()
        if (error) {
            throw new Error(`Failed to bookmark movie: ${error.message}`)
        }
    }
    else {
        // update movie status if the movie-user record exists
        const { data, error: updateError } = await supabase.from('watched_movies').update({ movie_status: status }).eq('user_id', user?.id).eq('movie_id', movie_id).select()
        console.log("Supabase update data:", data);
        console.log("Supabase update error:", updateError);
        if (updateError) {
            throw new Error("Error updating movie status")
        }
    }
}

// can only be used if the movie entry already exists for that user
export async function updateMovieRating(movie_id: string, rating: number | null) {
    const user = await getCurrentUser()

    const { data: existingRecord, error: selectError } = await supabase.from('watched_movies').select().eq('user_id', user?.id).eq('movie_id', movie_id)

    if (selectError) {
        throw new Error("Error searching for existing record")
    }

    if (!user) {
        throw new Error("Error getting user")
    }

     if (existingRecord && existingRecord.length === 0) {
        throw new Error("Updating rating error for nonexisitng movie entry")
     }
     else{
        // update movie rating if the movie-user record exists
        const { data, error: updateError } = await supabase.from('watched_movies').update({ user_rating: rating }).eq('user_id', user?.id).eq('movie_id', movie_id).select()
        console.log("Supabase update data:", data);
        if (updateError) {
            throw new Error("Error updating movie rating")
        }
     }
}

export async function getHistory() {
    const user = await getCurrentUser()
    const { data, error } = await supabase.from('watched_movies').select().eq('user_id', user?.id)

    if (error) {
        throw new Error("There was an error getting the users history", error)
    }
    return data
}

export async function getTopMovies(){
    const user = await getCurrentUser()
    const { data, error } = await supabase.from('top_movies').select().eq('user_id', user?.id)

    if (error) {
        throw new Error("There was an error getting the users history", error)
    }
    return data
}

export async function updateUsername(username: string) {
    const user = await getCurrentUser()
    const {data, error} = await supabase.from('profiles').update({username}).eq('id', user?.id)
    if (error) {
        throw new Error(error.message)
    }
    return data
}

export async function getProfile() {
    const user = await getCurrentUser()
    const { data, error } = await supabase.from('profiles').select().eq('id', user?.id).single()

    if (error) {
        throw new Error("There was an error getting the users profile", error)
    }
    return data
}

export const supabase = getSupabase();