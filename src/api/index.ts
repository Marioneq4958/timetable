import axios from 'axios';

const apiOrigin = import.meta.env.VITE_API_ORIGIN;
if (!apiOrigin) throw new Error('Missing "VITE_API_ORIGIN" environment variable')

export default axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  headers: { 'Content-Encoding': 'application/json' },
});
