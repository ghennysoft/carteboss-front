import axios, {
  AxiosError,
  InternalAxiosRequestConfig,
} from 'axios';
import { ApiError } from './api-error';

const API_URL = process.env.NEXT_PUBLIC_API_URL

const api = axios.create({
  baseURL: `${process.env.API_URL}/api`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

let isRefreshing = false;

let failedQueue: Array<{
  resolve: () => void;
  reject: (err: unknown) => void;
}> = [];

function processQueue(error: unknown = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve();
    }
  });

  failedQueue = [];
}

api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const original = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (!original) {
      return Promise.reject(error);
    }

    const requestUrl = original.url || '';

    const isAuthEndpoint =
      requestUrl.includes('/auth/login/') ||
      requestUrl.includes('/auth/refresh/') ||
      requestUrl.includes('/auth/logout/');

    if (
      error.response?.status === 401 &&
      !original._retry &&
      !isAuthEndpoint
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: () => resolve(api(original)),
            reject,
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        /*
         * Pas besoin de récupérer le refresh_token.
         *
         * Le navigateur l'envoie automatiquement
         * puisque withCredentials = true.
         */
        await axios.post(
          `${API_URL}/api/auth/refresh/`,
          {},
          {
            withCredentials: true,
          }
        );

        processQueue();

        return api(original);

      } catch (refreshError) {
        processQueue(refreshError);

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    const status = error.response?.status || 500;
    const data = error.response?.data;

    const message =
      (data as Record<string, unknown>)?.detail as string ||
      error.message ||
      'Erreur réseau';

    return Promise.reject(
      new ApiError(message, status, data)
    );
  }
);

export default api;