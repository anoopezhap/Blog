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

export async function googleAuth(email, username, googlePhotoUrl) {
  const body = { email: email, name: username, googlePhotoUrl };
  const res = await axios.post("/api/auth/google", body, {
    withCredentials: true,
  });

  return res;
}

export async function updateUser(userId, username, password, profilePicture) {
  const body = { username, password, profilePicture, userId };

  const res = await axios.put(`/api/user/update/${userId}`, body, {
    withCredentials: true,
  });

  return res;
}

export async function deleteUser(userId) {
  //console.log("userId", userId);
  const res = await axios.delete(`/api/user/delete/${userId}`, {
    withCredentials: true,
  });
  return res;
}
