import { useQuery } from "@tanstack/react-query";
import UpdatePost from "./UpdatePost";
import { getPostById } from "../api/postApi";
import { useParams } from "react-router-dom";
import { Spinner } from "flowbite-react";

function EditPost() {
  const { postId } = useParams();
  const { isPending, isError, isSuccess, data } = useQuery({
    queryKey: ["postbyid", postId],
    queryFn: () => getPostById(postId),
  });

  if (isPending) {
    //console.log("ispending", data);
    return <Spinner />;
  }

  if (isError) {
    return <p>Something happend</p>;
  }

  const postData = data[0];
  //console.log("issucces", data[0]._id);

  return <UpdatePost postData={postData} />;
}

export default EditPost;
