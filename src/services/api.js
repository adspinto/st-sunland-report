import axios from "axios";

const api = axios.create({
  baseURL: "https://smartytitans.com/api",
});

export default api;
