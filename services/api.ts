// const url = 'https://api.themoviedb.org/3/authentication';
// const options = {method: 'GET', headers: {accept: 'application/json'}};

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error(err));

export const TMBD_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3/',
    API_KEY: process.env.EXPO_PUBLIC_MOVIE_API_KEY,
    headers:{
        accept: 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_MOVIE_API_KEY}`
    }
}

export const fetchPopularMovies = async({ query }: {query: string}) => {
    const endpoint = query ? `${TMBD_CONFIG.BASE_URL}search/mvoie?query=${encodeURIComponent(query)}` 
                            :`${TMBD_CONFIG.BASE_URL}/discover/movie?sort_by=popularity.desc`;
    
    const response = await fetch( endpoint, {
        method: 'GET',
        headers: TMBD_CONFIG.headers
    })
    if (!response.ok) {
        throw new Error('Failed to fetch movies');
    }

    const data = await response.json();

    return data.resutls;

}