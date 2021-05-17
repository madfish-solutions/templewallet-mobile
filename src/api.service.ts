import axios from 'axios';

const baseURL = 'https://api.better-call.dev/v1';
export const api = axios.create({ baseURL });
