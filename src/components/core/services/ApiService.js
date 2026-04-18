import axios from "axios";
import { inject } from "vue";
import { useNotifier } from "../composables/UseNotifier";
import { useLoading } from "../composables/UseLoading";
import { ApiPaths, ApiPathsExcludeToLoading } from "../Utils/PathsApi";
const { notify } = useNotifier();
const { isLoading } = useLoading();

const apiClient = axios.create({
  baseURL: "http://localhost:8080",
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use(
  async (config) => {
    const path = config.url;

    if (!ApiPathsExcludeToLoading.includes(path)) {
      isLoading.value = true;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));
    return config;
  },
  (error) => {
    isLoading.value = false;
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas
apiClient.interceptors.response.use(
  (response) => {
    isLoading.value = false;
    if (response.status === 200) {
      if (!ApiPathsExcludeToLoading.includes(response.config.url)) {
        notify(response.data.message, "success");
      }
    }
    return response;
  },
  (error) => {
    if (error.response) {
      const status = error.response.status;

      switch (status) {
        /* case 400:
          toast.error('Solicitud incorrecta (400)');
          break;*/
        case 401:
          notify("No autorizado (401)", "error");
          break;
        case 403:
          notify("Prohibido (403", "error");
          break;
        /*case 404:
          toast.error('No encontrado (404)');
          break;
        case 500:
          toast.error('Error interno del servidor (500)');
          break;
        default:
          toast.error(`Error inesperado (${status})`);*/
      }
      isLoading.value = false;
      notify(error.response.data.message, "error");
    } else {
      isLoading.value = false;
      notify("Error de conexión o sin respuesta del servidor", "error");
    }
    return Promise.reject(error);
  }
);

export default {
  get(url, config) {
    return apiClient.get(url, config);
  },
  post(url, data, config) {
    return apiClient.post(url, data, config);
  },
  put(url, data, config) {
    return apiClient.put(url, data, config);
  },
  delete(url, config) {
    return apiClient.delete(url, config);
  },
};
