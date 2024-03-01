import useAxios from "../hooks/useAxios";

const axios = useAxios();

export async function createUser(username, email, password) {
  const body = { username, email, password };

  const res = await axios.post("/api/auth/signup", body);

  return res;
}

export async function signIn(email, password) {
  const body = { email, password };

  const res = await axios.post("/api/auth/signin", body, {
    withCredentials: true,
  });

  return res;
}
