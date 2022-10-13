import axios from 'axios';
import { ACTION } from './types';
import { API_ENDPOINT } from '../constants';

const getKlines = (symbol: string, interval: string) => ({
  type: ACTION.GET_KLINES,
  payload: axios.get(`${API_ENDPOINT}/bnb/klines/${symbol}/${interval}`),
});

export { getKlines };
