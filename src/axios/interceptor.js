import axios from "axios";

// const { token } = useContext(UserContext);
axios.defaults.withCredentials = true;
const url = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: url,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const refreshToken = async () => {
  try {
    const refreshToken = localStorage.getItem("refreshToken");
    const response = await axiosInstance.post("/api/user/refresh", {
      refreshToken,
    });

    localStorage.setItem("accessToken", response.data.accessToken);

    return response.data.accessToken;
  } catch (err) {
    throw err;
  }
};

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response.status === 401 || error.response) {
      const originalRequest = error.config;
      try {
        const newAccessToken = await refreshToken();

        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axiosInstance(originalRequest);
      } catch (err) {
        // If refresh token request also fails, assume the refresh token has expired
        if (err.response && (err.response.status === 401 || err.response.status === 403)) {
          // Clear user session and token data
          console.error("Session expired. Please log in again.");

          // Redirect to login or handle logout logic
          window.location.href = "/login";
        }
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
