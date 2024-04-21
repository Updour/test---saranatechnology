import axios from 'axios';
import moment from 'moment';

const _handleStorage = () => {
    const token = localStorage.getItem('accessToken');
    return token ? `Bearer ${token.replace(/"/g, '')}` : null;
}

const API_SERVE = axios.create({
    baseURL: "https://test.saranatechnology.com/",
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

API_SERVE.interceptors.request.use(
    config => {
        const token = _handleStorage();
        if (token) {
            config.headers.Authorization = token;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

export { API_SERVE }; 

export const ForDate = (val) => moment(val).format('DD/MM/YYYY HH:mm:ss');
