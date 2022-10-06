console.log(process.env);

export const sidebarWidth = 240;
export const API_ENDPOINT = process.env.NODE_ENV === 'production' ? '' : 'http://localhost:3500';
