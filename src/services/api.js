import { Auth } from "aws-amplify";
import axios from "axios";

const api = axios.create({
  baseURL: "https://d38vxan48cjsvv.cloudfront.net/",
});

const error = (error) => {
  console.log(error);
  return Promise.reject(error);
};
const success = async (config) => {
  const authentication = await Auth.currentSession();
  console.log("authentication", authentication);
  const token = authentication.idToken.jwtToken;
  config.headers.Authorization = token ? `Bearer ${token}` : "";
  return config;
};
api.interceptors.request.use(success, error);
export default api;
