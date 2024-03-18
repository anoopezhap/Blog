import useAxios from "../hooks/useAxios";

const axios = useAxios();

export async function createComment(body) {
  //console.log("insiede fn", body);
  const res = await axios.post("/api/comment/create", body, {
    withCredentials: true,
  });

  return res;
}

export async function getPostCommentsById(postId) {
  const res = await axios.get(`/api/comment/getPostComments/${postId}`);
  return res;
}

export async function likeComment(commentId) {
  //console.log("comment Id", commentId);
  const res = await axios.put(
    `/api/comment/likeComment/${commentId}`,
    {},
    {
      withCredentials: true,
    }
  );
  return res;
}