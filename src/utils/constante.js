let BASE_API_URI;
let FRONT_API_URL

if(import.meta.env.VITE_ENV === 'developpement') {
    BASE_API_URI = import.meta.env.VITE_API_URL_LOCAL;
} else if(import.meta.env.VITE_ENV === 'test') {
    BASE_API_URI = import.meta.env.VITE_API_URL_TEST;
} else {
    BASE_API_URI = import.meta.env.VITE_API_URL_PRODUCTION;
}

export const BASE_API_URL = BASE_API_URI;