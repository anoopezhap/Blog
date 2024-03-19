import useAxios from "../hooks/useAxios";

const axios = useAxios();

export async function getSummary(currentUserId) {
  const users = await axios.get("/api/user/getusers?limit=5", {
    withCredentials: true,
  });
  const comments = await axios.get("/api/comment/getComments?limit=5", {
    withCredentials: true,
  });
  const posts = await axios.get(
    `/api/post/getPosts?userId=${currentUserId}&limit=5`
  );

  const res = { users, comments, posts };

  return res;
}
