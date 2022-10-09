console.log(process.env);

export const sidebarWidth = 240;
export const API_ENDPOINT =
  process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_VERCEL_ENV
      ? 'https://node-sign-up-in.herokuapp.com'
      : ''
    : 'http://localhost:3500';
