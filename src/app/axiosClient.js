import axios from "axios";

const axiosClient = axios.create({
  baseURL: "/api", // Replace with your API base URL
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosClient;
