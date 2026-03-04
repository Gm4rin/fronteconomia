import axios from 'axios';
// mudanca forçada para limpar cache do vercel 
export const api = axios.create({
  baseURL: '/api',  
});