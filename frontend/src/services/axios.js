import axios from 'axios'

// let baseURL = ''
// if (process.env.REACT_APP_PRODUCTION === 'true') {
//     baseURL = process.env.REACT_APP_API_URL
// } else {
//     baseURL = 'http://localhost:8000/'
// }

let baseURL = 'http://localhost:8000/'

// Create axios instance
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        Authorization: window.localStorage.getItem('access_token')
        ? 'Bearer ' + window.localStorage.getItem('access_token')
        : null,
        'Content-Type': 'application/json',
        accept: 'application/json',
    },
})


// Intercept requests to check accessToken is still valid and get a new one if not
axiosInstance.interceptors.request.use(async req => {

    const refreshToken = window.localStorage.getItem('refresh_token') ? window.localStorage.getItem('refresh_token') : null

    if (refreshToken) {
        const accessToken = window.localStorage.getItem('access_token') ? window.localStorage.getItem('access_token') : null
        if (accessToken){
            const accessTokenParts = JSON.parse(atob(accessToken.split('.')[1]))
            const accessTokenNow = Math.ceil(Date.now() / 1000);

            if (accessTokenParts.exp > accessTokenNow) {
                return req
            }

            const refreshTokenParts = JSON.parse(atob(refreshToken.split('.')[1]))
            const refreshTokenNow = Math.ceil(Date.now() / 1000)
            if (refreshTokenParts.exp > refreshTokenNow) {

                const response = await axios.post(`${baseURL}api/token/refresh/`, {refresh: refreshToken})
            
                window.localStorage.setItem('access_token', response.data.access)
                if (response.data.refresh) {
                    window.localStorage.setItem('refresh_token', response.data.refresh)
                }
                req.headers = {...req.headers, Authorization: `Bearer ${response.data.access}`}
            }
        }
    }
    return req
})


// Intercept error responses, most importantly get new access token if it had expired but refresh token has not,
// and for some reason we failed to do this in the request interceptor
axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error?.config

		if (typeof error.response === 'undefined') {
            // A server or network error occurred. Maybe CORS might be the problem.
			return Promise.reject(error)
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + 'api/token/refresh/'
		) {
			window.location.href = '/login/'
			return Promise.reject(error)
		}

		if (
			error.response.data.code === 'token_not_valid' &&
			error.response.status === 401 &&
			error.response.statusText === 'Unauthorized' &&
            !originalRequest?.sent
		) {
			const refreshToken = window.localStorage.getItem('refresh_token') ? window.localStorage.getItem('refresh_token') : null

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split('.')[1]))

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000)

				if (tokenParts.exp > now) {
					return axiosInstance
                        //get new accessToken and then resend the original request
						.post('api/token/refresh/', { refresh: refreshToken })
						.then((response) => {
							window.localStorage.setItem('access_token', response.data.access)
                            if (response.data.refresh) {
							    window.localStorage.setItem('refresh_token', response.data.refresh)
                            }

							axiosInstance.defaults.headers['Authorization'] =
								'Bearer ' + response.data.access;
							originalRequest.headers['Authorization'] =
								'Bearer ' + response.data.access

                            return axios({
                                ...originalRequest,
                                headers: {...originalRequest.headers, Authorization: `Bearer ${response.data.access}`},
                                sent: true
                            })
						})
						.catch((err) => {
							console.log(err)
						})
				} else {
					console.log('Refresh token is expired', tokenParts.exp, now)
					window.location.href = '/login/'
				}
			} else {
				console.log('Refresh token not available.')
				window.location.href = '/login/'
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

export default axiosInstance
