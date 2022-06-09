import { GLOBAL_TYPE } from './types';

const errNetwork = (err: boolean = true) => ({
  type: GLOBAL_TYPE.ERR_NETWORK,
  payload: err,
});

export { errNetwork };
