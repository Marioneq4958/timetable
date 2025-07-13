import axios from 'axios';

const apiOrigin = import.meta.env.VITE_API_ORIGIN;
if (!apiOrigin) throw new Error('Missing "VITE_API_ORIGIN" environment variable')

export default axios.create({
  baseURL: import.meta.env.VITE_API_ORIGIN,
  transformResponse: (data, headers) => {
    if (headers['content-type'] !== 'application/json') throw new Error(`Unsupported response content type "${headers['content-type']}"`);
    return JSON.parse(data);
  }
});
