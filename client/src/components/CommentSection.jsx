import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Alert, Button, Textarea } from "flowbite-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { createComment, getPostCommentsById } from "../api/commentApi";
import { get } from "mongoose";
import Comment from "./Comment";

function CommentSection({ commentsData, postId }) {
  const commentList = commentsData.data;

  //console.log("postId", postId);

  const { currentUser } = useSelector((state) => state.user);

  const [comment, setComment] = useState("");

  const queryClient = useQueryClient();

  function handleSubmit(e) {
    e.preventDefault();
    const body = { content: comment, postId, userId: currentUser._id };
    mutate(body);
  }

  const { isPending, isError, isSuccess, data, mutate, error } = useMutation({
    mutationFn: (body) => createComment(body),
    onSuccess: (data) => {
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["comments"] });
    },
    onError: (error) => console.log(Error),
  });

  return (
    <div className="max-w-2xl mx-auto w-full p-e">
      {currentUser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm ">
          <p>Signed in as:</p>
          <img
            className="h-5 w-5 object-cover rounded-full"
            src={currentUser.profilePicture}
            alt={currentUser.usename}
          />
          <Link
            className="text-xs text-cyan-600 hover:underline"
            to="/dashboard?tab=profile"
          >
            @{currentUser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          "You must login to comment"
          <Link className="text-blue-500 hover:underline " to="/sign-in">
            Sign in
          </Link>
        </div>
      )}

      {currentUser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleSubmit}
        >
          <Textarea
            placeholder="Add a comment..."
            rows="3"
            maxLength="200"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          />
          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} Characters remaining
            </p>
            <Button outline gradientDuoTone="purpleToBlue" type="submit">
              Submit
            </Button>
          </div>
          {isError && (
            <Alert color="failure" className="mt-5">
              {error}
            </Alert>
          )}
        </form>
      )}

      {commentsData?.length === 0 ? (
        <p className="text-sm my5">No Comments yet</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-sm">
              <p>{commentList?.length}</p>
            </div>
          </div>
          {commentList.map((comment) => (
            <Comment key={comment._id} comment={comment} />
          ))}
        </>
      )}
    </div>
  );
}

export default CommentSection;
