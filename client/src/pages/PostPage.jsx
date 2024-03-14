import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getPostBySlug } from "../api/postApi";
import { Button, Spinner } from "flowbite-react";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import { getPostCommentsById } from "../api/commentApi";
import { useState } from "react";

function PostPage() {
  const { postSlug } = useParams();

  const [postId, setPostId] = useState(null);

  const { isPending, isError, isSuccess, data, error } = useQuery({
    queryKey: ["postbyslug"],
    queryFn: () => getPostBySlug(postSlug),
  });

  // let post;
  // if (isSuccess) {
  //   post = data[0];
  // }

  // if (isSuccess) {
  //   console.log("posts", data[0]);
  //   console.log("postId", data[0]._id);
  // }

  // if (isPending) {
  //   return <p>Is loading...</p>;
  // }

  const {
    isPending: commentIsPending,
    isError: commentIsError,
    isSuccess: commentIsSuccess,
    data: commentsData,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: () => getPostCommentsById(data[0]?._id),
    enabled: !!data?.[0]._id,
  });

  if (isPending || commentIsPending) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl" />
      </div>
    );
  }

  if (isError || commentIsError) {
    return <p>Something happend</p>;
  }

  if (isSuccess && commentIsSuccess) {
    // console.log("posts", data?.[0]);
    // console.log("comment", commentsData.data);
  }

  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {data[0]?.title}
      </h1>
      <Link
        to={`/search?category=${data[0].category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {data[0]?.category}
        </Button>
      </Link>
      <img
        src={data[0]?.image}
        alt={data[0]?.title}
        className="mt-10 p-3 max-h-[600px] w-full object-cover"
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{new Date(data[0]?.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {(data[0]?.content.length / 1000).toFixed(0)} mins read
        </span>
      </div>
      <div
        className="p-3 max-w-2xl mx-auto w-full post-content"
        dangerouslySetInnerHTML={{ __html: data[0]?.content }}
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
        <CommentSection commentsData={commentsData} />
      </div>
    </main>
  );
}

export default PostPage;
