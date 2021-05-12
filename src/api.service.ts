import axios from 'axios';

const BASE_URL = 'https://api.better-call.dev/v1';
export const api = axios.create({ baseURL: BASE_URL });
