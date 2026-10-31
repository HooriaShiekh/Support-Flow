import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '${import.meta.env.VITE_BACKEND_URI}/api',
});

export default API;