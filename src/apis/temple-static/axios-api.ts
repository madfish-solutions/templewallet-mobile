import axios from 'axios';

import { TEMPLE_WALLET_STATIC_API_URL } from 'src/utils/env.utils';
import { concatUrlPath } from 'src/utils/url.utils';

export const axiosApi = axios.create({ baseURL: concatUrlPath(TEMPLE_WALLET_STATIC_API_URL, '/api') });
