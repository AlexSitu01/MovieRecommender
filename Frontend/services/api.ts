// const url = 'https://api.themoviedb.org/3/authentication';
// const options = {method: 'GET', headers: {accept: 'application/json'}};

import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

export const TMBD_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3/',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers: {
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}



export const fetchMovies = async ({ query }: { query: string }) => {
    const endpoint = query ? `${TMBD_CONFIG.BASE_URL}search/movie?query=${encodeURIComponent(query)}`
        : `${TMBD_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;

    const response = await fetch(endpoint, {
        method: 'GET',
        headers: TMBD_CONFIG.headers
    })
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.results;
}
export const fetchMovieDetails = async (movieId: string): Promise<MovieDetails> => {
    try {
        const response = await fetch(`${TMBD_CONFIG.BASE_URL}movie/${movieId}?api_key=${TMBD_CONFIG.API_KEY}`, {
            method: 'GET',
            headers: TMBD_CONFIG.headers
        });
        if (!response.ok) {
            throw new Error('Failed to fetch movie details');
        }
        const data = await response.json();
        return data;
    }
    catch (err) {
        console.log(err);
        throw err;
    }
}

export const fetchTrendingMovies = async () => {
    const response = await fetch(`${TMBD_CONFIG.BASE_URL}/trending/movie/week`, {
        method: 'GET',
        headers: TMBD_CONFIG.headers
    })
    if (!response) {
        throw new Error('Failed to fetch Trending Movies')
    }
    const data = await response.json()
    return data.results
}

export async function fetchMoviesList(movieIds: string[]) {
    const results = await Promise.all(
        movieIds.map(async (id) => {
            const res = await fetchMovieDetails(id);
            return res;
        })
    );

    // 'results' should be an array of movie objects
    return results; // just in case
}

// takes in a query string and the number of objects you want returned
// 
export async function fetchMovieAutofill(query: string, n: number) {
    const response = await fetch(`${TMBD_CONFIG.BASE_URL}search/movie?query=${query}`, {
        method: 'GET',
        headers: TMBD_CONFIG.headers
    })
    if (!response.ok) {
        throw new Error("Failed to get autofill movies")
    }
    const data = await response.json()

    // return results in descending order of populatirty
    const res = data.results.sort((a: { popularity: number; }, b: { popularity: number; }) => b.popularity - a.popularity)
    const end = Math.min(res.length, n)
    return res.slice(0, end)
}

export async function fetchRecs(movie_id: string): Promise<Number[] | null> {
    const response = await fetch(`http://192.168.0.110:8000/recs/${movie_id}`, {
        method: 'GET'
    })
    if (!response.ok) {
        throw new Error("Failed to get movie recommendations")
    }

    const data = await response.json()

    return data.recs
}