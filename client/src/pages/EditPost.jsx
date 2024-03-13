import { useQuery } from "@tanstack/react-query";
import UpdatePost from "./UpdatePost";
import { getPostById } from "../api/postApi";
import { useParams } from "react-router-dom";

function EditPost() {
  const { postId } = useParams();
  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ["postbyid"],
    queryFn: () => getPostById(postId),
  });

  if (isPending) {
    return <p>Loading.....</p>;
  }

  if (isError) {
    return <p>Something happend</p>;
  }

  const postData = data[0];

  return <UpdatePost postData={postData} />;
}

export default EditPost;
