console.log(process.env);

export const sidebarWidth = 240;
export const API_ENDPOINT =
  process.env.REACT_APP_ENV === 'production' ? 'api' : 'http://localhost:3500';
