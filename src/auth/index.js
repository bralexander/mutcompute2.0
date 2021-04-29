import {createAuthProvider} from 'react-token-auth';

export const [useAuth, authFetch, login, logout] =
    createAuthProvider({
            accessToKey: 'access_token',
            onUpdateToken: (token) => fetch ('/token/refresh', {
                method: 'POST',
                body: token.access_token             
            })
        .then(r => r.json())
    });