import Axios from "axios";

export default function useAxios() {
  const axios = Axios.create({
    baseURL: "http://localhost:3000",
  });

  return axios;
}
