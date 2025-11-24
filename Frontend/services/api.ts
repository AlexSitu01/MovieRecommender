// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

const MOVIES_URL = 'https://movie-api.alexsitu.cc'


export const fetchMovies = async ({ query }: { query: string }, token: string | null) => {
    if (!token) {
        console.log('No authentication token available')
        throw new Error("Authentication required")
    }

    const endpoint = `${MOVIES_URL}/search?query=${encodeURIComponent(query)}`
    const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        },
    })
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.results;
}

export const fetchMovieDetails = async (movieId: string, token: string | null): Promise<MovieDetails> => {
    if (!token) {
        console.log('No authentication token available')
        throw new Error("Authentication required")
    }

    try {
        const response = await fetch(`${MOVIES_URL}/movie_details/${movieId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                accept: 'application/json',
            }
        });
        if (!response.ok) {
            console.log("Movie " + movieId + " doesn't exist in the tmdb database.")
            console.log(response.status + "-" + response.statusText)
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

export const fetchTrendingMovies = async (token: string | null) => {
    if (!token) {
        console.log('No authentication token available')
        throw new Error("Authentication required")
    }
    const response = await fetch(`${MOVIES_URL}/trending`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        }
    })
    if (response.status == 401) {
        console.log('Get request for recs timed out')
        throw new Error("Request for movie recommendation timed out")
    }
    if (!response.ok) {
        throw new Error('Failed to fetch Trending Movies')
    }
    const data = await response.json()
    return data.results
}

// takes in a query string and the number of objects you want returned
// 
export async function fetchMovieAutofill(query: string, n: number, token: string | null) {
    if (!token) {
        console.log('No authentication token available')
        throw new Error("Authentication required")
    }

    const response = await fetch(`${MOVIES_URL}/autofill?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        }
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

export async function fetchRecs(movie_id: string, token: string | null): Promise<Number[] | null> {

    if (!token) {
        console.log('No authentication token available')
        throw new Error("Authentication required")
    }
    const response = await fetch(`${MOVIES_URL}/recs/${movie_id}`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
            accept: 'application/json',
        }
    })
    if (response.status == 401) {
        console.log('Get request for recs timed out')
        throw new Error("Request for movie recommendation timed out")
    }
    if (!response.ok) {
        throw new Error("Failed to get movie recommendations")
    }

    const data = await response.json()

    return data.recs
}


