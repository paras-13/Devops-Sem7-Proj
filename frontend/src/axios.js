import axios from "axios";

// To run it at localhost environment use this
// export const makeRequest = axios.create({
//   baseURL: "http://localhost:8800/api",
//   withCredentials: true,
// });

// To run it using jenkins use this
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const makeRequest = axios.create({
  baseURL: baseURL,
  withCredentials: true,
});
