const BASE_URL = process.env.NODE_ENVIRONMENT == "TEST"? 
'http://localhost:8000/' 
: '';

const GOOGLE_REDIRECT_URL = `${BASE_URL}auth/google/callback`;
const GOOGLE_AUTH_URL = 'https://accounts.google.com/o/oauth2/v2/auth';
const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token';


module.exports = {
    BASE_URL, GOOGLE_AUTH_URL, GOOGLE_REDIRECT_URL, GOOGLE_TOKEN_URL
}