// src\api\api.ts

import axios from "axios";

export const userApi = axios.create({
  baseURL: import.meta.env.VITE_USER_SERVICE_API_URL,
});

export const postApi = axios.create({
  baseURL: import.meta.env.VITE_POST_SERVICE_API_URL,
});
