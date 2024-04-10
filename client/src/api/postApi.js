import { createHashRouter } from "react-router-dom";
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

export async function getPostById(postId) {
  const res = await axios.get(`/api/post/getPosts?postId=${postId}`);
  return res.data.posts;
}

export async function deletePost(body) {
  const { postId, userId } = body;

  const res = await axios.delete(`/api/post/deletepost/${postId}/${userId}`, {
    withCredentials: true,
  });

  return res;
}

export async function updatePost(updatePostData) {
  const { _id: postId, userId, loggedInUserId } = updatePostData;

  //console.log(postId, userId, loggedInUserId);

  const res = await axios.put(
    `/api/post/updatepost/${postId}/${loggedInUserId}`,
    updatePostData,
    {
      withCredentials: true,
    }
  );
  return res;
}

export async function getPostBySlug(slug) {
  const res = await axios.get(`/api/post/getPosts?slug=${slug}`);
  return res.data.posts;
}

export async function getRecentPosts(order, limit) {
  const res = await axios.get(
    `/api/post/getPosts?order=${order}&limit=${limit}`
  );
  return res.data.posts;
}

export async function getPostsBySearch(sort, category, props) {
  //console.log("beforesort", sort, "beforecategory", category);

  // sort === undefined ? (sort = "asc") : "";
  // category === undefined ? (category = "all") : "";

  //onsole.log("sort", sort, "category", category);

  if (category === "all") {
    const res = await axios.get(
      `/api/post/getPosts?order=${sort}&startIndex=${props.pageParam}`
    );

    return res.data.posts;
  } else {
    const res = await axios.get(
      `/api/post/getPosts?order=${sort}&category=${category}&startIndex=${props.pageParam}`
    );
    return res.data.posts;
  }
}
