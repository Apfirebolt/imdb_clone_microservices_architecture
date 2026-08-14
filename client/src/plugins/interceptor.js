import axios from 'axios';

let baseURL = 'https://imdb236.p.rapidapi.com/api/';

// add x-rapidapi-host and x-rapidapi-key headers
const headers = {
    'x-rapidapi-host': import.meta.env.VITE_RAPIDAPI_HOST,
    'x-rapidapi-key': import.meta.env.VITE_RAPIDAPI_KEY
};

const httpClient = axios.create({ baseURL, headers });

// print request headers
httpClient.interceptors.request.use(request => {
    return request;
});

export default httpClient;