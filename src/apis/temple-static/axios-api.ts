import axios from 'axios';

import { TEMPLE_WALLET_STATIC_API_URL } from 'src/utils/env.utils';

export const axiosApi = axios.create({ baseURL: TEMPLE_WALLET_STATIC_API_URL + '/api' });
