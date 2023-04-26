import globalAxios from 'axios';
import config from '@/config';

const axios = globalAxios.create({
    baseURL: config.apiUrl,
    withCredentials: true
});

axios.interceptors.response.use(
    response => response,
    error => {
        const {
            status,
            config: { url }
        } = error.response;

        if (status === 401 && url !== '/api/auth/login') {
            window.location.href = '/login';
        }

        throw error;
    }
);

export default axios;
