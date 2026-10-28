import axios from 'axios';

const API = axios.create({
  baseURL: "https://support-flow-ten.vercel.app/api" || 'http://localhost:5000/api',
});

export default API;