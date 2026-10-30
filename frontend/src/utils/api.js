import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://support-flow-ten.vercel.app/api',
});

export default API;