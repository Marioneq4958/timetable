import axios from 'axios';

export default axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  headers: { 'Content-Encoding': 'application/json' },
});
