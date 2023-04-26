import axios from 'axios';
import config from '@/config';

const http = axios.create({
    baseURL: config.apiUrl,
    withCredentials: true
});

http.interceptors.response.use(
    response => response,
    error => {
        const {
            status,
            config: { url }
        } = error.response;

        if (status === 403 || (status === 401 && url !== '/api/auth/login')) {
            window.location.href = '/login';
        }

        throw error;
    }
);

export default http;
