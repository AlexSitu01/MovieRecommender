// const url = 'https://api.themoviedb.org/3/authentication';
// const options = {method: 'GET', headers: {accept: 'application/json'}};

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

export const fetchTrendingMovies = async() => {
    const response = await fetch(`${TMBD_CONFIG.BASE_URL}/trending/movie/week`, {
        method : 'GET',
        headers: TMBD_CONFIG.headers
    })
    if (!response){
        throw new Error('Failed to fetch Trending Movies')
    }
    const data = await response.json()
    return data.results
}