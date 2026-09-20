const SERVER_KEY = 'yatrax_emergency_server_url';

export const getServerBaseUrl = () => String(localStorage.getItem(SERVER_KEY) || import.meta.env.VITE_API_BASE_URL || import.meta.env.VITE_EMERGENCY_SERVER_URL || '').trim().replace(/\/+$/, '');
export const serverApiUrl = (path) => `${getServerBaseUrl()}${path}`;
