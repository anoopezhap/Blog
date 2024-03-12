import useAxios from "../hooks/useAxios";

const axios = useAxios();

export async function createPost(formData) {
  const body = { ...formData };

  const res = await axios.post("/api/post/create", body, {
    withCredentials: true,
  });

  return res;
}

export async function getAllPostsByUser(currentUserId, props) {
  const res = await axios.get(
    `/api/post/getPosts?userId=${currentUserId}&startIndex=${props.pageParam}`
  );
  return res.data.posts;
}
