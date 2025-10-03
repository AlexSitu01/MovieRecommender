import { createClient } from '@supabase/supabase-js'
import AsyncStorage from '@react-native-async-storage/async-storage'
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

async function getCurrentUser() {
    try {
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
            console.error('Error getting user:', error.message)
            return null
        }
        if (user) {
            console.log('Current User ID:', user.id)
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

export async function bookmarkMovie(movie_id: string) {
    const user = await getCurrentUser()

    if (!user) {
        throw new Error("Error getting user")
    }
    const userId = user?.id

    const data = {
        user_id: userId ,
        movie_id: movie_id 
    }

    const { data: bookmarkData, error } = await supabase.from('watched_movies').insert([data]).select()
    if (error) {
        throw new Error(`Failed to bookmark movie: ${error.message}`)
    }
}

export const supabase = getSupabase();